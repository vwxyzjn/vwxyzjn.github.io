<template>
  <b-container>
    <b-row >
      <b-col cols="12" md="4" class="sidebar">
        <profile-info></profile-info>
      </b-col>
      <div class="content col-md-6">
        <transition name="fade" mode="out-in">
          <nuxt />
        </transition>
        <!-- <resume></resume> -->
      </div>
    </b-row>
  </b-container>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import articleView from '@/components/articleView.vue'
import ProfileInfo from '@/components/Profile.vue'

Vue.use(BootstrapVue)
Vue.component('article-view', articleView)

export default {
  name: 'app',
  components: {
    ProfileInfo
  },
  methods: {
    to_resume () {
      this.$router.push('/')
    },
    to_research () {
      this.$router.push('/research')
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../node_modules/bootstrap/scss/bootstrap-grid.scss"

*
  font-family: 'Roboto', sans-serif, -apple-system, "Helvetica Neue", Arial

.fade-enter-active, .fade-leave-active
  transition: opacity .35s

.fade-enter, .fade-leave-to
  opacity: 0

.sidebar
  @include media-breakpoint-up(md) 
    padding-top: 200px

.content
  padding: 0 20px
  padding-top: 2rem

</style>
