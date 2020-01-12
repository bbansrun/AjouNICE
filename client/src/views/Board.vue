<template>
    <section>
        <header>{{ $route.params.name }}</header>
        <table class="list">
            <thead></thead>
            <tbody></tbody>
            <tfoot></tfoot>
        </table>
    </section>
</template>

<script>
export default {
    name: 'board',
    data () { return {} },
    methods: {},
    beforeCreate () {}    
}
</script>

<style lang="scss">

</style>