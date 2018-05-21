function each(xs, fn){ for(var i = 0; i < xs.length; i++) fn(xs[i], i); }

export default{
  calc(preSpectrums, spectrums){
    var current_score = 0;
    each(spectrums, (s,i)=>{
      current_score += Math.pow(s - (preSpectrums[i] || 0), 2) / 100;
    });
    return current_score;
  },
}