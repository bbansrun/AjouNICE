<template>
  <div id="app">
    <nav class="gnb">
      <div class="logo">
        <h1>AjouNICE!</h1>&nbsp;|&nbsp;<span>아주대학교 차세대 커뮤니티 서비스</span>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
    <a href="https://github.com/bbansrun/AjouNICE">
      <img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png" alt="Fork me on GitHub">
    </a>
    <footer class="card">
      <article>
        <header>
          <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" alt="Bbansrun">
        </header>
        <div class="wrapper">
          <span>
            <strong><a href="http://github.com/bbansrun">팀 빤스런</a></strong>
          </span>
          <p>
            <ul>
              <li>김호영</li>
              <li>최성흠</li>
              <li>전지원</li>
              <li>오현희</li>
            </ul>
          </p>
        </div>
      </article>
    </footer>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: 'yg-jalnan';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff'); font-weight: normal; font-style: normal;
}

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1.6;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

body {
  font-size: 15px;
}

nav.gnb {
  color: #fff;
  background: linear-gradient(to right, rgb(133, 91, 218), rgb(165, 135, 212));
  padding: 10px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, .24);
  > .logo {
    padding: 0 20px;
    > h1 {
      display: inline-block;
      font-weight: 100;
      font-family: 'yg-jalnan';
      font-size: 30px;
      text-shadow: 0 0 10px rgba(0, 0, 0, .24);
    }
  }
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 50px;
  padding-top: 50px;
}

footer.card {
  position: absolute;
  left: 50%;
  bottom: 50px;
  transform: translate(-50%, 0);
  width: calc(80vw - 100px);
  margin: 0 auto;
  padding: 50px;
  box-shadow: 0 0 5px rgba(0, 0, 0, .12);
  background: #eee;
  > article {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    > .wrapper {
      text-align: center;
      > span > strong > a {
        font-size: 30px;
        font-weight: bold;
        text-decoration: none;
      }
      > p > ul > li {
        display: inline-block;
        padding: 0 10px;
      }
    }
  }
}
</style>
