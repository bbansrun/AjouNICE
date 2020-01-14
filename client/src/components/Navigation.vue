<template>
    <nav class="gnb deactivated">
        <div class="section open always-open">
            <span class="icon">
                <span></span>
                <span></span>
                <span></span>
            </span>
            <header class="title">
                <h1 data-logo>AjouNICE!</h1>
            </header>
        </div>
        <ul class="section closed">
            <li>
                <router-link to="/">홈</router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'nav'    
}
</script>