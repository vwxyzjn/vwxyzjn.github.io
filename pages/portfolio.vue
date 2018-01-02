<template lang="pug">
  div
    b-card.mb-3(title='Reproduction of Deepmind’s StarCraft II Research', tag='article')
      p.card-text 
      | I integrated Tensorforce (a Reinforcement Learning library on top of 
      | Tensorflow) and OpenAI Gym to train SC II game agents, resulting in
      | maintainable and understandable machine learning code.
      b-link.card-link(href='https://costahuang.me/SC2AI') Jupyter Writeup
      b-link.card-link(href='https://github.com/vwxyzjn/SC2AI') Github
  
    b-card.mb-3(title='Linear Programming for Optimal Scheduling', tag='article')
      p.card-text 
      | For our Operations Research case study about a shceduling problem, 
      | I modeled it by using integer programming and later solved it by using
      | Gurobipy, a python optimiazation pacakge.
      b-link.card-link(href='http://costahuang.me/files/Linear_Programming_for_Optimal_Scheduling.pdf') PDF
      b-link.card-link(href='http://costahuang.me/LP_optimization_python/') Jupyter Writeup
      b-link.card-link(href='https://github.com/vwxyzjn/LP_optimization_python') Github

    b-card.mb-3(title='Sentiment Analysis of Movie Review', tag='article')
      p.card-text Used neural network to classify movie reviews based on sentiment.
      b-link.card-link(href='https://costahuang.me/Sentiment-Analysis-LSTM/') Jupyter Writeup
      b-link.card-link(href='https://github.com/vwxyzjn/Sentiment-Analysis-LSTM') Github
</template>

<style lang="sass" scoped>
  h4
    font-weight: bold
</style>
