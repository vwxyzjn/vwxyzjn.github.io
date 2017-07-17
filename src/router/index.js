import Vue from 'vue'
import Router from 'vue-router'
var articles_info = require('@/articles_info.json')
Vue.use(Router)

// async load components
const resume = () => ({
  component: import('@/components/resume')
})
const research_list = () => ({
  component: import('@/components/research_list')
})

let research_articles = []
for (let i = 0; i < articles_info.length; i++){
  research_articles.push(() => ({
    component: import('@/components/research_article/' + articles_info[i]['route'] + '/article')
  }))
}

let routes = [
  {
    path: '/',
    name: 'resume',
    component: resume,
    meta: {
      title: "Costa's Resume"
    }
  },
  {
    path: '/research',
    name: 'research_list',
    component: research_list,
    meta: {
      title: "Costa's Research"
    }
  }
]
for (let j = 0; j < articles_info.length; j++){
  routes.push({
    path: '/research/' + articles_info[j]['route'],
    component: research_articles[j],
    meta: {
      title: articles_info[j]['route'].replace(/_/g, ' ') // replace all occurence of '_' with " "
    }
  })
}

const router = new Router({
  base: __dirname,
  routes: routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})
export default router
