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
    <v-ons-input placeholder="スコア" float v-model="score.score"></v-ons-input>
    <el-button type="primary" @click="startRecording()">開始</el-button>
    <el-button type="primary" @click="endRecording()">終了</el-button>
    <el-button type="primary" @click="postScore()">送信</el-button>
    <hr>
    <canvas id="canvas2" width="500" height="500"></canvas>
  
  <div class='page-content' align='center'>
    <v-ons-list> 
      <v-ons-list-header>
        <v-ons-icon icon="ion-favorite, material:md-favorite"></v-ons-icon>
        リスト
      </v-ons-list-header>
      <v-ons-list-item @click="goRegion">地域:  {{currentArea.name}}</v-ons-list-item>
      <v-ons-list-item @click="goRegion">並び順：人気順</v-ons-list-item>
    </v-ons-list>
    <!-- <v-ons-list-header>話題のデート体験記</v-ons-list-header> -->
    <v-ons-card v-for='item in experiences' :v-bind='item' v-bind:key="item.id" @click="goPlan(item.id)">
      <img v-bind:src="item.courses[0].thumbnail" style="width: 100%">
      <div class="title">
        {{ item.title }}
      </div>
      <div class="content">
        {{ item.detail }}
      </div>
    </v-ons-card>
    <v-ons-fab @click="goCreate" style="position:fixed;" modifier="material" position="bottom right" >
      <v-ons-icon icon="md-plus"></v-ons-icon>
    </v-ons-fab>
  </div>
  </v-ons-page>
</template>

<script>
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import CreatePlan from '../../pages/create-plan/CreatePlan';
import RegionPage from '../../pages/region/Region';
import DetailPlan from '../../pages/detail-plan/DetailPlan';
import Navbar from '../../components/navbar/Navbar';
import Config from '../../config/Config';
var src="https://code.jquery.com/jquery-3.2.1.js"
if (typeof AudioContext != "undefined") {
  console.log("ok")
}else{
  console.log("ng")
}
// navigator.getMedia = navigator.getUserMedia ||
//                      navigator.webkitGetUserMedia ||
//                      navigator.mozGetUserMedia ||
//                      navigator.msGetUserMedia;
// navigator.getMedia ({ audio:true }, function(stream) {
//   var context = new AudioContext();
//   var source = context.createMediaStreamSource(stream);
//   source.connect(context.destination);
// },function(err){ //エラー処理 
// });
// Prefer camera resolution nearest to 1280x720.
// var constraints = { audio: true, video: { width: 1280, height: 720 } };
// if (!navigator.mediaDevices) {
//   console.log("getUserMedia() not supported.");
// }
// navigator.mediaDevices.getUserMedia(constraints)
// .then(function(stream) {
//   var video = document.querySelector('video');
//   video.src = window.URL.createObjectURL(stream);
//   video.onloadedmetadata = function(e) {
//     video.play();
//   };
// })
// .catch(function(err) {
//   console.log(err.name + ": " + err.message);
// });
// クロスブラウザ定義
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// 変数定義
var localMediaStream = null;
var localScriptProcessor = null;
var audioContext = new AudioContext();
var bufferSize = 1024;
var audioData = []; // 録音データ
var recordingFlg = false;
// キャンバス
var canvas;
var canvasContext;
// 音声解析
var audioAnalyser = null;
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
    }
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
    Navbar
  },
  methods: {
    startRecording() {
        console.log(this.score.score)
        recordingFlg = true;
        navigator.getUserMedia({audio: true}, function(stream) {
            // 録音関連
            localMediaStream = stream;
            var scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
            localScriptProcessor = scriptProcessor;
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
        function(e) {
            console.log(e);
            
        });
        
    },
    endRecording(){
        recordingFlg = false;
    },
    goCreate() {
      this.$emit('push-page', CreatePlan)
    },
    goRegion() {
      this.$emit('push-page', RegionPage)
    },
    goPlan(id) {
      this.$emit('push-page', {
        extends: DetailPlan,
        onsNavigatorProps: {
          plan_id: id,
        }
      })
    },
    postScore(){
      this.axios.post('http://k-appdev.com:3001/scores', {
        score: {  
          score: '',
          user_name: "ehama"
        }
      })
      .then(res => {
        console.log(res)
        console.log(this.score.score)
        this.$ons.notification.alert('スコアを送信しました');
      });
    },
  },
  mounted() {
    // this.axios.get("http://59.157.6.140:3000/plans")
    // .then((res) => {
    //   console.log(res.data);
    //   this.experiences = res.data
    // });
    canvas = document.getElementById('canvas2');
    canvasContext = canvas.getContext('2d');
  },
  data() {
    return {
      config: Config,
      score: {  
          score: '',
          user_name: "ehama"
      },
      experiences: [
        {
          title: 'えはまの奮発日記',
          detail: 'tinderで知り合った女性と食事することになりました。しかし女性の右手には...',
          path: 'detail-plan',
          color: '#085078',
          courses: [{thumbnail:""}]
        },
        {
          title: 'sawlowの遅漏体験',
          detail: '...',
          path: 'detail-plan',
          color: '#085078',
          courses: [{thumbnail:""}]
        },
      ],
    };
  },
  computed: {
    currentArea() {
      return this.$store.state.currentArea;
    },
  }
};
</script>
