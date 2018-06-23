<template>
  <div :style="{ width: progress + '%' }" class="bar"/>
</template>

<script>
export default {
  name: "progress-bar",
  
  props: [ "time" ],

  data(){
    return {
      width: 100,
    }
  },

  computed: {
    progress: function(){
      return this.time / 3000 * 100;
    }
  }
  
}
</script>

<style>
  .bar {
    background: blue;
    width: 50px;
    height: 40px;
    margin: 0em 0em 0em 0emz;
  }
</style>
