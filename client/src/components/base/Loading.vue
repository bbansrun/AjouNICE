<template>
  <div class="loader">
    <div class="wrapper">
      <div class="logo">
        <LoadingSVG ref="logo" />
      </div>
      <p>
        <strong>필요한 데이터를 준비하고 있습니다...</strong>
      </p>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'
import LoadingSVG from '@/assets/images/AjouNICE.svg'
export default {
  name: 'Loading',
  components: {
    LoadingSVG
  },
  data () {
    return {
    }
  },
  mounted () {
    anime({
      targets: this.$refs.logo.children,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function (el, i) { return i * 250 },
      direction: 'alternate',
      loop: true
    })
  }
}
</script>

<style lang="scss" scoped>
body.loading .loader {
    animation: unset;
    border-radius: unset;
}

svg {
  width: 50vw;
  max-width: 120px;
}

path {
  stroke: #fff;
  stroke-width: .2rem;
}
</style>
