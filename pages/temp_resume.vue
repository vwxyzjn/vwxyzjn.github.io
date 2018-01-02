<template lang="pug">
.resume
  .education.section
    h2.title Education
    hr
    .item
      #textbox
        h6.position_title Furman University, Greenville, SC
        h6.related_time May 2018
      ul
        li Bachelor of Science in Computer Science
        li Bachelor of Science in Applied Math

  .experience.section
    h2.title Experience
    hr
    // Math & Computer Science Tutor
    .item
      #textbox
        h6.position_title Computer Science Lab Assistant
        h6.related_time Spring 2017—Present
      h6.address Furman University Computer Science Department, Greenville, SC
      ul
        li Tutored Python in terms of picture manipulation, sound editing and debugging
        li Provide up to 10 hours of tutoring every week
    // Vice President of Technology
    .item
      #textbox
        h6.position_title Vice President of Technology
        h6.related_time Fall 2016—Present
      h6.address Furman University Investment Club, Greenville, SC
      ul
        li Update portfolio information whenever new trade is made
        li
          | Founded 
          a(href='http://portfolio.fuinvestment.com') Fuinvestment.com 
          |  that shows equity curve, portfolio, and transactions history
        li
          | Collaborated with other core members to raise campus awareness and introduced stock tracker game
    // Math & Computer Science Tutor
    .item
      #textbox
        h6.position_title Math & Computer Science Tutor
        h6.related_time Fall 2016—Present
      h6.address Furman University Tutoring Center, Greenville, SC
      br
    // Accounting Intern
    .item
      #textbox
        h6.position_title Accounting Intern
        h6.related_time Summer 2015
      h6.address DBO LLC, Hainan Division, China
      br
    // Tax Intern
    .item
      #textbox
        h6.position_title Tax Intern
        h6.related_time Spring 2015
      h6.address Volunteer Income Tax Assistance (VITA), , Greenville, SC
      br

</template>

<script>
export default {
  head () {
    return {
      title: "Costa Huang's Resume"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#textbox {
}

.section {
  padding-bottom: 25px;
}

.position_title{
  font-style: italic; 
}

.related_time {
  font-style: italic; 
}

.address {
  opacity: 0.7;
  color: #53657D;
}

.experience {
  .item {
    padding-bottom: 13px;
  }
}

li {
  font-size: 14px;
}

@media (min-width: 768px) {
  #textbox {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
</style>
