<template>
  <div class="errPage-container">
    <q-btn @click="back" color="primary">返回</q-btn>
    <div class="row">
      <div class="col">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>{{$t("You don't have permission to go to this page")}}</h2>
        <ul class="list-unstyled">
          <li>{{$t('Or you can go')}}:</li>
          <li class="link-type">
            <router-link to="/home">{{$t('Back to home')}}</router-link>
          </li>
        </ul>
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
  name: 'page403',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
    }
  },
  methods: {
    back() {
        this.$router.go(-1)
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
