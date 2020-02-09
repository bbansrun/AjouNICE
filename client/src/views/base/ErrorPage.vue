<template>
  <Error
    :code="errCode"
    :description="description"
    :sub_description="sub_description"
  />
</template>

<script>
import Error from '@/components/base/Error.vue'
export default {
  name: 'ErrorByCode',
  components: {
    Error
  },
  data () {
    return {
      errCode: null,
      errData: {
        401: {
          title: '서비스 이용을 위한 이메일 인증이 필요합니다.',
          description: '회원가입시 입력하신 이메일 수신함을 확인해주시기 바랍니다.'
        },
        403: {
          title: '페이지에 접속할 수 없습니다.',
          description: '이 페이지를 접근할 수 있는 권한이 없습니다.'
        },
        404: {
          title: '페이지를 찾을 수 없습니다.',
          description: '올바른 주소인지 확인하여 주시기 바랍니다.'
        },
        405: {
          title: '해당 요청은 사용할 수 없습니다.',
          description: '지원되지 않는 요청입니다.'
        },
        500: {
          title: '서비스에 오류가 있습니다.',
          description: '같은 상황이 지속되는 경우 개발팀으로 연락주시기 바랍니다.'
        },
        503: {
          title: '서비스에 일시적 문제가 발생하였습니다.',
          description: '잠시 후에 다시 접속바랍니다.'
        }
      }
    }
  },
  computed: {
    description () {
      return this.errData[this.$route.params.code].title
    },
    sub_description () {
      return this.errData[this.$route.params.code].description
    }
  },
  beforeMount () {
    if (this.code() in this.errData) {
      this.errCode = this.code()
    } else {
      window.location = '/error/404'
    }
  },
  methods: {
    code () {
      return this.$route.params.code
    }
  }
}
</script>
