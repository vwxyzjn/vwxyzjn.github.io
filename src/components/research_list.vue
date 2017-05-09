<template>
  <div class="research-list">
    <div class="article-short" v-for="article in article_info">
      <h3 class="title"><router-link v-bind:to="'research/'+article.title">{{article.title}}</router-link></h3>
      <!-- START: left align and right align at the same line -->
      <p>{{article.abstract}}</p>
      <h6 style="text-align:right">{{article.created_date}}</h6>
      <hr>
    </div>
  </div>
</template>

<script>
import article from '@/article.json'
console.log(article)

export default {
  name: 'research',
  data(){
    return {
      article_info: article
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
