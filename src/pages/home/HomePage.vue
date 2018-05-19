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
    <h3>{{ score }}</h3>
    <button @click="startRecording()">解析開始</button>
    <button @click="clear()">クリア</button>
    <hr>
    <canvas ref="scope" :width="size.width" :height="size.height"></canvas>
    <v-ons-list>
      <v-ons-list-header>過去ログ</v-ons-list-header>
      <v-ons-list-item v-for='log in logs' :v-bind='log' v-bind:key='log.id'> {{ log }} </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Navbar from '../../components/navbar/Navbar';
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
  },


  data (){
    return {
      ctx: null, audioAnalyser: null, bufferSize: 1024, recordingFlg: false,
      preSpectrums: [], audioContext: null,
      t: 0, score: 0, margin: 10,
      size: {
        width: 500, height: 500,
      },
      logs: [],
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
      var input = e.inputBuffer.getChannelData(0);
      var bufferData = new Float32Array(this.bufferSize);
      for (var i = 0; i < this.bufferSize; i++) bufferData[i] = input[i];
    
      // 波形を解析
      var spectrums = new Uint8Array(this.audioAnalyser.frequencyBinCount);
      this.audioAnalyser.getByteFrequencyData(spectrums);

      // 描画
      this.drawSpectrums(spectrums)
      this.score += this.culcSocre(spectrums)
      if(this.t++ > 100) this.endRecording()
    },

    endRecording(){
      this.recordingFlg = false;
      this.audioContext.close().then(this.addLogs);
    },

    clear(){
      this.t = 0, this.score = 0, this.preSpectrums = [];
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
      this.logs.unshift(this.score);
    }
  },
};
</script>
