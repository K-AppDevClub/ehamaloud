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
    <v-ons-button  @click="$router.push({ name: 'main-menu'});">戻る</v-ons-button>
  </ons-page>
</template>

<script>

export default {
  name: 'main-menu',
  components: {
  },
};
</script>