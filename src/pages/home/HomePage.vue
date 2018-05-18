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
    <h3 id="score">0</h3>
    <button @click="startRecording()">解析開始</button>
    <button @click="endRecording()">解析終了</button>
    <hr>
    <canvas id="canvas2" width="500" height="500"></canvas>
  </v-ons-page>
</template>

<script>
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import Navbar from '../../components/navbar/Navbar';

var src="https://code.jquery.com/jquery-3.2.1.js"

// クロスブラウザ定義
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// 変数定義
var audioContext = new AudioContext();
var bufferSize = 1024;
var audioData = []; // 録音データ
var recordingFlg = false;

// キャンバス
var canvas;
var canvasContext;

// 音声解析
var audioAnalyser = null;
var preSpectrums = [];
var t = 0;
var score = 0;

// 録音バッファ作成（録音中自動で繰り返し呼び出される）
var onAudioProcess = function(e) {
    if (!recordingFlg) return;

    // 音声のバッファを作成
    var input = e.inputBuffer.getChannelData(0);
    var bufferData = new Float32Array(bufferSize);
    for (var i = 0; i < bufferSize; i++) {
        bufferData[i] = input[i];
    }
    // console.log(bufferData)
    //audioData.push(bufferData);

    // 波形を解析
    analyseVoice(); 

    t += 1
    if(t > 100) {
      recordingFlg=false
    }
};

// 解析用処理
var analyseVoice = function() {
    var fsDivN = audioContext.sampleRate / audioAnalyser.fftSize;
    var spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
    audioAnalyser.getByteFrequencyData(spectrums);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    canvasContext.beginPath();
    
    for (var i = 0, len = spectrums.length; i < len; i++) {
        //canvasにおさまるように線を描画
        var x = (i / len) * canvas.width;
        var y = (1 - (spectrums[i] / 255)) * canvas.height;
        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }
        var f = Math.floor(i * fsDivN);  // index -> frequency;
        // console.log(spectrums[i]);
        //500 Hz単位にy軸の線とラベル出力
        if ((f % 500) === 0) {
            var text = (f < 1000) ? (f + ' Hz') : ((f / 1000) + ' kHz');
            //Draw grid (X)
            canvasContext.fillRect(x, 0, 1, canvas.height);
            //Draw text (X)
            canvasContext.fillText(text, x, canvas.height);
        }

        //scoreを計算
        score += Math.pow(spectrums[i] - (preSpectrums[i] || 0), 2) / 100
        var Score = document.getElementById('score');
        Score.innerHTML = score;
    }
    preSpectrums = spectrums
    canvasContext.stroke();

    // x軸の線とラベル出力
    var textYs = ['1.00', '0.50', '0.00'];
    for (var i = 0, len = textYs.length; i < len; i++) {
        var text = textYs[i];
        var gy   = (1 - parseFloat(text)) * canvas.height;
        //Draw grid (Y)
        canvasContext.fillRect(0, gy, canvas.width, 1);
        // Draw text (Y)
        canvasContext.fillText(text, 0, gy);
    }
}


// 解析開始
// 解析終了


var src="voice_analyse.js"

export default {
  name: 'posts-page',

  components: {
    LoadingIndicator,
    Navbar,
  },
  data (){
    return {
      canvas: null,
      ctx: null
    }
  },

  methods: {
    startRecording() {
        recordingFlg = true;
        navigator.getUserMedia({audio: true}, this.record, 
        function(e) {
            console.log(e);
        });
        
    },

    record(stream){
      var scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      var mediastreamsource = audioContext.createMediaStreamSource(stream);
      mediastreamsource.connect(scriptProcessor);
      scriptProcessor.onaudioprocess = onAudioProcess;
      scriptProcessor.connect(audioContext.destination);

      // 音声解析関連
      audioAnalyser = audioContext.createAnalyser();
      audioAnalyser.fftSize = 2048;
      var frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
      var timeDomainData = new Uint8Array(audioAnalyser.frequencyBinCount);
      mediastreamsource.connect(audioAnalyser);
    },

    endRecording(){
        recordingFlg = false;
    },
  },
  mounted() {
    canvas = document.getElementById('canvas2');
    canvasContext = canvas.getContext('2d');
  },
};
</script>
