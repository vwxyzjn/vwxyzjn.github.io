<template>
  <div class="research-list">
    <div class="article-short" v-for="article in articlesInfo" :key="article.route">
      <h1 class="title"><nuxt-link v-bind:to="'/research/'+article.route">{{article.route.replace(/-/g, ' ')}}</nuxt-link></h1>
      
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.research-list, .research-article{
  img { 
      max-width: 100%;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  h3 {
    font-size: 1rem;
  }

  h4 {
    font-size: 1rem;
  }

  h5 {
    font-size: 1rem;
  }

  h6 {
    font-size: 1rem;
  }

  p {
    font-size: 0.85rem;
  }

  li {
    font-size: 0.85rem;
  }

  pre {
    font-size: 0.85rem;
  }
}

@media (min-width: 768px) {
  .research-list, .research-article{
    h1 {
      font-size: 1.75rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
    }

    h4 {
      font-size: 1rem;
    }

    h5 {
      font-size: 1rem;
    }

    h6 {
      font-size: 1rem;
    }

    p {
      font-size: 0.94rem;
    }

    li {
      font-size: 0.94rem;
    }

    pre {
      font-size: 0.94rem;
    }
  }
}
</style>
