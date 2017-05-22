<template>
  <div class="resume">
    <div class="education section">
      <h2 class="title">Education</h2>
      <hr/>
      <!-- START: left align and right align at the same line -->
      <div class="item">
        <div id="textbox">
          <h6 class="position_title">Furman University, Greenville, SC</h6><h6 class="related_time">May 2018</h6>
        </div>
        <!-- END: left align and right align at the same line -->
        <ul>
          <li>Bachelor of Science in Computer Science</li>
          <li>Bachelor of Science in Applied Math</li>
          <li>Cumulative GPA: 3.23/4.00,  Major GPA: 3.57/4.00</li>
        </ul>
      </div>
    </div>
    <div class="experience section">
      <h2 class="title">Experience</h2>
      <hr/>

      <!-- Math & Computer Science Tutor -->
      <div class="item">
        <div id="textbox">
          <h6 class="position_title">Computer Science Lab Assistant</h6><h6 class="related_time">Spring 2017—Present</h6>
        </div>
        <h6 class="address">Furman University Computer Science Department, Greenville, SC</h6>
        <ul>
          <li>Tutored Python in terms of picture manipulation, sound editing and debugging</li>
          <li>Provide up to 10 hours of tutoring every week</li>
        </ul>
      </div>
      

      <!-- Vice President of Technology -->
      <div class="item">
        <div id="textbox">
          <h6 class="position_title">Vice President of Technology</h6><h6 class="related_time">Fall 2016—Present</h6>
        </div>
        <h6 class="address">Furman University Investment Club, Greenville, SC</h6>
        <ul>
          <li>Update portfolio information whenever new trade is made</li>
          <li>Founded <a href="http://portfolio.fuinvestment.com">Fuinvestment.com </a> that shows equity curve, portfolio, and transactions history</li>
          <li>Collaborated with other core members to raise campus awareness and introduced stock tracker game</li>
        </ul>
      </div>
      

      <!-- Math & Computer Science Tutor -->
      <div class="item">
        <div id="textbox">
          <h6 class="position_title">Math & Computer Science Tutor</h6><h6 class="related_time">Fall 2016—Present</h6>
        </div>
        <h6 class="address">Furman University Tutoring Center, Greenville, SC</h6>
        <br/>
      </div>
      

      <!-- Accounting Intern -->
      <div class="item">
        <div id="textbox">
          <h6 class="position_title">Accounting Intern</h6><h6 class="related_time">Summer 2015</h6>
        </div>
        <h6 class="address">DBO LLC, Hainan Division, China</h6>
        <br/>
      </div>
      

      <!-- Tax Intern -->
      <div class="item">
        <div id="textbox">
          <h6 class="position_title">Tax Intern</h6><h6 class="related_time">Spring 2015</h6>
        </div>
        <h6 class="address">Volunteer Income Tax Assistance (VITA), , Greenville, SC</h6>
        <br/>
      </div>
      

    </div>
  </div>
</template>

<script>
export default {
  name: 'resume'
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
