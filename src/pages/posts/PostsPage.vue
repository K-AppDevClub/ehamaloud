<style lang="scss" scoped >
.page-title {
  text-align: center;
}
.contents{
  width: 50%;
  height: 50%;
  margin: auto;
}

</style>
<template>
<v-ons-page>
  <navbar></navbar>
  <div class="page-content">
    <h3 class="page-title">
      About
    </h3>
    <p>Vue sample App</p>
  </div>
  <!-- <div class="contents">
    <canvas width="80" height="45" id="myChart"></canvas>
  </div> -->
  <div class="contents">
    <!-- <canvas width="80" height="45" id="myChart2"></canvas> -->
    <my-chart></my-chart>
  </div>
  <!-- <div class="contents">
    <commit-chart></commit-chart>
  </div> -->
  <!-- <commit-chart :width="900" :height="300"></commit-chart> -->
  <!-- <form></form> -->
</v-ons-page>
</template>

<script>
import Navbar from '../../components/navbar/Navbar';
import MyChart from '../../components/chart/MyChart';
import CommitChart from '../../components/chart/CommitChart';

// window.onload = function(){
//   var ctx = document.getElementById('myChart2').getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
//       datasets: [{
//         label: 'apples',
//         data: [12, 19, 3, 17, 6, 3, 7],
//         backgroundColor: "rgba(153,255,51,0.4)"
//       }, {
//         label: 'oranges',
//         data: [2, 29, 5, 5, 2, 3, 10],
//         backgroundColor: "rgba(255,153,0,0.4)"
//       }]
//     }
//   });
// };

// window.onload = function(){
//   var ctx = document.getElementById("myChart").getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//       datasets: [{
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(255, 206, 86, 0.2)',
//           'rgba(75, 192, 192, 0.2)',
//           'rgba(153, 102, 255, 0.2)',
//           'rgba(255, 159, 64, 0.2)'
//         ],
//         borderColor: [
//           'rgba(255,99,132,1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero:true
//           }
//         }]
//       }
//     }
//   });
// };

export default {
  name: 'posts-page',
  components: {
    Navbar,
    MyChart,
    CommitChart,
  },
  methods: {}
};
</script>
