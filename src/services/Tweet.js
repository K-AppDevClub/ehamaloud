export default {
  methods: {
    postTweet(score) {
      //window.open(`https://twitter.com/intent/tweet?original_referer='元ページのURL'&text=元気な人選手権のスコア : ${score}点!!&tw_p=tweetbutton&url=https://ja.onsen.io/`);
      window.open(`https://twitter.com/intent/tweet?original_referer='元ページのURL'&text=元気な人選手権のスコア : ${score}点!!&tw_p=tweetbutton`);
    },
  },
};