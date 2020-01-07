<template>
    <section>
        <Error title="Authentication Needed" description="이메일 인증 후 서비스 이용이 가능합니다." sub_description="가입시 기재하신 이메일 수신함을 확인해주세요." />
    </section>
</template>

<script>
import Error from '@/components/Error.vue'
export default {
  name: 'unauthorized',
  components: {
      Error
  }
}
</script>