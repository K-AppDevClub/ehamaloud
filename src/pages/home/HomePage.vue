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
    <audio v-bind:src="audioSrc" v-play="shuoldPlay"></audio>
    <el-button type="primary" @click="startRecording()">開始</el-button>
    <el-button type="primary" @click="playAudio()">再生</el-button>
    <el-button type="primary" @click="$router.push({ name: 'ranking' });">ランキングへ</el-button>
    <hr>
    <canvas ref="scope" :width="size.width" :height="size.height"></canvas>
    <chart :width="size.width" :height="size.height" :chartData="chartData"></chart>
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
      mediaRecoder: null, audioSrc: "", shuoldPlay: false, audio: null,
      score: { score: "", user_name: "NoName",
               voice_attributes: { data: null } },
      preSpectrums: [], audioContext: null, chunks: [],
      time: 3000, score: 0, margin: 10, startDate: false,
      size: { width: 500, height: 150 },
      chartData: {}, socre_list: [], idx: 0,
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
        datasets:[ { label: "hoge", backgroundColor: "#f87979", data: this.socre_list } ]
      }
    },

    endRecording(){
      this.recordingFlg = false;
      this.stopMediaRecording();
      this.audioContext.close();
    },

    startMediaRecordinfg(stream){
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
      this.time = 3000, this.score = 0,
      this.idx = 0, this.socre_list = Array.apply(null, Array(132)).map(function () {return 0 }), this.chunks = [], this.shuoldPlay = false
      this.clearCanvas();
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
        var x = (i / len) * w + margin, y = (1 - (spe / 255)) * h+margin;
        if (i === 0) this.ctx.moveTo(x, y);
        else         this.ctx.lineTo(x, y);
      });
      this.ctx.stroke();
    },
    
    clearCanvas(){
      var [margin, w, h] = this.getGraphSize(); // _, width, height
      this.ctx.clearRect(margin, margin, w, h);
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

    playAudio(){
      console.log(this.shuoldPlay)
      return (this.shuoldPlay = !(this.shuoldPlay))
    },

    postScore(){
      console.log(this.audio)
      var params = new FormData()
      params.append("score[score]", this.rounded_score)
      params.append("score[user_name]", "ehama")
      params.append("score[voice_attributes[data]]", this.audio)
      console.log(params)
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };      
      this.axios.post('http://k-appdev.com:3001/scores', params , config)
      .then(res => {
        console.log(res)
        //console.log(this.score.score)
        //this.$ons.notification.alert('スコアを送信しました');
      }).catch(res => {console.log(res)});
    },
    goTo(routeName) {
      this.$router.push({ name: routeName });
      //store.commit('toggleMenu', false);
    },
  },
  
  computed: {
    timer: function() { return this.time > 0 ? this.time / 1000 : 0; },
    rounded_score: function(){return Math.round(this.score) },
  },

  directives: {
    play: function (el, binding) {
      if(binding.value) {
        el.play();
        el.addEventListener("ended", () => {
          vm.playAudio();
        }, false);
      }
      else el.pause();
    },
    
  },

};
</script>