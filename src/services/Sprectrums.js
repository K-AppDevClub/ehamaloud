export default{
  spectrums(){
    var sp = new Object();
    sp.idx = 0;
    sp.score = 0;
    sp.spectrumList = [];
    sp.preSpectrum = [];

    sp.add = function(spectrum){
      sp.spectrumList[sp.idx++] = spectrum;
    }

    sp.calc = function(spectrum){
      var current_score = 0;
      each(spectrums, (s,i)=>{
        current_score += Math.pow(s - (this.preSpectrums[i] || 0), 2) / 100;
      });
      this.preSpectrums = spectrums;
      return current_score;
    }

    sp.clear = function(){

    }

    return sp;
  }
}