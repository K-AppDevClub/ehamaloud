<template>
  <ons-page>
    <navbar></navbar>
    <h1> Hello </h1>
    
    <v-ons-list>
          <v-ons-list-item v-for="score in scores" v-bind:key="score.id">
            <table cellpadding="10">
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
        scores: [],
        user: 'rrr'
      }
  },

  mounted() {
    this.axios.get('http://k-appdev.com:3001/scores')
    .then((res) => {
      this.scores = res.data;
      console.log(this.scores);
      this.alartpop();
      //this.$ons.notification.prompt('best10に入りました！名前を入れてください',this.user_name);
      //this.prefs.unshift({id: null, name: 'エリアを選択'});
    })
    .catch((res) => {
      console.log(res);
    });
    console.log(this.user_name);
  },
  methods: {
    registname(user){
        this.$ons.notification.alert({
            message:this.user
        });
        //console.log(user);
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
      this.axios.post('http://k-appdev.com:3001/scores', {
        score: {  
          id: this.id,
          score: this.score,
          user_name: this.user
        }
      })
      .then(res => {
        console.log(res)
        console.log(this.score.score)
        //this.$ons.notification.alert('スコアを送信しました');
      });
    },

  }
};
</script>