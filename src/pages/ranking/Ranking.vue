<style lang='scss' scoped>
.ranklist{
  width:100%
}
.retry{
  margin: auto;
}
.flex-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.action-btn {
  margin: 0 10px;
}
</style>

<template>
  <ons-page>
    <navbar navType='brank' msg="Result"></navbar>
      <div v-if="rank">
        <ons-card>
          <h2> Ranking: {{rank+1}}  </h2>
          <h2>Score: {{scores[rank].score}} </h2>
          <ons-icon
            @click="playVoice(scores[rank].id)"
            icon="fa-play-circle-o"
            size="30px"
            fixed-width="false"
            style="color: orange">
          </ons-icon>
        </ons-card>
      </div>
      <div v-else></div>
      <div class="flex-container">
        <div class="action-btn">
          <twitter v-if="rank" v-bind:score = scores[rank].score></twitter>
          <twitter v-else></twitter>
        </div>
        <div class="action-btn">
          <v-ons-button  @click="$router.push({ name: 'home'});">リトライ</v-ons-button>
        </div>
      </div>
      <v-ons-list style="margin-top:20px" class="ranklist">
        <v-ons-list-header>World Ranking</v-ons-list-header>
        <v-ons-list-item >
          <table cellpadding="5" style="width:100%">
            <tr>
              <th>rank</th>
              <th>name</th>
              <th>score</th>
              <th></th>
            </tr>
            <tr v-for="(score,index) in scores.slice(0,20)" v-bind:key="score.id">
              <td style="text-align:center">{{ index+1 }}</td>
              <td>{{ score.user_name}}</td> 
              <td>{{ score.score }}</td>
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
import EhamaForm from '../../components/form/Form';
import Twitter from '../../components/twitter/Twitter';

export default {
  name: 'ranking',
  components: {
    Navbar,
    EhamaForm,
    Twitter
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
    }
  },
  mounted() {
    this.axios.get(this.geturl)
    .then((res) => {
      this.scores = res.data;
      this.datanum=res.data.length;//新しいid
      
      console.log(this.$route.params.checkid);
      this.paramsid = this.$route.params.checkid 
      console.log(this.paramsid);
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
          if(this.rank<20){
            this.alartpop();
          }
          console.log(this.rank);
				}
      }
    },
    registname(user){
      this.$ons.notification.alert({
          message: user
      });
      this.makeuser=user;
      console.log(user);
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
      console.log(this.paramsid);
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