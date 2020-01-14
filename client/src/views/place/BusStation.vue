<template>
    <div class="wrapper">
        <Landing title="Ajou버스" description="학교 주변에서 이용할 수 있는 교통수단을 알려드립니다." background="" />
        <div class="container">
            <section class="shuttle">
                <header>학교 셔틀버스</header>

            </section>
            <section class="ord-bus">
                <header>일반 시내/광역/마을버스</header>
                <div id="map"></div>
            </section>
        </div>
        <Footer />
    </div>
</template>

<script>
import axios from 'axios'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
export default {
    components: {
        Landing, Footer
    },
    data () {
        return {
            apiCallback: 'https://map.kakao.com/bus/stop.json?busstopid=',
            stops: ['BS72693', 'BS72549', 'BS72694', 'BS72548', 'BS320880', 'BS320876', 'BS320881'],
            stopsInfo: []
        }
    },
    methods: {

    },
    mounted () {
        let kakaoMap = document.createElement('script')
        kakaoMap.setAttribute('src', '//dapi.kakao.com/v2/maps/sdk.js?appkey=57ca092a89b95b1726db4a29813a43c5&autoload=false')
        document.body.appendChild(kakaoMap)
    }
}
</script>

<style lang="scss">
#map {
    width: 100vw;
    height: 400px;
}
</style>