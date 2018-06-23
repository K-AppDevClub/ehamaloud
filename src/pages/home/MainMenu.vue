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
  background-color: orange;
  height: 100%;
  .flex_container{
    display: flex;
    justify-content: center;
    margin-top: 100px;

    .logo{
      img{
        width:100%;
      }
      margin-left: 10px;
      width: 40%;
      flex-grow: 1;
     }

    .menu{
      flex-grow: 5;
      table{
        margin: auto;
        border-collapse: collapse;
        height: 100%;
        width: 80%;
        tr{
          font-size: 1.2em;
          border-bottom: 1px solid;
          border-color: #333;
          color: #333;
          text-align: center;
          vertical-align: bottom;
          &:hover{
            border-color: white;
            color: white;
          }
        }
      }
    }
  }

  .top_bar {
    background-color: #333;
    width: 100%;
    height: 50px; 
  }

  .bottom_bar {
    background-color: #333;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px; 
  }

  .title{
    padding-top: 80px;
    color: #333;
    h1{
      margin-top: 0em;
      text-align: center;
      font-size: 2.5em;
      font-style: bold;
      font-weight: 900;
    }
  }
}
</style>

<template>
  <ons-page>
    <audio :src="music_src" autoplay loop controls></audio>
    <div class="mainmenu" >
      <div class="top_bar"/>
      <div class="bottom_bar"/>

      <div class="title">
        <h1>元気な人選手権</h1>
      </div>
      <div class="flex_container">
        <div class="logo">
          <img :src="image_src">
        </div>
        <div class="menu">
          <table>
            <tr v-for="item in menuList" :key="item.path">
              <td @click="item.func(item.arg)">{{ item.str }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div id="describe" @click="off()">
        <h1 style="text-align: center;">このゲームは？</h1>
        <p>叫びます。変な声出します。点数でます。競いましょう!!</p>
        <p>得点の計算方法は、ちょっとかわっているよ。試行錯誤しながら高得点をめざそう！！
        </p>
      </div>
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