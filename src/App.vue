<template>
  <div id="app" style="padding-right: calc(100% - 100vw + 17px);">
    <div class="container-fluid" >
      <div class="row">
        <div class="sidebar col-md-4">
          <h1>Costa Huang</h1>
          <h5>strive for interesting things</h5>
          <div class="vertical-button-group" id="test">
            <button type="button" class="btn btn-secondary" v-on:click="to_resume">resume</button>
            <button type="button" class="btn btn-secondary" v-on:click="to_research">research</button>
            <button type="button" class="btn btn-secondary" onclick="location.href='https://drive.google.com/open?id=0B0wkgJhWMQfgazItYXdsWk9ZUkU';">math</button>
            <button type="button" class="btn btn-secondary" onclick="location.href='https://github.com/vwxyzjn';">github</button>
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

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

.sidebar{
  position: relative;
  bottom: 0;
  top: 0;
  padding-top: 20%;
  text-align: center;
  padding-right: 40px;
}

.vertical-button-group{
  display: inline-block;
}

.vertical-button-group > .btn {
  display: block;
    width: 100%;
    max-width: 100%;
    margin-top: 10px;
}

.content {
  padding: 40px; 
  padding-top: 60px;
  position: relative;
  box-sizing: border-box;
  bottom: 0;
}

@media (min-width: 768px) {
  .sidebar{
    border-right: 1px solid #333;
    border-color: rgba(0, 0, 0, 0.1);
    height: 100vh;
    position: sticky;
    text-align: right;
  }
}

/* Content CSS section */
.title{
  margin-bottom: 20px;
}

.section{
  padding-bottom: 30px;
}

.alignleft {
  float: left;
}
.alignright {
  float: right;
}


</style>
