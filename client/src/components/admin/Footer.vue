<template>
  <footer class="footer admin-footer">
    <section class="wrapper">
      <div class="footer-content">
        <Logo />
        <span>관리자 페이지는 PC 화면에 최적화되었습니다.</span>
      </div>
    </section>
  </footer>
</template>

<script>
import Logo from '@/assets/images/AjouNICE_shadow.svg'
export default {
  components: {
    Logo
  }
}
</script>

<style lang="scss" scoped>
footer {
  padding: unset;
  & .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start !important;
    align-items: center;
    min-height: unset !important;
    max-height: 32px;
    & svg {
      fill: #fff;
      width: 100px;
      max-height: 32px;
    }
    & span {
      font-size: .8rem;
    }
  }
}
</style>
