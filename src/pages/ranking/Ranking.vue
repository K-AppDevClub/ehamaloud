<template>
  <ons-page>
    <navbar></navbar>
    <h1> ランキング♥ </h1>
    <el-button type="primary" @click="checkid()">クリア</el-button>
    
    <v-ons-list>
          <v-ons-list-item v-for="score in scores.slice(0,10)" v-bind:key="score.id">
            <table cellpadding="5">
              <tr>
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


export default {
  name: 'ranking',
  components: {
    Navbar,
    EhamaForm,
  },
  data(){
      return{
        geturl: `http://k-appdev.com:3001/scores`,
        posturl: `http://k-appdev.com:3001/scores/${this.scoreid}`,
        scores: [],
        user: '',
        makeuser: '',
        cangeid: 100,//新しいid
        scoreid: 9,//db番号
      }
  },

  mounted() {
    this.axios.get(this.geturl)
    .then((res) => {
      this.scores = res.data;
      this.scoreid = res.data.length;//新しいid 
      //console.log(res.data.length);//新しいid
      console.log(this.scores);//新しいid
      
      //this.checkid();
      //this.postScore();
      //console.log(this.user);
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
    checkid(){
      for(var i=0; i<10;i++){
        if(this.scores[i].id==this.scoreid) {
          this.changeid = i;
          this.alartpop();
          //console.log("check");
          //console.log(this.changeid);
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
          message: "best10に入りました！名前を入れてください",
          callback: (user) => {
            this.registname(user)
          },
        })
    },
    postScore(){
      //console.log(this.scores[this.changeid].score)
      console.log(this.user);
      this.axios.post(this.geturl, {
        score: {
          score: this.scores[this.changeid].score,
          user_name: this.makeuser
        }
      })
      .then(res => {
        console.log(res)
        //console.log(this.score.score)
        //this.$ons.notification.alert('スコアを送信しました');
      });
    },

  }
};
</script>