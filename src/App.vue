<template>
  <div id="app">
    <div class="container-fluid" >
      <div class="row">
        <div class="sidebar col-md-4">
          <div class="profile_info">
            <img class="profile_picture" src="./assets/profile_picture.svg">
            <h1>Costa <span style="font-weight:bold">Huang</span></h1>
            <h5>strive for interesting things</h5>
            <div class="menu-item-wrapper">
              <router-link to="/">resume</router-link>
              <router-link to="/research">research</router-link>
              <a href="https://drive.google.com/open?id=0B0wkgJhWMQfgazItYXdsWk9ZUkU">math</a>
              <a href="https://github.com/vwxyzjn">github</a>
            </div>
          </div>
        </div>
        <div class="content col-md-6">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
          <!-- <resume></resume> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  methods: {
    to_resume(){
      this.$router.push('/')
    },
    to_research(){
      this.$router.push('/research')
    }
  }
}
</script>

<style lang="sass" scoped>
*
  font-family: 'Roboto', sans-serif, -apple-system, "Helvetica Neue", Arial

.fade-enter-active, .fade-leave-active
  transition: opacity .35s

.fade-enter, .fade-leave-to
  opacity: 0

.sidebar
  position: relative
  bottom: 0
  top: 0
  padding-top: 5vh
  text-align: center

  img
    width: 130px
    height: 130px

  h5
    font-size: 1.05em
    color: #53657D

  .menu-item-wrapper
    max-width: 100%
    display: inline-block
    padding-top: 18px

    a
      padding: 10px
      color: #9DBF15

    .router-link-exact-active
      color: black

.content
  padding: 40px
  position: relative
  bottom: 0

@media (min-width: 768px)
  .sidebar
    height: 100vh
    padding-top: 20vh
    position: sticky
    text-align: right

    .profile_info
      display: inline-block
      text-align: center
      width: 70%

  #app
    padding-right: calc(100% - 100vw + 17px)


  .content
    padding-top: 60px


.title
  margin-bottom: 20px

.section
  padding-bottom: 30px

</style>
