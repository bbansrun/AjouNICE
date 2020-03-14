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
        <label for="inherited">대분류</label>
        <div class="input-form-wrapper">
          <v-select
            v-model="selectedParent"
            :value="selectedParent"
            :options="categories"
            :reduce="item => item.category_idx"
            label="category_nm"
            placeholder="모듈 대분류를 선택하세요."
            :class="{'error': validation.depth === false}"
            @input="selectedParentInput"
          >
            <template v-slot:no-options>
              <font-awesome-icon icon="times" />&nbsp;
              <span>일치하는 옵션이 없어요.</span>
            </template>
          </v-select>
          <b-notification
            type="is-info"
            has-icon
            aria-close-label="닫기"
          >
            모듈 hierarchy level은 1까지만 지원합니다.
          </b-notification>
          <p
            v-show="validation.depth === false"
            class="auto-validate-noti"
            :class="{'error': validation.depth === false}"
          >
            카테고리 Hierarchy 레벨이 선택되지 않았습니다.
          </p>
        </div>
      </div>
      <div
        v-show="Number.isInteger(selectedParent)"
        class="input-form-group"
      >
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
      <div
        v-show="Number.isInteger(selectedParent)"
        class="input-form-group"
      >
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
            {{ invalidMsg.title }}
          </p>
        </div>
      </div>
      <div
        v-show="Number.isInteger(selectedParent)"
        class="input-form-group"
      >
        <label for="title">특정그룹 접속제한</label>
        <div class="input-form-wrapper">
          <b-switch
            v-model="allAccessable"
            :value="allAccessable"
            type="is-danger"
          >
            {{ allAccessable ? '전체 그룹 열람 허용' : '특정 그룹 열람 허용' }}
          </b-switch>
          <div
            v-show="!allAccessable"
            class="wrapper"
          >
            <b-field>
              <b-select
                v-model="selectedGroupAccess"
                multiple
                :native-size="groupOptions.length"
              >
                <option
                  v-for="item in groupOptions"
                  :key="item.label"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </b-select>
            </b-field>
            <b-notification
              type="is-info"
              has-icon
              aria-close-label="닫기"
            >
              드래그, Ctrl, 혹은 Shift를 사용하여 Multi-select가 가능합니다.
            </b-notification>
          </div>
        </div>
      </div>
      <div
        v-show="Number.isInteger(selectedParent)"
        class="input-form-group"
      >
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
      <div
        v-show="Number.isInteger(selectedParent)"
        class="input-form-group"
      >
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
      <div
        v-show="Number.isInteger(selectedParent)"
        class="input-form-group"
      >
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
import _ from 'lodash'
import gql from 'graphql-tag'
import { AllCates } from '@/assets/graphql/queries'
import { singleUpload, modCategory } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      private_yn_label: '공개',
      icon: null,
      selectedParent: '',
      allAccessable: true,
      selectedGroupAccess: [],
      groupOptions: [
        { value: 'R', label: '재학' },
        { value: 'M', label: '대학원' },
        { value: 'G', label: '졸업' },
        { value: 'E', label: '교원' },
        { value: 'U', label: '일반' }
      ],
      form: {
        category_nm: '',
        category_type: 'NORMAL',
        access_auth: 'ALL',
        depth: null,
        title: '',
        desc: '',
        category_icon: '',
        private_yn: 'Y',
        parent: '',
        ip: this.$store.state.user.access_loc
      },
      validation: {
        category_nm: null,
        title: null,
        desc: null,
        depth: null
      },
      invalidMsg: {
        title: ''
      },
      validated: false
    }
  },
  apollo: {
    categories: {
      query: gql`${AllCates}`,
      variables: {
        depth: 0,
        category_type: 'NORMAL'
      },
      update (data) {
        return [{ category_nm: '최상위 카테고리 생성', category_idx: 0 }].concat(_.each(data.boards, (item) => { item.category_idx = parseInt(item.category_idx) }))
      }
    }
  },
  watch: {
    allAccessable (value) {
      if (value === true) {
        this.form.access_auth = 'ALL'
      }
    },
    selectedGroupAccess (value) {
      this.form.access_auth = Array.prototype.join.call(value, '_')
    },
    'form.category_nm' (value) {
      this.validateInput('category_nm')
    },
    'form.title' (value) {
      if (value) {
        if (value.includes('/')) {
          this.validation.title = false
          this.invalidMsg.title = '모듈명에 / 가 포함될 수 없습니다.'
        } else {
          this.validateInput('title')
        }
      } else {
        this.validation.title = false
        this.invalidMsg.title = 'URL 구분자가 입력되지 않았습니다.'
      }
    },
    'form.desc' (value) {
      this.validateInput('desc')
    },
    selectedParent (value) {
      this.selectedParentInput()
      this.validateInput('depth', null, true)
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
        mutation: gql`${singleUpload}`,
        variables: {
          uploadType: 'CATE_ICON',
          file,
          options: {
            CATE_ICON: true
          }
        }
      }).then(({ data: { imageUpload } }) => {
        if (imageUpload) {
          this.form.category_icon = imageUpload
        }
      })
    }
  },
  methods: {
    validateInput (key, compare = null, dictValueIsNumber = false) {
      // Form Data가 적절한 조건 만족하였는지 판단
      // compare의 경우 object type data를 받을 경우,
      // 비교값인 value와 일치/불일치 비교 여부 checkIsCorrect (Boolean)를 전달하여야함
      if (compare) {
        if (Object.prototype.hasOwnProperty.call(compare, 'value') &&
            Object.prototype.hasOwnProperty.call(compare, 'checkIsCorrect')) {
          if (compare.checkIsCorrect) {
            if (compare.value instanceof Array) {
              this.validation[key] = compare.value.every(item => this.form[key] === item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          } else {
            if (compare.value instanceof Array) {
              this.validation[key] = compare.value.every(item => this.form[key] !== item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          }
        } else {
          throw Error('파라미터 compare 값이 유효하지 않습니다.')
        }
      } else {
        if (dictValueIsNumber) {
          if (Number.isInteger(this.form[key])) {
            this.validation[key] = true
          } else {
            this.validation[key] = false
          }
        } else {
          if (this.form[key]) {
            this.validation[key] = true
          } else {
            this.validation[key] = false
          }
        }
      }
    },
    validate () {
      this.validateInput('category_nm')
      this.validateInput('desc')
      this.validateInput('depth', null, true)
      // Custom Validation
      if (this.form.title) {
        if (this.form.title.includes('/')) {
          this.validation.title = false
          this.invalidMsg.title = '모듈명에 / 가 포함될 수 없습니다.'
        } else {
          this.validateInput('title')
        }
      } else {
        this.validation.title = false
        this.invalidMsg.title = 'URL 구분자가 입력되지 않았습니다.'
      }
      this.validated = Object.keys(this.validation).every((key) => this.validation[key])
    },
    selectedParentInput () {
      if (this.selectedParent === 0) {
        this.form.depth = 0
      } else {
        this.form.depth = 1
        this.form.parent = this.selectedParent
      }
    },
    createNewModule () {
      this.validate()
      if (this.validated) {
        if (this.selectedParent === 0) {
          delete this.form.parent
        }
        document.body.classList.add('loading')
        this.$apollo.mutate({
          mutation: gql`${modCategory}`,
          variables: {
            mode: 'CREATE',
            options: {
              ...this.form
            }
          }
        }).then(({ data: { modCategory } }) => {
          document.body.classList.remove('loading')
          if (modCategory) {
            this.$buefy.toast.open('모듈을 생성하였습니다.')
            this.$router.push('/gate/manager/boards')
          }
        }).catch(error => {
          document.body.classList.remove('loading')
          console.error(error)
          this.$router.push('/error/500')
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
