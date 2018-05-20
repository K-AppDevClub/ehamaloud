<template>
  <ons-page>
    <navbar navType='brank' msg="Result"></navbar>
      <ons-card>
        <h1 v-if="rank"></h1>
        <h1 v-else>Ranking</h1>
        <h2 v-if="rank"> Ranking: {{rank+1}}  </h2>
        <h2 v-else></h2>
        <h2 v-if="rank">Score: {{scores[rank].score}} </h2>
        <h3 v-else></h3>
      </ons-card>
      <div style="text-align:right">
        <v-ons-button  @click="$router.push({ name: 'home'});">リトライ</v-ons-button>
      </div>
      <twitter v-if="rank" v-bind:score = scores[rank].score></twitter>
      <twitter v-else></twitter>
      <v-ons-list style="margin-top:10px" class="ranklist">
        <v-ons-list-item >
          <table cellpadding="5">
            <tr>
              <th style="width:5%">rank</th>
              <th style="width:75%">name</th>
              <th style="width:20%">score</th>
            </tr>
            <tr v-for="(score,index) in scores.slice(0,20)" v-bind:key="score.id">
              <th style="text-align:center">{{ index+1 }}</th>
              <td>{{ score.user_name}}</td> 
              <td>{{ score.score }}</td>
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
        user: '',//popup用ユーザー名
        makeuser: '',//追加するユーザー名
        userscore:'',//表示用スコア
        paramsid: null,//paramid
        datanum: 0,
        //useid: 2,
        rank: null,//ランキング
      }
  },

  mounted() {
    this.axios.get(this.geturl)
    .then((res) => {
      this.scores = res.data;
      //this.useid =this.checkid; 
      //this.scoreid = res.data.length;//dataの長さ
      this.datanum=res.data.length;//新しいid
      //console.log(this.scores);//新しいid
      
      console.log(this.$route.params.checkid);
      this.paramsid = this.$route.params.checkid 
      //this.postScore();
      console.log(this.paramsid);
      this.checkrank();
      //console.log(this.scores);
      //this.alartpop();
      //this.$ons.notification.prompt('best10に入りました！名前を入れてください',this.user_name);
      //this.prefs.unshift({id: null, name: 'エリアを選択'});
    })
    .catch((res) => {
      //console.log(res);
    });
    //console.log("next");

  },
  methods: {
    checkrank(){
      for(var i=0; i<this.datanum;i++){
        if(this.scores[i].id==this.paramsid) {
          this.rank = i;
          //this.alartpop();//check用
          if(this.rank<20){
            this.alartpop();
          }
          //console.log("check");
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
      //console.log(this.scores[this.changeid].score)
      console.log(this.paramsid);
      this.axios.patch(this.patchurl, {
        score: {
          score: this.scores[this.rank].score,
          user_name: this.makeuser
        }
      })
      .then(res => {
        console.log(res)
        //console.log(this.score.score)
        //this.$ons.notification.alert('スコアを送信しました');
      });
      this.scores[this.rank].user_name = this.makeuser 
    },

  }
};
</script>
<style>
  .ranklist{
    width:100%
  }
  .retry{
   margin: auto;
   
  }
</style>