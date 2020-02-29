<template>
  <section class="gourmet">
    <header class="underline underline-inline-block underline-animated">
      <strong>맛집 신규 모듈 생성</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="category_nm">모듈명</label>
        <div class="input-form-wrapper">
          <input
            id="category_nm"
            v-model="form.category_nm"
            type="text"
            name="category_nm"
            placeholder="모듈명을 입력해주세요"
            required
            pattern=".{1,}"
            :class="{'error': validation.category_nm === false }"
          >
          <p
            v-if="validation.category_nm === false"
            class="auto-validate-noti"
            :class="{'error': validation.category_nm === false }"
          >
            모듈명을 입력해주세요.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="title">영문명</label>
        <div class="input-form-wrapper">
          <input
            id="title"
            v-model="form.title"
            type="text"
            name="title"
            placeholder="URL로 들어갈 구분자입니다. (/place/gourmet/:category)"
            required
            :class="{ 'error': validation.title === false }"
          >
          <p
            v-if="validation.title === false"
            class="auto-validate-noti"
            :class="{ 'error': validation.title === false }"
          >
            URL 구분자를 입력해주세요.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="title">특정그룹 접속제한</label>
        <div class="input-form-wrapper">
          특정 그룹 선택 - Multi-select 영역
        </div>
      </div>
      <div class="input-form-group">
        <label for="title">모듈 공개여부</label>
        <div class="input-form-wrapper">
          <b-switch
            v-model="form.private_yn"
            true-value="Y"
            false-value="N"
          >
            {{ private_yn_label }}
          </b-switch>
        </div>
      </div>
      <div class="input-form-group">
        <label for="desc">모듈부가설명</label>
        <div class="input-form-wrapper">
          <input
            id="desc"
            v-model="form.desc"
            type="text"
            name="desc"
            placeholder="어떤 게시판인지 설명을 작성해주세요."
            required
            :class="{ 'error': validation.desc === false }"
          >
          <p
            v-if="validation.desc === false"
            class="auto-validate-noti"
            :class="{ 'error': validation.desc === false }"
          >
            모듈 설명을 입력해주세요.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="icon">아이콘 업로드</label>
        <div class="input-form-wrapper">
          <figure>
            <div class="cover new-gravatar">
              <b-upload
                v-model="icon"
                accept="image/*"
              >
                <strong>변경</strong>
              </b-upload>
            </div>
            <img
              v-show="icon"
              :src="form.category_icon"
              alt="카테고리 대표 이미지"
            >
            <div
              v-show="!icon"
              class="profile profile-warning"
            >
              <v-gravatar
                :email="$store.state.user.email"
              />
            </div>
          </figure>
          <b-notification
            v-show="!icon"
            type="is-warning"
            has-icon
            aria-close-label="닫기"
          >
            대표 아이콘 미등록시, 서비스 표시 디자인에 문제가 생길 수 있습니다.
          </b-notification>
        </div>
      </div>
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
          @click="createNewModule"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>신규 모듈 생성</span>
        </b-button>
        <b-button
          type="is-danger"
          size="is-small"
          @click="$router.go(-1)"
        >
          <font-awesome-icon icon="times" />&nbsp;
          <span>취소</span>
        </b-button>
      </div>
    </form>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { UploadedCategoryIcon, addCategory } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      form: {
        category_nm: '',
        title: '',
        access_auth: 'ALL',
        private_yn: 'Y',
        desc: '',
        category_icon: '',
        category_type: 'GOURMET',
        depth: 0,
        reg_ip: '',
        upt_ip: ''
      },
      validation: {
        category_nm: null,
        title: null,
        access_auth: null,
        desc: null,
        icon: null
      },
      validated: false,
      private_yn_label: '공개',
      icon: null
    }
  },
  watch: {
    'form.private_yn' (value) {
      if (value === 'Y') {
        this.private_yn_label = '공개'
      } else if (value === 'N') {
        this.private_yn_label = '비공개'
      }
    },
    icon (file) {
      this.$apollo.mutate({
        mutation: gql`${UploadedCategoryIcon}`,
        variables: { file }
      }).then(({ data: { uploadedCategoryIcon } }) => {
        this.form.category_icon = uploadedCategoryIcon
      })
    }
  },
  mounted () {
    this.form.reg_ip = this.$store.state.user.access_loc
    this.form.upt_ip = this.$store.state.user.access_loc
  },
  methods: {
    validate () {
      if (this.form.category_nm) {
        this.validation.category_nm = true
      } else {
        this.validation.category_nm = false
      }
      if (this.form.title) {
        this.validation.title = true
      } else {
        this.validation.title = false
      }
      if (this.form.desc) {
        this.validation.desc = true
      } else {
        this.validation.desc = false
      }
      if (this.validation.category_nm && this.validation.title && this.validation.desc) {
        this.validated = true
      }
    },
    createNewModule () {
      this.validate()
      if (this.validated) {
        document.body.classList.add('loading')
        this.$apollo.mutate({
          mutation: gql`${addCategory}`,
          variables: {
            ...this.form
          }
        }).then(({ data: { addCategory } }) => {
          document.body.classList.remove('loading')
          this.$buefy.toast.open('모듈을 생성하였습니다.')
          this.$router.push('/gate/manager/boards/gourmet')
        }).catch(error => {
          document.body.classList.remove('loading')
          console.error(error)
        })
      } else {
        this.$buefy.dialog.alert({
          title: '에러',
          message: '작성하지 않은 항목이 있습니다.',
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          ariaRole: 'alertdialog',
          ariaModal: true,
          confirmText: '확인'
        })
      }
    }
  }
}
</script>

<style>

</style>
