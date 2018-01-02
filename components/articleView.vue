<template>
  <div class="research-article">
    <div v-html="rawHtml">
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import 'katex/dist/katex.css'
import katex from 'katex'
import renderMathInElement from 'katex/dist/contrib/auto-render.min.js'
import marked from 'marked'
import Prism from 'prismjs'
import 'prismjs/themes/prism-coy.css'
import 'prismjs/components/prism-python.js'

export default {
  name: 'article',
  props: {
    article: String
  },
  data () {
    return {
      rawHtml: marked(this.article)
    }
  },
  mounted () {
    window.katex = katex
    Prism.highlightAll()
    renderMathInElement(document.body,{
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "\\[", right: "\\]", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\(", right: "\\)", display: false}
            ]
        }
    )
  }
}
/* eslint-enable */
</script>

<style lang="scss">

</style>
