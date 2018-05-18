<style lang="scss" scoped>
</style>

<template>
  <div>
    <v-ons-list modifier="inset">
      
    </v-ons-list>
  </div>
</template>

<script>
var src="anime.min.js"

export default {
  methods: {
    
  },
  name: 'plan-component',
  data() {
    return {
      message: 100,
    };
  },
  computed: {
    tax() {
      return this.message * 1.08;
    },
  },
};
</script>