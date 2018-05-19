<script>
import { Line, mixins } from 'vue-chartjs' // mixinsモジュールをインポート
export default{
  extends: Line,
  mixins: [mixins.reactiveProp], // reactivePropを使用
  props: {
    chartData: Object // 親コンポーネントからchartDataを受け取る
  },
  mounted () {
    this.renderChart(this.chartData)
  }
}
</script>