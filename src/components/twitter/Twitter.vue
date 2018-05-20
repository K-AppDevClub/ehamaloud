<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>

<template>
	<!-- <v-ons-button @click="postTwitter" modifier="outline" style="margin: 6px 0">{{ msg }}</v-ons-button> -->
	<a id="link" href="" target="_blank">ツイートする</a>
	
</template>

<script>
export default {
  name: 'twitter',
  props: {
    msg: {
      default: 'メッセージ',
		},
		score: {
			default: '00',
		},
	},
	mounted() {
		console.log(this.score)
		var target = document.getElementById("link");
		target.href = `https://twitter.com/intent/tweet?original_referer='元ページのURL'&text=ehama-loudのスコア : ${this.score}点!!&tw_p=tweetbutton&url=https://ja.onsen.io/`;
	},
  methods: {
    // postTwitter() {
		// 	console.log(this.msg);
		// },
  },
};
</script>
