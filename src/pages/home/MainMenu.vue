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

#overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.8);
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
    margin-top: 60%;
  }
}

.mainmenu{
  margin: 0em auto 0em;
  background-color: #fff;
  height: 100%;
  .menu{
    height: 50%;
    table{
      margin: auto;
      border-collapse: collapse;
      height: 70%;
      width: 50%;
      tr{
        font-size: 1.2em;
        border-bottom: 1px solid;
        border-color: #dedede;
        color: #333;
        text-align: center;
        vertical-align: bottom;
        &:hover{
          border-color: orange;
          color: orange;
        }
      }
    }
  }

  .title{
    padding-top: 200px;
    color: orange;
    h1{
      margin-top: 0em;
      text-align: center;
      font-size: 2em;
      font-style: bold;
    }
  }
}
</style>

<template>
  <ons-page>
    <div class="mainmenu">
      <div class="title">
        <h1>さけんで、わらって</h1>
        <h1>へんなこえバトル！！</h1>
      </div>
      <div class="menu">
        <table>
          <tr v-for="item in menuList" :key="item.path">
            <td @click="item.func(item.arg)">{{ item.str }}</td>
          </tr>
        </table>
      </div>
      <div id="overlay" @click="off()">
        <h1 style="text-align: center;">このゲームは？</h1>
        <p>叫びます。変な声出します。点数でます。競いましょう!!</p>
        <p>得点の計算方法は、ちょっとかわっているよ。試行錯誤しながら高得点をめざそう！！
        </p>
      </div>
    </div>
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
      document.getElementById("overlay").style.display = "block";
    },
    off() {
      document.getElementById("overlay").style.display = "none";
    },

    go(path){
      this.$router.push({ name: path });
    },

  }
};
</script>