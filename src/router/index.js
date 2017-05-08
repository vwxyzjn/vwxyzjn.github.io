import Vue from 'vue'
import Router from 'vue-router'
// const Hello = () => ({
//   // The component to load. Should be a Promise
//   component: import('@/components/Hello'),
//   // A component to use while the async component is loading
//   loading: LoadingComp,
//   // A component to use if the load fails
//   error: ErrorComp,
//   // Delay before showing the loading component. Defaults to 200ms.
//   delay: 5000,
//   // The error component will be displayed if a timeout is provided and exceeded.
//   timeout: 3000
// })

// async load components
const resume = () => ({
  // The component to load. Should be a Promise
  component: import('@/components/resume')
})
const research_list = () => ({
  // The component to load. Should be a Promise
  component: import('@/components/research_list')
})

var test = ['LSTM-RNN For Sentiment Analysis/article', 'hello2', 'hello3']

var research_articles = []
for (let i = 0; i < 3; i++){
  research_articles.push(() => ({
    // The component to load. Should be a Promise
    component: import('../components/research_article/' + test[i])
  }))
}

var routes = [
  {path: '/', name: 'resume', component: resume},
  {path: '/research', name: 'research_list', component: research_list}
]
for (let j = 0; j < 3; j++){
  routes.push({path: '/research/' + j, name: j, component: research_articles[j]})
  console.log(j)
}

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: __dirname,
  routes: routes
})
