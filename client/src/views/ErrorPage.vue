<template>
    <section>
        <Error :code="$route.params.code" :description="description" :sub_description="sub_description" />
    </section>
</template>

<script>
import Error from '@/components/Error.vue'
export default {
  name: 'error_by_code',
  components: {
      Error
  },
  data () {
    return {
        errData: {
            '401': {
                title: '잘못된 접근입니다.',
                description: '페이지에 대한 접근 권한이 없습니다.'
            },
            '404': {
                title: '페이지를 찾을 수 없습니다.',
                description: '올바른 주소인지 확인하여 주시기 바랍니다.'
            },
            '500': {
                title: '서비스에 오류가 있습니다.',
                description: '같은 상황이 지속되는 경우 개발팀으로 연락주시기 바랍니다.'
            }
        }
    }
  },
  computed: {
      description () {
          return this.errData[this.$route.params.code]['title']
      },
      sub_description () {
          return this.errData[this.$route.params.code]['description']
      }
  }
}
</script>