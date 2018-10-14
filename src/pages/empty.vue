<template>
  <div class="errPage-container">
    <div class="row">
      <div class="col">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>{{$t('This page has nothing')}}</h2>
      </div>
      <div class="col">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </div>
    </div>
  </div>
</template>

<script>
import errGif from '@/assets/403.gif'
export default {
  name: 'empty',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
    }
  }
}
</script>

<style lang="stylus" scoped>
  .errPage-container {
    width: 800px;
    margin: 100px auto;
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
