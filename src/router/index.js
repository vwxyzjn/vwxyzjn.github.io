import Vue from 'vue'
import Router from 'vue-router'
import Test from '@/components/research_article/LSTM-RNN_For_Sentiment_Analysis/article'
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

var article_folder_name = ['LSTM-RNN_For_Sentiment_Analysis', 'Plane_Shooting_Problem_Dynamic_Programming']

var research_articles = []
for (let i = 0; i < article_folder_name.length; i++){
  research_articles.push(() => ({
    // The component to load. Should be a Promise
    component: import('@/components/research_article/' + article_folder_name[i] + '/article')
  }))
}

var routes = [
  {path: '/', name: 'resume', component: resume},
  {path: '/research', name: 'research_list', component: research_list},
  {path: '/test', name: 'test', component: Test}
]
for (let j = 0; j < article_folder_name.length; j++){
  routes.push({path: '/research/' + article_folder_name[j], component: research_articles[j]})
}

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: __dirname,
  routes: routes
})
