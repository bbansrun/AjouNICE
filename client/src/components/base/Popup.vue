<template>
  <section
    class="popup"
    :style="{ 'display': !display ? 'none' : 'block' }"
  >
    <nav class="popup-menu">
      <div class="wrapper">
        <span>
          <strong>팝업</strong>
        </span>
        <div class="buttons">
          <b-button
            type="is-danger"
            size="is-small"
            @click="close"
          >
            <font-awesome-icon icon="times" />&nbsp;
            <span>더 이상 보지 않음</span>
          </b-button>
          <b-button
            type="is-primary"
            size="is-small"
            @click="close"
          >
            <font-awesome-icon icon="times" />&nbsp;
            <span>닫기</span>
          </b-button>
        </div>
      </div>
    </nav>
    <article>
      <header />
      <p>
        <img
          src="http://www.ajou.ac.kr/_attach/new/_images/2020/03/13/200313_main_visual02.jpg"
          alt="Popup"
        >
      </p>
    </article>
  </section>
</template>

<script>
export default {
  data () {
    return {
      display: true
    }
  },
  methods: {
    close () {
      if (this.display) this.display = false
      else this.display = true
    }
  }
}
</script>

<style lang="scss">
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  min-width: 400px;
  max-width: 90vw;
  height: auto;
  box-shadow: 0 0 5px rgba(0,0,0,.12);
  > .popup-menu {
    > .wrapper {
      display: grid;
      grid-template-columns: 1fr 3fr;
      padding: .2rem .5rem;
      background: #fff;
      > span {
        font: {
          size: 1rem;
        }
      }
      > .buttons {
        justify-content: flex-end;
      }
    }
  }
  > article {
    & img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
