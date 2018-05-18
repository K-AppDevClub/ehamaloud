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
    <button @click="endRecording()">解析終了</button>
    <hr>
    <canvas ref="scope" :width="size.width" :height="size.height"></canvas>
  </v-ons-page>
</template>

<script>
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Navbar from '../../components/navbar/Navbar';
var src="https://code.jquery.com/jquery-3.2.1.js"
var src="voice_analyse.js"
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
      canvasContext: null, audioAnalyser: null,
      preSpectrums: [], audioData:  [],
      audioContext: new AudioContext(),
      bufferSize: 1024, recordingFlg: false,
      t: 0, score: 0,
      size: {
        width: 500,
        height: 500,
      },
    }
  },

  methods: {
    startRecording() {
      this.canvasContext = this.$refs.scope.getContext('2d');
      this.recordingFlg = true;
      this.t = 0, this.score = 0;
      navigator.getUserMedia({audio: true}, this.record, (e)=>{ console.log(e) });
    },

    record(stream){
      var scriptProcessor = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
      var mediastreamsource = this.audioContext.createMediaStreamSource(stream);
      mediastreamsource.connect(scriptProcessor);
      scriptProcessor.onaudioprocess = this.onAudioProcess;
      scriptProcessor.connect(this.audioContext.destination);

      // 音声解析関連
      this.audioAnalyser = this.audioContext.createAnalyser();
      this.audioAnalyser.fftSize = 2048;
      var frequencyData = new Uint8Array(this.audioAnalyser.frequencyBinCount);
      var timeDomainData = new Uint8Array(this.audioAnalyser.frequencyBinCount);
      mediastreamsource.connect(this.audioAnalyser);
    },

    endRecording(){
      this.recordingFlg = false;
    },

    analyseVoice() {
      var fsDivN = this.audioContext.sampleRate / this.audioAnalyser.fftSize;
      var spectrums = new Uint8Array(this.audioAnalyser.frequencyBinCount);
      this.audioAnalyser.getByteFrequencyData(spectrums);
      this.canvasContext.clearRect(0, 0, this.size.width, this.size.height);
      this.canvasContext.beginPath();
      this.drawSpectrums(spectrums, fsDivN)
    },

    drawSpectrums(spectrums, fsDivN){
      for (var i = 0, len = spectrums.length; i < len; i++) {
        var x = (i / len) * this.size.width, y = (1 - (spectrums[i] / 255)) * this.size.height;
        if (i === 0) {
          this.canvasContext.moveTo(x, y);
        } else {
          this.canvasContext.lineTo(x, y);
        }
        var f = Math.floor(i * fsDivN);  // index -> frequency;
        //500 Hz単位にy軸の線とラベル出力
        if ((f % 500) === 0) {
          var text = (f < 1000) ? (f + ' Hz') : ((f / 1000) + ' kHz');
          this.canvasContext.fillRect(x, 0, 1, this.size.height);
          this.canvasContext.fillText(text, x, this.size.height);
        }

        //scoreを計算
        this.score += Math.pow(spectrums[i] - (this.preSpectrums[i] || 0), 2) / 100
      }
      this.preSpectrums = spectrums
      this.canvasContext.stroke();

      // x軸の線とラベル出力
      var textYs = ['1.00', '0.50', '0.00'];
      for (var i = 0, len = textYs.length; i < len; i++) {
        var text = textYs[i];
        var gy = (1 - parseFloat(text)) * this.size.height;
        this.canvasContext.fillRect(0, gy, this.size.width, 1);
        this.canvasContext.fillText(text, 0, gy);
      }
    },

    onAudioProcess(e) {
      if (!this.recordingFlg) return;
      // 音声のバッファを作成
      var input = e.inputBuffer.getChannelData(0);
      var bufferData = new Float32Array(this.bufferSize);
      for (var i = 0; i < this.bufferSize; i++) bufferData[i] = input[i];
    
      // 波形を解析
      this.analyseVoice();
      if(this.t++ > 100) this.recordingFlg=false
    }
  },
};
</script>
