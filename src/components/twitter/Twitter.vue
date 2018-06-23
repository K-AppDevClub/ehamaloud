<style lang="scss" scoped>
</style>

<template>
	<v-ons-button style="text-align:center; width:85px;" @click="postTwitter">
		<ons-icon
			icon="fa-twitter"
			size="20px"
			fixed-width="false"
			style="color: white">
		</ons-icon>
	</v-ons-button>
</template>

<script>
export default {
  name: 'twitter',
  props: {
		score: {
			default: '0',
		},
	},
  methods: {
    postTwitter() {
			console.log(this.score)
			window.open(`https://twitter.com/intent/tweet?original_referer='元ページのURL'&text=元気な人選手権のスコア : ${this.score}点!!&tw_p=tweetbutton&url=https://ja.onsen.io/`);
		},
  },
};
</script>
