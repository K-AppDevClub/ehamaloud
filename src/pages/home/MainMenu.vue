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
        <h1>○○！！〇〇！！</h1>
        <h1>○○○○○○！！</h1>
      </div>
      <div class="menu">
        <table>
          <tr v-for="item in menuList" :key="item.path">
            <td @click="$router.push({ name: item.path });">{{ item.str }}</td>
          </tr>
        </table>
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
          path: "home",
          str:  "はじめる",
        },
        {
          path: "ranking",
          str:  "らんきんぐ",
        },
        {
          path: "help",
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
    }

  }
};
</script>