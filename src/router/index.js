import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
// require('bootstrap-loader')

Vue.use(Router)

const Hello = () => ({
  // The component to load. Should be a Promise
  component: import('@/components/Hello'),
  // A component to use while the async component is loading
  // loading: LoadingComp,
  // A component to use if the load fails
  // error: ErrorComp,
  // Delay before showing the loading component. Defaults to 200ms.
  // delay: 5000,
  // The error component will be displayed if a timeout is provided and exceeded.
  timeout: 3000
})

const Home = () => ({
  // The component to load. Should be a Promise
  component: import('@/components/Home'),
  // A component to use while the async component is loading
  // loading: LoadingComp,
  // A component to use if the load fails
  // error: ErrorComp,
  // Delay before showing the loading component. Defaults to 200ms.
  // delay: 5000,
  // The error component will be displayed if a timeout is provided and exceeded.
  timeout: 3000
})

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
