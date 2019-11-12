<template>
    <div class="wrapper">
        <section data-form class="form login">
            <header>
                <h1 class="logo-font">AjouNICE!</h1>
                <small>아주대학교의 새로운 커뮤니티 서비스를 만듭니다.</small>
            </header>
            <form method="GET" action='/#/home'>
                <header class="logo-font">LOGIN</header>
                <div class="divider"></div>
                <div class="input-form">
                    <input type="email" placeholder="이메일" required>
                </div>
                <div class="input-form">
                    <input type="password" placeholder="패스워드" required>
                </div>
                <div class="input-form">
                    <input type="submit" value="로그인">
                </div>
                <div class="input-form">
                    <a href="#">계정 재설정</a>
                    <a href="#">아직 회원이 아니신가요?</a>
                </div>
                <div class="divider"></div>
                <footer>
                    <span>&copy; 2019 팀 <a href="http://github.com/bbansrun">빤스런</a>.</span>
                </footer>
            </form>
        </section>
    </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

<style lang="scss">
@import "~@/assets/styles/reset";
@import "~@/assets/styles/index";
@import "~@/assets/styles/fonts";
</style>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: url('https://sso.ajou.ac.kr/common/css/images/bg.jpg') no-repeat center center/cover;
    > [data-form] {
        position: absolute;
        display: flex;
        flex-direction: row;
        min-width: 90vw;
        min-height: 60vh;
        top: 50%;
        left: 50%;
        background: #fff;
        box-shadow: 0 0 10px rgba(0,0,0,.24);
        transform: translate(-50%, -50%);
        > header {
            display: flex;
            flex-direction: column;
            width: 50%;
            padding: 10px;
            justify-content: center;
            align-items: center;
            background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            > h1 {
                font-size: 2.5rem;
                text-shadow: 0 0 8px rgba(0,0,0,.24);
            }
            > small {
                font-size: .8rem;
            }
        }
        > form {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 50%;
            padding: 10px;
            text-align: center;
            background: #eee;
            > hr {
                width: 100%;
            }
            > header {
                font-weight: 700;
                font-size: 2em;
                color: #4b6ab9;
            }
            > .input-form {
                position: relative;
                width: 100%;
                > input {
                    position: relative;
                    width: calc(90% - 20px);
                    padding: 5px 10px;
                    margin-bottom: 15px;
                    border-radius: .8rem;
                    outline: none;
                    border: none;
                    box-shadow: 0 2px 2px rgba(36, 37, 38, 0.08);
                    transition: box-shadow 0.25s ease 0s, transform 0.25s ease 0s, transform 0.5s cubic-bezier(0.6, 0.2, 0.1, 1) 0s, opacity 0.5s cubic-bezier(0.6, 0.2, 0.1, 1) 0s;
                    &:focus {
                        box-shadow: 1px 5px 7px rgba(36, 37, 38, 0.13);
                    }
                }
                > input[type="email"], input[type="password"], input[type="submit"] {
                    font-size: .85em;
                }
                > input:valid {
                    color: #fff;
                    &::placeholder{
                        color: #fff;
                    }
                    background: #4b6ab9;
                }
                > input[type="submit"] {
                    cursor: pointer;
                    color: #fff;
                    background: #6a11cb;
                    transition: background-color .2s ease-in .2s;
                    &:hover {
                        background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
                        box-shadow: 1px 5px 7px rgba(36, 37, 38, 0.13);
                    }
                }
                > a {
                    display: block;
                    font-size: .8rem;
                    text-decoration: none;
                }
                display: block;
            }
            > footer {
                > span {
                    font-size: .65em;
                    > a {
                        text-decoration: none;
                    }
                }
            }
        }
    }
}
</style>
