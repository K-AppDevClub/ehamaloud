<style lang='scss' scoped>
@import url(https://fonts.googleapis.com/earlyaccess/notosansjp.css);
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

#describe {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.9);
  z-index: 2;
  cursor: pointer;
  p{
    color: white;
    font-size: 1.5em;
    margin: 0.5em auto 0em;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
  h1{
    color: white;
    // margin-top: 10%;
  }
}

.mainmenu{
  margin: 0em auto 0em;
  background-color: white;
  font-family: "Hiragino Sans";	
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  height: 100%;

  @keyframes yurayura {
    0% { transform: rotate(40deg); }
    100% { transform: rotate(-20deg); }
  }
  .logo{
    text-align: center;
    margin: 0 auto;
    img{
      width:70%;
      animation: yurayura 1s steps(2, start) infinite;
    }
  }

  .menu{
    display: flex;
    // justify-content: space-between;
    justify-content: space-around;
    width: 100%;
    margin: 7em 0 2em;
    .item{
      font-size: 1.2em;
      border-bottom: 1px solid;
      color: #4D4D4D;	
      border-color: #4D4D4D;
    }
  }
  

  .title{
    h1{
      color: #4D4D4D;	
      text-align: center;
      font-size: 2.7em;
      line-height: 2.7em;
      font-family: 'Noto Sans JP';
      margin: 0;
    }
  }
}
</style>

<template>
  <ons-page>
    <audio :src="music_src" autoplay loop></audio>
    <div class="mainmenu" >

    <div class="title">
      <h1>元気な人選手権</h1>
    </div>
      <div class="logo">
        <img :src="image_src">
      </div>
      <div class="menu">
        <div class="item" 
              v-for="item in menuList" 
              :key="item.path"
              @click="item.func(item.arg)">
          {{ item.str }}
        </div>
      </div>
    </div>
    <div id="describe" @click="off()">
      <h1 style="text-align: center;">このゲームは？</h1>
      <p>叫びます。変な声出します。点数でます。競いましょう!!</p>
      <p>得点の計算方法は、ちょっとかわっているよ。試行錯誤しながら高得点をめざそう！！
      </p>
    </div>

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
      music_src: require('../../assets/example.mp3'),
      image_src: require('../../assets/koe.png'),
      menuList:[
        {
          func: this.go,
          arg: "home",
          str:  "はじめる",
        },
        {
          func: this.go,
          arg: "ranking",
          str:  "らんきんぐ",
        },
        {
          func: this.on,
          arg: "",
          str:  "せつめい",
        }
      ]
    }
  },
  methods: {
    selected: function(index){
      this.menuList = this.menuList.splice(index, 1, {...this.menuList[index], selected:true})
    },
    rmSelected: function(index){
      this.menuList[index].selected = false;
    },

    on() {
      document.getElementById("describe").style.display = "block";
    },
    off() {
      document.getElementById("describe").style.display = "none";
    },

    go(path){
      this.$router.push({ name: path });
    },

  }
};
</script>