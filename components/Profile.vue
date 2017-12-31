<template>
  <b-row align-h="center">
    <b-col cols="12" class="text-center">
      <img class="profile_picture" src="~/assets/profile_picture.svg" width="130" height="130">
    </b-col>
    <b-col cols="12" class="text-center">
      <h1>Costa <span style="font-weight:bold">Huang</span></h1>
      <h5>strive for interesting things</h5>
    </b-col>
    <b-col cols="12" class="text-center pt-2">
      <b-link to="/" class="p-3" exact-active-class="exact-active-class">resume</b-link>
      <b-link to="/research" class="p-3" exact-active-class="exact-active-class">research</b-link>
      <b-link href="https://drive.google.com/open?id=0B0wkgJhWMQfgazItYXdsWk9ZUkU" class="p-3">math</b-link>
      <b-link href="https://github.com/vwxyzjn" class="p-3">github</b-link>
    </b-col>
  </b-row>
</template>

<style lang="sass" scoped>
.exact-active-class
  color: black

a
  color: #9DBF15
</style>
