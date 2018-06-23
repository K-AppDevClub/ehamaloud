export default{
  methods:{
    play(id) {
      this.axios.get(`${window.baseUrl}/scores/${id}/voice`,{'responseType': 'blob',})
      .then((res) => {
        var audioSrc = URL.createObjectURL(res.data);
        var audio = new Audio(audioSrc);
        audio.play();
      })
      .catch((e) => { console.log(e); });
    }
  }
}