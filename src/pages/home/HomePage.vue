<style lang='scss' scoped>
.page-title {
  text-align: center;
}
.body {
  margin-top: 50px;
}
.container-score {
  text-align: center;
  margin: 1em auto 1em;
}
.score-board {
  text-align: center;
  font-size: 1.5em;
}
.chrt {
  text-align: center;
  margin: 1em auto 0;
  width:90%;
}
.flex-container {
  // width: 20%;
  display: inline-flex;
  // flex-direction: column-reverse;
  // flex-direction: row;
  // flex-direction: row-reverse;
  justify-content: space-around;
}
.container-buttons {
  align-items: baseline;
  margin: 1em auto 2em;
  text-align: center;
}
.timer {
  text-align: center;
  margin: 0 auto;
  width: 20%;
  padding: 8px 15px;
  background: #F0BF32;
  border-radius: 20px;
}
</style>
<template>
  <v-ons-page>
    <navbar></navbar>
    <div class="container-score">
      <v-ons-card>
        <div class="score-board">
          {{ rounded_score }}
        </div>
      </v-ons-card>
      <v-ons-button type="primary" @click="postScore()">送信</v-ons-button>
    </div>
    <hr>
    <v-ons-card>
      <div class="chrt">
        <chart :chartData="chartData" :width="500" :height="200"></chart>
      </div>
      <div class="timer">
        <h3>{{ timer }}秒</h3>
      </div>
    </v-ons-card>
    <div class="container-buttons">
      <div class="flex-container">
        <v-ons-button style="margin: 6px 0" @click="startRecording()">開始</v-ons-button>
        <canvas ref="scope" :width="size.width" :height="size.height"></canvas>
        <v-ons-button style="margin: 6px 0" @click="clear()">クリア</v-ons-button>
      </div>
    </div>
    
    <!-- <hr> -->
    <v-ons-list>
      <v-ons-list-header>過去ログ</v-ons-list-header>
      <v-ons-list-item v-for='log in logs' :v-bind='log' v-bind:key='log.id'> {{ log }} </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Navbar from '../../components/navbar/Navbar';
