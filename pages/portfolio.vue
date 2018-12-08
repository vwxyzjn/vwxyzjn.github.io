<template lang="pug">
  div
    b-card.mb-3(title='(2018) Portwarden', tag='portfolio_item')
      p.card-text 
        | Create (Scheduled) Encrypted Backups of Your Bitwarden Vault with Attachments (to Google Drive) 
      b-link.card-link(href='https://github.com/vwxyzjn/portwarden') Github
    
    b-card.mb-3(title='(2018) Add Disqus to Jupyter Notebook', tag='portfolio_item')
      p.card-text 
        | I wrote a Python Package that allows the user to inject and display Disqus in your jupyter notebook, adding a commenting section
        | for the notebook. This could be especially helpful if other people have questions about your notebook demonstration.
      b-link.card-link(href='https://github.com/vwxyzjn/jupyter_disqus') Github

    b-card.mb-3(title='(2017) Reproduction of Deepmind’s StarCraft II Research', tag='portfolio_item')
      p.card-text 
        | For my Computer Science Seminar project, I integrated Tensorforce (a Reinforcement Learning library on top of 
        | Tensorflow) and OpenAI Gym to train SC II game agents, resulting in
        | maintainable and understandable machine learning code.
      b-link.card-link(href='https://costahuang.me/SC2AI') Jupyter Writeup
      b-link.card-link(href='https://github.com/vwxyzjn/SC2AI') Github

    b-card.mb-3(title='(2017) Material-Designed Templates for Vuetifyjs Framework', tag='portfolio_item')
      p.card-text 
        | While I was the TA for Web Programming class, 
        a(href="https://vuetifyjs.com/") Vuetifyjs 
        | did not have any starter design template for beginners.
        | Students had a hard time starting with Vuetifyjs. Because of this, I wrote two material-designed templates, which were later merged 
        | into Vuetify's official documentation (See 
        a(href="https://github.com/vuetifyjs/docs/pull/181") #181
        | )
      b-link.card-link(href='https://vuetifyjs.com/themes/parallax-starter/') Parallax Template
      b-link.card-link(href='https://vuetifyjs.com/themes/blog-starter') Blog Template
      b-link.card-link(href='https://vuetifyjs.com/pre-made-themes') Vuetify's Premade Templates

    b-card.mb-3(title='(2017) Linear Programming for Optimal Scheduling', tag='portfolio_item')
      p.card-text 
        | For my Operations Research case study, which was about a scheduling problem, 
        | I modeled it by using integer programming and later solved it by using
        | Gurobipy, a python optimization package.
      b-link.card-link(href='http://costahuang.me/files/Linear_Programming_for_Optimal_Scheduling.pdf') PDF
      b-link.card-link(href='http://costahuang.me/LP_optimization_python/') Jupyter Writeup
      b-link.card-link(href='https://github.com/vwxyzjn/LP_optimization_python') Github

    b-card.mb-3(title='(2017) StreetTraffic', tag='portfolio_item')
      p.card-text
        | During my 2017 summer research, Dr. Chris Healy and I created this
        | Python package that crawls the traffic flow data of your favorite routes
        | and cities by using the APIs provided by HERE.com
      b-link.card-link(href='https://streettraffic.org/docs/modules/streettraffic.html') (Beautiful) Documentation
      b-link.card-link(href='https://github.com/streettraffic/streettraffic') Github

    b-card.mb-3(title='(2017) Abstract Algebra Finite Group Generator', tag='portfolio_item')
      p.card-text
        | Because of my Computer Science background, my Abstract Algebra Professor Dr. Douglas Rall suggested me to write this 
        | fun program that could brute force all possible permutations of binary operations on a given set. 
        | It further investigates which permutation, along with the given set, defines a valid group.
      b-link.card-link(href='https://github.com/vwxyzjn/Abstract_Algebra_Finite_Group_Generator') Github

    b-card.mb-3(title='(2017) Reproduction of newsfeed.fb.com', tag='portfolio_item')
      p.card-text
        | Fascinated by the elegant design and beautiful animations of 
        a(href="newsfeed.fb.com") newsfeed.fb.com
        |, I used Vue.js and GSAP to reproduce and learn its implementation.
      b-link.card-link(href='http://costahuang.me/Reproduction_of_newsfeed.fb.com/') Demo
      b-link.card-link(href='https://github.com/vwxyzjn/Reproduction_of_newsfeed.fb.com') Github

    b-card.mb-3(title='(2016) Sentiment Analysis of Movie Review', tag='portfolio_item')
      p.card-text 
        | For our Artificial Intelligence class project, Trilby Hren and I used Keras, a high-level machine learning library
        | to classify movie reviews based on sentiment. We ended up improving the prediction accuracy on Keras’s official 
        | demo code from 82.35% to 88.75%
      b-link.card-link(href='https://costahuang.me/Sentiment-Analysis-LSTM/') Jupyter Writeup
      b-link.card-link(href='https://github.com/vwxyzjn/Sentiment-Analysis-LSTM') Github

    b-card.mb-3(title='(2016) Penspider', tag='portfolio_item')
      p.card-text
        | Buying vintage fountain pens at 
        a(href="http://gregminuskin.com/") Greg Minuskin
        |  was challenging because the seller would put pens on sale at some random
        | time. As a computer scientist, I wrote a script that crawls the listings of pens
        | so that it would send me an email whenever a new fountain pen was found :)
      b-link.card-link(href='https://github.com/vwxyzjn/penspider') Github

    
</template>

<style lang="sass" scoped>
  h4
    font-weight: bold
</style>

<script>
export default {
  head () {
    return {
      title: 'Costa Huang | Portfolio'
    }
  }
}
</script>
