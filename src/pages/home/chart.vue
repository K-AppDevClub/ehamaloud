<script>
import { Line, mixins } from 'vue-chartjs' // mixinsモジュールをインポート
export default{
  extends: Line,
  mixins: [mixins.reactiveProp], // reactivePropを使用
  props: {
    chartData: Object, // 親コンポーネントからchartDataを受け取る
  },
  data() {
    return {
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            ticks: {
              // min: 0,
              // max: 131,
              // stepSize: 5,
            },
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>