import Ranking from '../ranking/Ranking';
import Chart from './chart'
var src="https://code.jquery.com/jquery-3.2.1.js"
var src="voice_analyse.js"
function each(xs, fn){ for(var i = 0; i < xs.length; i++) fn(xs[i], i); }
// クロスブラウザ定義
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
export default {
  name: 'posts-page',
  components: {
    LoadingIndicator,
    Navbar,
    Ranking,
    Chart,
  },
  data (){
    return {
      ctx: null, audioAnalyser: null, bufferSize: 1024, recordingFlg: false,
      mediaRecoder: null, download: null, mediaStream: null, downloadURL: "", downloadhref: "",
      audioSrc: "", shuoldPlay: false,
      score: { score: '', user_name: "NoName" },
      preSpectrums: [], audioContext: null, chunks: [],
      time: 3000, score: 0, margin: 10, startDate: false,
      size: { width: 100, height: 50 },
      chartData: {}, logs: [], socre_list: [], idx: 0,
    }
  },
  mounted: function(){
    this.ctx = this.$refs.scope.getContext('2d');
    this.clear();
  },
  methods: {
    startRecording() {
      this.clear();
      this.audioContext =  new AudioContext();
      this.recordingFlg = true;
      navigator.getUserMedia({audio: true}, this.whenGtetUserMedia, (e) => { console.log(e) })
    },

    whenGtetUserMedia(stream){
      // 音声取得関連

      this.startMediaRecordinfg(stream)
      var scriptProcessor = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
      var mediastreamsource = this.audioContext.createMediaStreamSource(stream);
      mediastreamsource.connect(scriptProcessor);
      scriptProcessor.onaudioprocess = this.onAudioProcess;
      scriptProcessor.connect(this.audioContext.destination);
      // 音声解析関連
      this.audioAnalyser = this.audioContext.createAnalyser();
      this.audioAnalyser.fftSize = 2048;
      mediastreamsource.connect(this.audioAnalyser);
    },

    onAudioProcess(e) {
      if (!this.recordingFlg) return;
      // 音声のバッファを作成
      this.startDate = this.startDate || Date.now();
      var input = e.inputBuffer.getChannelData(0);
      var bufferData = new Float32Array(this.bufferSize);
      for (var i = 0; i < this.bufferSize; i++) bufferData[i] = input[i];
      // 波形を解析
      var spectrums = new Uint8Array(this.audioAnalyser.frequencyBinCount);
      this.audioAnalyser.getByteFrequencyData(spectrums);
      // 描画
      this.drawSpectrums(spectrums)
      this.score += (this.socre_list[this.idx++] = this.culcSocre(spectrums));
      this.createChartData();
      if ((this.time = 3000 - Date.now() + this.startDate) < 0) this.endRecording();
    },
    
    createChartData (){
      this.chartData = {
        labels: [...Array(this.socre_list.length).keys()],
        datasets:[ { label: "スコアの推移", backgroundColor: "#f87979", data: this.socre_list } ]
      }
    },

    endRecording(){
      this.recordingFlg = false;
      this.stopMediaRecording()
      // this.audioContext.close().then(this.addLogs);
    },

    startMediaRecordinfg(stream){
      this.mediaRecoder = new MediaRecorder(stream);
      this.mediaRecoder.ondataavailable = (ev)=>{ 
        this.chunks.push(ev.data); console.log("hoge") 
        this.audioSrc = URL.createObjectURL(new Blob(this.chunks))
        //this.downloadURL = "test.wav"
      };
      this.mediaRecoder.start();
    },

    stopMediaRecording(){
      if (this.mediaRecoder === null) return;
      this.mediaRecoder.stop();
      this.mediaRecoder = null;
    },

    clear(){
      this.time = 3000, this.score = 0, this.preSpectrums = [], this.startDate=false;
      this.idx = 0, this.socre_list = [];
      this.chartData.datasets[0].data=[];
      this.clearCanvas();
      this.createChartData();
    },

    getGraphSize(){
      var margin = this.margin
      return [margin, this.size.width-margin*2, this.size.height-margin*2];
    },

    drawSpectrums(spectrums){
      var [margin, w, h] = this.getGraphSize();
      this.clearCanvas();
      this.ctx.beginPath();
      each(spectrums, (spe, i, len=spectrums.length) => { 
        var x = (i / len) * w + margin, y = (1 - (spe / 255)) * h + margin;
        if (i === 0) this.ctx.moveTo(x, y);
        else         this.ctx.lineTo(x, y);
      });
      this.ctx.stroke();
    },
    
    clearCanvas(){
      var [m, w, h] = this.getSize(); // _, width, height
      this.ctx.clearRect(0, 0, w+m*2, h+m*2);
      this.drawFrame()
    },
    
    drawFrame(){
      var [m, w, h] = this.getGraphSize(); // margin, width, height
      for(var i in [0, 1]){
        this.ctx.fillRect(m,     h*i+m, w, 1);
        this.ctx.fillRect(w*i+m, m,   1, h);
      };
    },

    culcSocre(spectrums){
      var current_score = 0;
      each(spectrums, (s,i)=>{
        current_score += Math.pow(s - (this.preSpectrums[i] || 0), 2) / 100;
      });
      this.preSpectrums = spectrums;
      return current_score;
    },

    postScore(){
      this.axios.post('http://k-appdev.com:3001/scores', {
        score: {  
          score: this.rounded_score,
          user_name: "ehama"
        }
      })
      .then(res => {
        //console.log(res)
        //console.log(this.score.score)
        //this.$ons.notification.alert('スコアを送信しました');
      });
    },
    goTo(routeName) {
      this.$router.push({ name: routeName });
      //store.commit('toggleMenu', false);
    },
    playAudio(){
      this.shuoldPlay = !(this.shuoldPlay)
    }
  },
  computed: {
    timer: function() { return this.time > 0 ? this.time / 1000 : 0; },
    rounded_score: function(){return Math.round(this.score) },
  },
  directives: {
    play: function (el, binding) {
      if(binding.value){
        el.play().then();
      }else{
        el.pause();
      }
    }
  }
};
</script>