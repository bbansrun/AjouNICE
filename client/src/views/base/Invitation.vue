<template>
    <div class="wrapper">
        <div class="invitation" align="center">
            <img src="@/assets/images/AjouNICE.png" width="100" />
            <h1>Coming Soon</h1>
        </div>
        <div class="copyright">
            <h3 data-logo>AjouNICE</h3>
            <span>&nbsp;&nbsp;|&nbsp;&nbsp;<small>아주대학교 학부 커뮤니티 서비스</small></span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & .invitation {
        margin-bottom: 2rem;
    }
}

h3 {
    display: inline-block;
}
</style>