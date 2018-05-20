<style lang='scss' scoped>
.page-title {
  text-align: center;
}
.body {
  margin-top: 50px;
}
</style>
<template>
  <v-ons-page>
    <navbar></navbar>
    <h3>{{ rounded_score }}</h3>
    <h3>{{ timer }}秒</h3>
    <el-button type="primary" @click="startRecording()">開始</el-button>
    <el-button type="primary" @click="postScore()">ランキングを確認する</el-button>
    <!-- <el-button type="primary" @click="clear()">クリア</el-button> -->
    <!-- <el-button type="primary" @click="$router.push({ name: 'ranking' });">ランキングを確認する</el-button>
     -->
    <hr>
    <canvas ref="scope" :width="size.width" :height="size.height"></canvas>
    <chart :width="size.width" :height="size.height" :chartData="chartData"></chart>
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
  params: {
    checkid: {
      default: 1,
    },
  },

  data (){
    return {
      ctx: null, audioAnalyser: null, bufferSize: 1024, recordingFlg: false,
      score: {  
          score: '',
          user_name: "NoName"
      },
      preSpectrums: [], audioContext: null,
      time: 3000, score: 0, margin: 10, startDate: false,
      size: {
        width: 500, height: 200,
      },
      response: [],
      logs: [],
      //checkid: 1,
      // routeName: Ranking,

      chartData: {labels: [],
                  datasets: [{ label: "hoge", backgroundColor: "#f87979", data: []}]},
      logs: [], socre_list: [], idx: 0,

    }
  },

  mounted: function(){
    this.ctx = this.$refs.scope.getContext('2d');
    this.clear();
    console.log(this.$router)
  },

  methods: {
    startRecording() {
      this.clear();
      this.audioContext =  new AudioContext();
      this.recordingFlg = true;
      navigator.getUserMedia({audio: true}, this.whenGtetUserMedia, (e) => { console.log(e) });
    },

    whenGtetUserMedia(stream){
      // 音声取得関連
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
        datasets:[ { label: "hoge", backgroundColor: "#f87979", data: this.socre_list } ]
      }
    },

    endRecording(){
      //console.log(this.socre_list)
      this.recordingFlg = false;
      this.audioContext.close().then(this.addLogs);
      //console.log(this.chartData.datasets[0].data)
    },
    clear(){
      //console.log(this.score)
      this.time = 3000, this.score = 0, this.preSpectrums = [], this.startDate=false;
      this.idx = 0, this.socre_list = []
      this.clearCanvas();
    },

    getSize(){
      var margin = this.margin
      return [margin, this.size.width-margin*2, this.size.height-margin*2];
    },

    drawSpectrums(spectrums){
      var [margin, w, h] = this.getSize();
      this.clearCanvas();
      this.ctx.beginPath();
      each(spectrums, (spe, i, len=spectrums.length) => { 
        var x = (i / len) * w + margin, y = (1 - (spe / 255)) * h;
        if (i === 0) this.ctx.moveTo(x, y);
        else         this.ctx.lineTo(x, y);
      });
      this.ctx.stroke();
    },
    
    clearCanvas(){
      var [_, w, h] = this.getSize(); // _, width, height
      this.ctx.clearRect(0, 0, w, h);
      this.drawFrame()
    },
    
    drawFrame(){
      var [m, w, h] = this.getSize(); // margin, width, height
      for(var i in [0, 1]){
        this.ctx.fillRect(m,     h*i, w, 1);
        this.ctx.fillRect(w*i+m, 0,   1, h);
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

    addLogs(){
      this.logs.unshift(this.rounded_score);
      if (this.logs.length > 5) this.logs.pop()
      //this.postScore();
      //this.goTo('ranking');
    },

    // goTo(id) {
    //   this.$emit('push-page', {
    //     extends: Ranking,
    //     onsNavigatorProps: {
    //       checkid: id,
    //     }
    //   })
    //   //this.$router.ush({ name: routeName });
    //   //store.commit('toggleMenu', false);
    // },
    goTo(routeName,id){
        this.$router.push({ name: 'ranking' , params:{checkid: id}});
      //console.log (this.id);
    },
    goOnly(){
      this.$router.push({ name: 'ranking' }); 
    },

    postScore(){
      if(this.rounded_score!=0){
        this.axios.post('http://k-appdev.com:3001/scores', {
        score: {  
          score: this.rounded_score,
          user_name: "NoName"
        }
      })
      .then(res => {
        //this.response=res
        console.log(res.data.id)
        this.checkid = res.data.id 
        console.log(this.checkid)
        this.goTo('ranking',this.checkid)
        //console.log(this.score.score)
        //this.$ons.notification.alert('スコアを送信しました');
      });
      }else{
        console.log(this.rounded_score)
        this.goOnly();
      }
    },
    
  },

  computed: {
    timer: function() {
      return this.time > 0 ? this.time / 1000 : 0;
    },
    rounded_score: function() {
      return Math.round(this.score)
    },
  }
};
</script>
