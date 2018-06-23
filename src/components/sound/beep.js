export default {
  data() {
    return {
      state: true,
      melody: null,
    }
  },
  methods: {
    startBeep() {
      // メロディを鳴らす音源
      var synth = new this.$tone.Synth().toMaster();
      // メロディの音階データ
      var melody_data = [
        'G4', null, 'G4', null, 'G4', null, 'G5'
      ];
      var addMelody = (time, note) => {
        synth.triggerAttackRelease(note, '8n', time);
      }
      this.melody = new this.$tone.Sequence(addMelody, melody_data);
      // テンポを指定
      this.melody.start();
      this.$tone.Transport.bpm.value = 120
      this.$tone.Transport.start();
    },
    finishBeep() {
      // メロディを鳴らす音源
      var synth = new this.$tone.Synth().toMaster();
      synth.triggerAttackRelease('G5', '2n');
    }
  }
}