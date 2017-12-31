<template>
  <div class="research-list">
    <div class="article-short" v-for="article in articlesInfo" :key="article.route">
      <h2 class="title"><nuxt-link v-bind:to="'/research/'+article.route">{{article.route.replace(/-/g, ' ')}}</nuxt-link></h2>
      
      <!-- START: left align and right align at the same line -->
      <p>{{article.abstract}}</p>
      <h6 style="text-align:right">{{article.created_date}}</h6>
      <hr>
    </div>
  </div>
</template>

<script>
import articlesInfo from '../articlesInfo.json'

export default {
  name: 'research',
  data () {
    return {
      articlesInfo: articlesInfo
    }
  },
  head () {
    return {
      title: "Costa Huang's Research"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
