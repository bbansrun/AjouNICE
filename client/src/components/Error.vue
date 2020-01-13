<template>
    <section data-error>
        <header>
            <h1 class="logo-font">
                <span>X_X</span>
                <div class="code" v-if="code">{{ code }}</div>
            </h1>
        </header>
        <div align="center" data-description>
            <p>{{ description }}</p>
            <p>{{ sub_description }}</p>
        </div>
        <a href="/" class="button">
            → 처음으로
        </a>
        <hr />
        <div class="logo">
            <h2 class="logo-font">AjouNICE!</h2>
            <span text-divider>|</span>
            <span>아주대학교 커뮤니티 서비스</span>
        </div>
    </section>
</template>

<script>

export default {
  name: 'error',
  props: {
    description: String,
    sub_description: String,
    code: Number
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";

section[data-error] {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: #fff;
    > header > h1 {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 4rem;
        font-weight: bold;
        background-image: linear-gradient(to bottom, #a18cd1 0%, #fbc2eb 100%);
        text-shadow: 0 2px 2px rgba(0,0,0,.1);
    }
    > .button {
        font-size: .8rem;
        margin-top: 15px;
        color: #fff;
        background: #a18cd1;
        border-radius: 8px;
        padding: 8px 30px;
        text-decoration: none;
        box-shadow: 0 5px 5px rgba(0,0,0,.2);
        transition: .2s all ease;
        &:hover {
            background: purple;
            transform: translateY(3px);
        }
    }
    > .logo {
        text-align: center;
        > h2 {
            display: inline-block;
            font-size: 1.5rem;
            color: rgb(41, 61, 81);
        }
        > span {
            font-size: .8rem;
        }
    }
}
</style>
