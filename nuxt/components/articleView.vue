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
.research-article{
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
  .research-article{
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
