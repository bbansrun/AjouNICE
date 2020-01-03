<template>
    <div class="loader">
        <div class="wrapper">
            <div class="logo">
                <img src="/AjouNICE.png" alt="AjouNICE!" />
            </div>
            <p>필요한 데이터를 준비하고 있습니다...</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading'
}
</script>

<style lang="scss" scoped>
.loader {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    color: #fff;
    background: rgba(0,0,0,.95);
    z-index: 10000000000;
    > .wrapper {
        position: relative;
        top: 50%;
        text-align: center;
        transform: translateY(-50%);
        > .logo {
            margin-bottom: 1rem;
            > img {
                width: 120px;
                transform: perspective(1000px) rotateX(-10deg);
                transform-style: preserve-3d;
                animation: animate 2s linear infinite;
            }
        }
    }
}
body.loading {
    > #app > .loader {
        display: block;
    }
}
@keyframes animate {
    0% {
        transform: perspective(1000px) rotate(0deg);
    }
    100% {
        transform: perspective(1000px) rotate(360deg);
    }
}
</style>