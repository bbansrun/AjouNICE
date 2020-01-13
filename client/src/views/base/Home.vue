<template>
  <div class="home">
    <!-- <Nav /> -->
    <div class="container">
      <Welcome :username="userInfo.name" :user_id="userInfo.idx" />
      <IconNav :data="iconNav" />
      <section class="popular">
        <header>
          <small>핫이슈</small>
          <h2>주목해야할 게시물</h2>
        </header>
        <div class="posts summary">
          <a href="/board/community/anonymous/1/view">
            <article class="post">
              <header>
                <h3>카페에 자리가 없어서 어느날 빤스런한 김*영씨</h3>
                <p>
                  <small><span>2019.10.11</span>&nbsp;<span>익명의 오리</span></small>
                </p>
              </header>
              <div class="thumbnail">
                <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" height="100" alt="gravatar">
              </div>
            </article>
          </a>
          <a href="/board/community/anonymous/1/view">
            <article class="post">
              <header>
                <h3>카페에 자리가 없어서 어느날 빤스런한 김*영씨</h3>
                <p>
                  <small><span>2019.10.11</span>&nbsp;<span>익명의 오리</span></small>
                </p>
              </header>
              <div class="thumbnail">
                <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" height="100" alt="gravatar">
              </div>
            </article>
          </a>
          <a href="/board/community/anonymous/1/view">
            <article class="post">
              <header>
                <h3>카페에 자리가 없어서 어느날 빤스런한 김*영씨</h3>
                <p>
                  <small><span>2019.10.11</span>&nbsp;<span>익명의 오리</span></small>
                </p>
              </header>
              <div class="thumbnail">
                <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" height="100" alt="gravatar">
              </div>
            </article>
          </a>
        </div>
      </section>
      <section class="popular">
        <header>
          <small>핫이슈</small>
          <h2>주목해야할 게시물</h2>
        </header>
        <div class="posts summary">
          <a href="/board/community/anonymous/1/view">
            <article class="post">
              <header>
                <h3>카페에 자리가 없어서 어느날 빤스런한 김*영씨</h3>
                <p>
                  <small><span>2019.10.11</span>&nbsp;<span>익명의 오리</span></small>
                </p>
              </header>
              <div class="thumbnail">
                <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" height="100" alt="gravatar">
              </div>
            </article>
          </a>
          <a href="/board/community/anonymous/1/view">
            <article class="post">
              <header>
                <h3>카페에 자리가 없어서 어느날 빤스런한 김*영씨</h3>
                <p>
                  <small><span>2019.10.11</span>&nbsp;<span>익명의 오리</span></small>
                </p>
              </header>
              <div class="thumbnail">
                <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" height="100" alt="gravatar">
              </div>
            </article>
          </a>
          <a href="/board/community/anonymous/1/view">
            <article class="post">
              <header>
                <h3>카페에 자리가 없어서 어느날 빤스런한 김*영씨</h3>
                <p>
                  <small><span>2019.10.11</span>&nbsp;<span>익명의 오리</span></small>
                </p>
              </header>
              <div class="thumbnail">
                <img src="https://avatars3.githubusercontent.com/u/51874554?s=200&v=4" height="100" alt="gravatar">
              </div>
            </article>
          </a>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script>
import Nav from '@/components/Navigation.vue'
import Welcome from '@/components/Welcome.vue'
import IconNav from '@/components/IconNav.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'home',
  data () {
    return {
      userInfo: null,
      iconNav: [
        { id: 1, title: '커뮤니티', background: 'https://i.pinimg.com/originals/41/5d/0e/415d0e858d30604063794897fbffd048.png', link: '/board/' },
        { id: 2, title: '학사일정', background: 'https://i.pinimg.com/originals/d3/e4/1f/d3e41fcda53faa7b6da198ad21dedc9d.jpg', link: '/' },
        { id: 3, title: 'Ajou버스', background: 'https://cdn.dribbble.com/users/20883/screenshots/4014741/evgeniy-artsebasov-bus-icon.png', link: '/' },
        { id: 4, title: '아주맛집', background: 'http://imagescdn.gettyimagesbank.com/500/19/169/345/0/1141991229.jpg', link: '/place/gourmet' },
      ]
    }
  },
  components: {
    Nav, Welcome, IconNav, Footer
  },
  beforeCreate () {
    document.body.classList.remove('auth')
    this.$Axios.get('/api/protected').then(result => {
      this.userInfo = result.data.user
    })
  },
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/media";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";
body {
  background: #eaeaea;
}

section.popular {
  background: #fff;
  > header {
    line-height: 1;
    text-align: center;
    padding: 1rem 0;
    border-top: 1px solid rgba(0,0,0,.2);
    border-bottom: 1px solid rgba(0,0,0,.2);
  }
  > .posts.summary {
    & a {
      display: inline-block;
      color: #000;
    }
    & article {
      width: 100vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      > header {
        width: 100%;
        padding: 1rem;
        > p {
          margin-top: auto;
        }
      }
      > .thumbnail {
        max-width: 100px;
        max-height: 100px;
      }
    }
  }
}
</style>
