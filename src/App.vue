<template>
  <div id="app">
  	<router-link to="/">Hello</router-link>
  	<router-link to="/Home">Home</router-link>
  	<transition name="fade" mode="out-in">
  		<router-view></router-view>
  	</transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
