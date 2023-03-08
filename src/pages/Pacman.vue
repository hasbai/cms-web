<template>
  <div class="loader">
    <div class="circles">
      <span class="one"></span>
      <span class="two"></span>
      <span class="three"></span>
    </div>
    <div class="pacman">
      <span class="top"></span>
      <span class="bottom"></span>
      <span class="left"></span>
      <div class="eye"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
body {
  margin: 0;
  background: #1C163A
}

.loader {
  position: absolute;
  top: 40%;
  left: 50%;
  height: 60px;
  width: 160px;
  margin: 0;
  transform: translate(-50%, -50%)
}

.circles {
  position: absolute;
  left: -5px;
  top: 0;
  height: 60px;
  width: 180px
}

.circles span {
  position: absolute;
  top: 25px;
  height: 12px;
  width: 12px;
  border-radius: 12px;
  background-color: #e64a19
}

.circles span.one {
  right: 80px
}

.circles span.two {
  right: 40px
}

.circles span.three {
  right: 0
}

.circles {
  -webkit-animation: circles 0.5s infinite linear;
  animation: circles 0.5s infinite linear
}

@keyframes circles {
  0% {
    transform: translate(0px, 0px)
  }
  100% {
    transform: translate(-40px, 0px)
  }
}

.pacman {
  position: absolute;
  left: 0;
  top: 0;
  height: 60px;
  width: 60px
}

.pacman .eye {
  position: absolute;
  top: 10px;
  left: 30px;
  height: 7px;
  width: 7px;
  border-radius: 7px;
  background-color: #1C163A
}

.pacman span {
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 60px
}

.pacman span::before {
  content: "";
  position: absolute;
  left: 0;
  height: 30px;
  width: 60px;
  background-color: #fbc02d
}

.pacman .top::before {
  top: 0;
  border-radius: 60px 60px 0 0
}

.pacman .bottom::before {
  bottom: 0;
  border-radius: 0 0 60px 60px
}

.pacman .left::before {
  bottom: 0;
  height: 60px;
  width: 30px;
  border-radius: 60px 0 0 60px
}

.pacman .top {
  -webkit-animation: top 0.5s infinite;
  animation: top 0.5s infinite
}

@keyframes top {
  0%, 100% {
    transform: rotate(0deg)
  }
  50% {
    transform: rotate(-45deg)
  }
}

.pacman .bottom {
  -webkit-animation: bottom 0.5s infinite;
  animation: bottom 0.5s infinite
}

@keyframes bottom {
  0%, 100% {
    transform: rotate(0deg)
  }
  50% {
    transform: rotate(45deg)
  }
}
</style>