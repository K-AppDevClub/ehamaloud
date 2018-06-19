<style lang='scss' scoped>

.ranklist{
  width:100%;
  font-size: 1.2em;
  line-height: 1.2em;
  letter-spacing: -2px;
  margin-bottom: 0em;

  .list-header {
    background-color: orange;
    h2{
      color: #fefece;
      margin-top: 0px;
      font-size: 1.9em;
      padding-top: 0.2em;
      padding-bottom: 0.2em;
      letter-spacing: 5.5px;
      font-weight: bold;
      text-align: center;
    }
  }

  table{
    border-collapse: collapse;
    margin-top: -20px;
    color: #444;
    tr{
      border-bottom: 2px solid;
      border-color: #eee;
    }
    th{
      font-size:1.3em;
    }
  }
}

</style>

<template>
  <ons-page>
    <navbar navType='brank' msg="Result" style="margin-bottom: 0px;"></navbar>
      <score-board v-show="!!rank" :results="results" :voiceID="voiceID"/>
      <ons-icon v-show="!rank"
                @click="$router.push({ name: 'main-menu'});"
                icon="fa-home"
                size="30px"
                fixed-width="false"
                style="color: orange;">
      </ons-icon>
      <v-ons-list style="margin-top:5px" class="ranklist">
        <v-ons-list-header class="list-header"><h2>Ranking</h2>
        </v-ons-list-header>
        <v-ons-list-item class="list-item">
          <table cellpadding="5" style="width:100%">
            <tr v-for="(score,index) in scores.slice(0,20)" v-bind:key="score.id">
              <td style="text-align:center;">{{ index+1 + "."}}</td>
              <td>{{ score.user_name}}</td> 
              <td style="text-align: right;">{{ score.score.toLocaleString() }}</td>
              <td>
                <ons-icon
                  @click="playVoice(score.id)"
                  icon="fa-play-circle-o"
                  size="30px"
                  fixed-width="false"
                  style="color: orange">
                </ons-icon>
              </td>
            </tr>
          </table>
        </v-ons-list-item>
      </v-ons-list>
  </ons-page>
</template>

<script>
import Navbar from '../../components/navbar/Navbar';
import ScoreBoard from '../../components/score-board/ScoreBoard'
import Twitter from '../../components/twitter/Twitter';

export default {
  name: 'ranking',
  components: {
    Navbar,
    Twitter,
    ScoreBoard
  },
  params: {
    checkid: {
      default: null,
    },
  },
  data(){
    return{
      index:'',
      geturl: `http://k-appdev.com:3001/scores`,
      patchurl: `http://k-appdev.com:3001/scores/${this.$route.params.checkid}`,
      scores: [],
      user: '', //popup用ユーザー名
      makeuser: '', //追加するユーザー名
      userscore:'', //表示用スコア
      paramsid: null, //paramid
      datanum: 0,
      rank: null, //ランキング
      results: { 
        Score: 0,
        Rank: 10,
      },
      voiceID: 0,
    }
  },

  mounted() {
    this.axios.get(this.geturl)
    .then((res) => {
      this.scores = res.data;
      this.datanum=res.data.length;//新しいid
      
      this.paramsid = this.$route.params.checkid 
      this.checkrank();
    })
    .catch((res) => {
    });
  },

  methods: {
    checkrank(){
      for(var i=0; i<this.datanum;i++){
        if(this.scores[i].id==this.paramsid) {
          this.rank = i;
          this.results = {
            Score: this.scores[this.rank].score,
            Rank: this.rank+1,
          }
          this.voiceID = this.scores[this.rank].id;
          if(this.rank<20){
            this.alartpop();
          }
				}
      }
    },
    registname(user){
      this.$ons.notification.alert({
          message: user
      });
      this.makeuser=user;
      this.postScore();
    },
    alartpop(){
      this.$ons.notification.prompt({
        message: "best20に入りました！名前を入れてください",
        callback: (user) => {
          this.registname(user)
        },
      })
    },

    postScore(){
      this.axios.patch(this.patchurl, {
        score: {
          score: this.scores[this.rank].score,
          user_name: this.makeuser
        }
      })
      .then(res => {
        console.log(res)
      });
      this.scores[this.rank].user_name = this.makeuser 
    },

    playVoice(id) {
      this.axios.get(`http://k-appdev.com:3001/scores/${id}/voice`,{'responseType': 'blob',})
      .then((res) => {
        var audioSrc = URL.createObjectURL(res.data);
        var audio = new Audio(audioSrc);
        audio.play();
      })
      .catch((e) => { console.log(e); });
    }
  },
};
</script>