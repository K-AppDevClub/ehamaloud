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
// #overlay {
//   position: fixed;
//   display: none;
//   width: 100%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0,0,0,0.5);
//   z-index: 2;
//   color: white;
//   cursor: pointer;
// }
</style>

<template>
  <ons-page>
    <v-ons-button  @click="$router.push({ name: 'home'});">はじめる</v-ons-button>
    <v-ons-button  @click="$router.push({ name: 'ranking'});">らんきんぐ</v-ons-button>
    <v-ons-button  @click="$router.push({ name: 'help'});">せつめい</v-ons-button>
    <!-- <div id="overlay" @click="off()"><h1>Hay!</h1></div>
    <button @click="on()">Turn on overlay effect</button> -->
  </ons-page>
</template>

<script>

export default {
  name: 'main-menu',
  components: {
  },
  data() {
    return{
      countdown_timer: null,
      countdown_num: 3,
    }
  },
  mouted() {
    // setInterval(()=>{
    //   this.countdown_num -= 1;
    //   if(this.countdown_num<=0){
    //     this.off();
    //   }
    //   console.log(countdown_num);
    // },1000);
  },
  methods: {
    // on() {
    //   document.getElementById("overlay").style.display = "block";
    //   console.log("hoge");
    // },
    // off() {
    //   document.getElementById("overlay").style.display = "none";
    // },
    // count() {

    // },
  }
};
</script>