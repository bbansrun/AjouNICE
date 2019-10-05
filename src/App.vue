<template>
  <div id="app">
    <div id="nav">
    </div>
    <div id="logos">
      <p>
        <span class="logo fontface_jalnan">AjouNICE!</span>
      </p>
    </div>
    <router-view/>

    <a href="https://github.com/bbansrun/AjouNICE"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png" alt="Fork me on GitHub"></a>

  </div>
</template>

<style lang="scss">
@font-face {
  font-family: 'yg-jalnan';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff'); font-weight: normal; font-style: normal;
}

html, body {
  font-size: 15px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#plus {
  padding: 0 20px 0 20px;
  display: inline-block;
  font-size: 50px;
  vertical-align: top;
  line-height: 100px;
}

.fontface_jalnan {
  font-family: 'yg-jalnan';
  font-size: 4rem;
}

</style>
