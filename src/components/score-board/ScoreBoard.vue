<template>
  <div class="score-board">

    <div class="result">
      <table>
        <tr v-for="(v, k) in results"
            :key="k"
            class="result-item">
          <td class="key">{{ k + ":" }}</td>
          <td class="value">{{ v.toLocaleString() }}</td>
        </tr>
      </table>
    </div>

    <table class="icons">
      <tr style="border-top: 1px solid; border-color: #eee;">
        <th><div>
          <ons-icon
            @click="postTweet(results.Score)"
            icon="fa-twitter"
            size="25px"
            fixed-width="false"
            style="color: orange">
          </ons-icon>
        </div></th>
        <th><div>
          <ons-icon
            @click="play(voiceID)"
            icon="fa-play"
            size="25px"
            fixed-width="false"
            style="color: orange">
          </ons-icon>
        </div></th>
        <th><div>
          <ons-icon
            @click="$router.push({ name: 'home'});"
            icon="fa-undo"
            size="25px"
            fixed-width="false"
            style="color: orange">
          </ons-icon>
        </div></th>
      </tr>
      <tr>
        
      </tr>
    </table>
  </div>
</template>


<script>
import PlayVoice from '../../services/PlayVoice'
import PostTweet from '../../services/Tweet'

export default {
  mixins: [
    PlayVoice,
    PostTweet,
  ],
  props:[ "results",
          "voiceID" ],
}
</script>

<style lang="scss">
.score-board{
  margin: 0em auto 0em;
  background-color: #fff;

  .icons  {
    border-collapse: collapse;
    width: 100%;
    th{
      padding-top: 5px; 
      padding-bottom: 5px; 
    }
  } 

  .result{
    height: 200px;
    table{
      margin: auto;
      border-collapse: collapse;
      height: 80%;
      width: 50%;
      .result-item{
        font-size: 1.2em;
        border-bottom: 1px solid;
        border-color: #dedede;
        color: #333;
        vertical-align: bottom;
        .key{
          text-align: left;
        }
        .value{
          text-align: right;
          font-size: 1.2em;
        }
      }
    }
}

}
</style>
