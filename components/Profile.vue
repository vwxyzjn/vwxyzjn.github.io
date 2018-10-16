<template>
  <b-row align-h="center">
    <b-col cols="12" class="text-center">
      <img class="profile_picture" src="~/assets/ProfilePhoto.jpg" width="130" height="130">
    </b-col>
    <b-col cols="12" class="text-center">
      <h1>Costa <span style="font-weight:bold">Huang</span></h1>
      <h5>strive for interesting things</h5>
    </b-col>
    <b-col cols="12" class="text-center pt-2">
      <b-link to="/" exact-active-class="exact-active-class">home</b-link>
      <b-link to="/portfolio" exact-active-class="exact-active-class">portfolio</b-link>
      <b-link href="https://costahuang.me/Costa-Huang-Resume.pdf">resume</b-link>
      <b-link href="https://github.com/vwxyzjn" >github</b-link>
    </b-col>
  </b-row>
</template>

<style lang="sass" scoped>
.exact-active-class
  color: black

h1 
  margin-bottom: 0.3em

a
  color: #9DBF15
  padding: 0 0.5rem

.profile_picture
  width: initial
  border-radius: 50%
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
</style>
