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
  display: inline-flex;
  justify-content: space-around;
}
.container-buttons {
  align-items: baseline;
  margin: 1em auto 2em;
  text-align: center;
}
#overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
  color: white;
  cursor: pointer;
}
</style>
<template>
  <v-ons-page>
    <navbar navType='brank'></navbar>
    <div id="overlay" @click="off()">
      <p style="text-align: center; font-size:50px">{{ countdown_num }}</p>
    </div>
    <div class="container-score">
      <graph :spectrums="cur_spectrum"></graph>
      <v-ons-progress-bar :value="Math.floor(time/ 30)" secondary-value="100" modifier=":width=100"></v-ons-progress-bar>
    </div>
    <div class="container-buttons">
      <div class="flex-container">
        <v-ons-button style="margin: 6px 0" @click="startRecording()">開始</v-ons-button>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Navbar from '../../components/navbar/Navbar';
import Ranking from '../ranking/Ranking';
import Chart from './chart'
import Graph from '../../components/draw-spectrum/DrawSpectrum'
import calcScore from '../../services/CalcScore'

// クロスブラウザ定義
navigator.getUserMedia = navigator.getUserMedia || navigator.device.capture || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
function each(xs, fn){ for(var i = 0; i < xs.length; i++) fn(xs[i], i); }

export default {
  name: 'posts-page',
  components: {
    LoadingIndicator,
    Navbar,
    Ranking,
    Chart,
    Graph,
  },
  params: {
    checkid: {
      default: 1,
    },
  },
  data (){
    return {
      ctx: null, 
      audioAnalyser: null, 
      bufferSize: 1024, 
      recordingFlg: false,
      mediaRecoder: null, 
      audioSrc: "", 
      shuoldPlay: false,
      audio: null,
      score: { 
        score: "", 
        user_name: "NoName",
        voice_attributes: { 
          data: null 
        } 
      },
      preSpectrums: [], 
      audioContext: null, 
      chunks: [],
      time: 0, 
      score: 0,
      cur_spectrum: [],
      margin: 10, 
      startDate: false,
      size: { 
        width: 100, 
        height: 50 
      },
      chartData: {}, 
      socre_list: [], 
      idx: 0,
      countdown_timer: null,
      countdown_num: 3,
    }
  },
  mounted(){
    this.clear();
    this.on();
    this.countdown_timer = setInterval(()=>{
      this.countdown_num -= 1;
      if(this.countdown_num<=0){
        clearInterval(this.countdown_timer);
        this.off();
        this.startRecording();
      }
      console.log(this.countdown_num);
    },1000);
  },

  computed: {
    timer: function() { return this.time > 0 ? this.time / 1000 : 0; },
    rounded_score: function(){return Math.round(this.score) },
  },

  methods: {
    on() {
      document.getElementById("overlay").style.display = "block";
      console.log("hoge");
    },
    off() {
      document.getElementById("overlay").style.display = "none";
    },
    startRecording() {
      this.clear();
      this.audioContext =  new AudioContext();
      this.recordingFlg = true;
      navigator.getUserMedia({audio: true}, this.whenGetUserMedia, (e) => { console.log(e) })
    },

    whenGetUserMedia(stream){
      // 音声取得関連
      this.startMediaRecording(stream)

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
      this.cur_spectrum = spectrums
      this.score += (this.socre_list[this.idx++] = calcScore.calc(this.preSpectrums, spectrums));
      this.preSpectrums = spectrums;
      if ((this.time = Date.now() - this.startDate) > 3000) this.endRecording();
    },
    
    createChartData (){
      this.chartData = {
        labels: [...this.socre_list.keys()],
        datasets:[ { label: "スコアの推移", backgroundColor: "#f87979", data: this.socre_list } ]
      }
    },

    endRecording(){
      this.recordingFlg = false;
      this.stopMediaRecording();
      this.audioContext.close();
    },

    startMediaRecording(stream){
      this.mediaRecoder = new MediaRecorder(stream);
      this.mediaRecoder.ondataavailable = (ev)=>{ 
        this.chunks.push(ev.data); 
        this.audio = new Blob(this.chunks);
        this.audioSrc = URL.createObjectURL(this.audio);
        this.postScore();
      };
      this.mediaRecoder.start();
    },

    stopMediaRecording(){
      if (this.mediaRecoder === null) return;
      this.mediaRecoder.stop();
      this.mediaRecoder = null;
    },

    clear(){
      this.idx = 0;
      this.socre_list = Array.apply(null, Array(132)).map(function () {return 0 })
      this.chunks = []
      this.shuoldPlay = false
      this.time = 0
      this.score = 0
      this.preSpectrums = []
      this.startDate=false;
    },


    postScore(){
      if(this.rounded_score!=0){
        console.log(this.audio)
        var params = new FormData()
        params.append("score[score]", this.rounded_score)
        params.append("score[user_name]", "ehama")
        params.append("score[voice_attributes[data]]", this.audio)
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };      
        this.axios.post('http://k-appdev.com:3001/scores', params , config)
        .then(res => {
          this.checkid = res.data.id
          this.$router.push({ name: 'ranking' , params:{checkid: this.checkid}});
        }).catch(res => {console.log(res)});
      }else{
        this.$router.push({ name: 'ranking' }); 
      }
    },
  },
};
</script>
