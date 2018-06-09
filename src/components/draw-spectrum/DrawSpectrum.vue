<template>
    <canvas ref="scope" :width="size.width" :height="size.height"></canvas>
</template>

<script>
function each(xs, fn){ for(var i = 0; i < xs.length; i++) fn(xs[i], i); }
export default{
  name: "draw-spectrum",
  
  props: [ "spectrums" ],

  data() {
    return {
      ctx: null, margin: 10,
      size: { margin:10, width: document.documentElement.clientWidth, height: document.documentElement.clientHeight-200 }
    }
  },

  mounted() {
    this.ctx = this.$refs.scope.getContext('2d');
    this.ctx.strokeStyle = 'rgb(0,255,0)';
    console.log(this.spectrums)
  },

  watch: {
    "spectrums": function(spectrums){
      var [margin, w, h] = this.getGraphSize();
      this.clearCanvas();
      this.ctx.beginPath();
      this.ctx.fillStyle = 'rgb(0,0,0)'
      this.ctx.fillRect(0, 0, w, h+margin*2);
      each(spectrums, (spe, i, len=spectrums.length) => { 
        var x = (i / len) * w, y = (1 - (spe / 255)) * h + margin;
        if (i === 0) this.ctx.moveTo(x, y);
        else         this.ctx.lineTo(x, y);
      });
      this.ctx.stroke();
    }
  },

  methods: {
    getGraphSize(){
      var margin = this.margin
      return [margin, this.size.width, this.size.height-margin*2];
    },

    clearCanvas(){
      var [m, w, h] = this.getGraphSize(); // _, width, height
      this.ctx.clearRect(0, 0, w+m*2, h+m*2);
      // this.drawFrame()
    },
    
    drawFrame(){
      var [m, w, h] = this.getGraphSize(); // margin, width, height
      for(var i in [0, 1]){
        this.ctx.fillRect(m,     h*i+m, w, 1);
        this.ctx.fillRect(w*i+m, m,   1, h);
      };
    },
  }
}

</script>

</<style>

</style>
