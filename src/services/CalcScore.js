function each(xs, fn){ for(var i = 0; i < xs.length; i++) fn(xs[i], i); }

export default{

  calc(preSpectrums, spectrums){
    var current_score = 0;
    each(spectrums, (s,i)=>{
      current_score += Math.pow(s - (preSpectrums[i] || 0), 2) / 100;
    });
    return current_score;
  },

  calc2(spectrums){
    var current_score = 0, minimum_val = spectrums[0];
    each(spectrums, (s, i)=>{
      current_score += s;
      minimum_val = Math.min(minimum_val, s)
    });
    current_score -= minimum_val * spectrums.length
    return current_score  > 1000 ? current_score : 0
  },

  smoothing(spectrums, ave_range=30){
    if (spectrums.length < ave_range) return []
    var res = [], sum = 0
    spectrums.forEach((val, idx, array) => {
      sum += val
      if(idx>ave_range-2){
        res.push(sum/ave_range)
        sum -= array[idx-ave_range+1]
      }
    });
    return res;
  }
}