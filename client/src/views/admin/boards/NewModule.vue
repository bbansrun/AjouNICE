<template>
  <section class="boards">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 게시판 모듈 생성</strong>
    </header>
    <hr>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="category_nm">모듈명</label>
        <div class="input-form-wrapper">
          <input
            id="name"
            v-model="form.category_nm"
            type="text"
            name="category_nm"
            placeholder="모듈명을 입력해주세요."
            required
            pattern=".{1,}"
            :class="{'error': validation.category_nm === false}"
          >
          <p
            v-show="validation.category_nm === false"
            class="auto-validate-noti"
            :class="{'error': validation.category_nm === false}"
          >
            모듈명이 입력되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="inherited">대분류</label>
        <div class="input-form-wrapper">
          <v-select placeholder="모듈 대분류를 선택하세요.">
            <template v-slot:no-options>
              일치하는 옵션이 없어요.
            </template>
          </v-select>
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
            placeholder="URL로 들어갈 구분자입니다. (/board/:category[depth0]/:category[depth1]...)"
            required
            :class="{'error': validation.title === false}"
          >
          <p
            v-show="validation.title === false"
            class="auto-validate-noti"
            :class="{'error': validation.title === false}"
          >
            URL 구분자가 입력되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="title">특정그룹 접속제한</label>
        <div class="input-form-wrapper" />
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
            :class="{'error': validation.desc === false}"
          >
          <p
            v-show="validation.desc === false"
            class="auto-validate-noti"
            :class="{'error': validation.desc === false}"
          >
            게시판 설명이 입력되지 않았습니다.
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
              :src="form.icon_src"
              alt="카테고리 대표 이미지"
            >
            <v-gravatar
              v-show="!icon"
            />
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
          type="is-dark"
          size="is-small"
          @click="$router.go(-1)"
        >
          <font-awesome-icon icon="times" />&nbsp;
          <span>취소</span>
        </b-button>
      </div>
    </form>
    </hr<>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { UploadedCategoryIcon, addCategory } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      private_yn_label: '공개',
      icon: null,
      form: {
        category_nm: '',
        category_type: 'NORMAL',
        access_auth: 'ALL',
        depth: 0,
        title: '',
        desc: '',
        icon_src: '',
        private_yn: 'Y'
      },
      validation: {
        category_nm: null,
        title: null,
        desc: null
      },
      validated: false
    }
  },
  watch: {
    'form.category_nm' (value) {
      this.validateInput('category_nm')
    },
    'form.title' (value) {
      this.validateInput('title')
    },
    'form.desc' (value) {
      this.validateInput('desc')
    },
    private_yn (value) {
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
        this.icon_src = uploadedCategoryIcon
      })
    }
  },
  mounted () {
    this.form.reg_ip = this.$store.state.user.access_loc
    this.form.upt_ip = this.$store.state.user.access_loc
  },
  methods: {
    validateInput (key, compare = null) {
      // Form Data가 적절한 조건 만족하였는지 판단
      // compare의 경우 object type data를 받을 경우,
      // 비교값인 value와 일치/불일치 비교 여부 checkIsCorrect (Boolean)를 전달하여야함
      if (compare) {
        if (Object.prototype.hasOwnProperty.call(compare, 'value') && Object.prototype.hasOwnProperty.call(compare, 'checkIsCorrect')) {
          if (compare.checkIsCorrect) {
            if (this.form[key] === compare.value) {
              this.validation[key] = true
            } else {
              this.validation[key] = false
            }
          } else {
            if (this.form[key] !== compare.value) {
              this.validation[key] = true
            } else {
              this.validation[key] = false
            }
          }
        } else {
          throw Error('파라미터 compare 값이 유효하지 않습니다.')
        }
      } else {
        if (this.form[key]) {
          this.validation[key] = true
        } else {
          this.validation[key] = false
        }
      }
    },
    validate () {
      this.validateInput('category_nm')
      this.validateInput('title')
      this.validateInput('desc')
      this.validated = Object.keys(this.validation).every((key) => this.validation[key])
    },
    createNewModule () {
      this.validate()
      if (this.validated) {
        this.$apollo.mutate({
          mutation: gql`${addCategory}`,
          variables: {
            ...this.form
          }
        }).then(({ data: { addCategory } }) => {
          console.log(addCategory)
        }).catch(error => {
          console.error(error)
          this.$router.push('/error/404')
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
