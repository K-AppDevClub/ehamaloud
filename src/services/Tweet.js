export default {
  methods: {
    postTweet(score) {
      window.open(`https://twitter.com/intent/tweet?original_referer='元ページのURL'&text=ehama-loudのスコア : ${score}点!!&tw_p=tweetbutton&url=https://ja.onsen.io/`);
    },
  },
};