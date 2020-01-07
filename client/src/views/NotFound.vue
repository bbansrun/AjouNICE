<template>
    <section>
        <Error title="404 Not Found" description="존재하지 않는 페이지에요 ㅠㅠ" sub_description="주소를 확인 후 다시 접속해주세요." />
    </section>
</template>

<script>
import Error from '@/components/Error.vue'
export default {
  name: 'not_found',
  components: {
      Error
  }
}
</script>