<template>
  <section class="gourmet">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 맛집 등록</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="category_idx">분류</label>
        <div class="input-form-wrapper">
          <v-select
            v-model="form.category_idx"
            placeholder="등록하실 맛집 카테고리를 선택해주세요."
            :value="form.category_idx"
            :options="categories"
            :reduce="options => options.category_idx"
            label="category_nm"
            :class="{'error': validation.category_idx === false}"
            @input="selectedCategory"
          >
            <template v-slot:no-options>
              일치하는 옵션이 없어요.
            </template>
          </v-select>
          <p
            v-if="validation.category_idx === false"
            class="auto-validate-noti"
            :class="{'error': validation.category_idx === false}"
          >
            분류가 선택되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="res_nm">맛집명</label>
        <div class="input-form-wrapper">
          <input
            id="res_nm"
            v-model="form.res_nm"
            type="text"
            name="res_nm"
            required
            placeholder="맛집명을 입력해주세요."
            :class="{'error': validation.res_nm === false}"
          >
          <p
            v-if="validation.res_nm === false"
            class="auto-validate-noti"
            :class="{'error': validation.res_nm === false}"
          >
            맛집명이 입력되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="res_menu">주요 메뉴</label>
        <div class="input-form-wrapper">
          <b-field label="시그니처 메뉴 태그">
            <b-taginput
              v-model="tags"
              no-validate
              ellipsis
              icon="tag"
              placeholder="이곳의 시그니처 메뉴를 입력해주세요."
              :class="{'error': validation.res_menu === false}"
            />
          </b-field>
          <p
            v-if="validation.res_menu === false"
            class="auto-validate-noti"
            :class="{'error': validation.res_menu === false}"
          >
            주요 메뉴 태그가 입력되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="res_info">설명</label>
        <div class="input-form-wrapper">
          <input
            id="res_info"
            v-model="form.res_info"
            no-validate
            type="text"
            name="res_info"
            placeholder="맛집의 특색을 나타내는 설명을 입력해주세요."
            :class="{'error': validation.res_info === false}"
          >
          <p
            v-if="validation.res_info === false"
            class="auto-validate-noti"
            :class="{'error': validation.res_info === false}"
          >
            맛집 설명이 입력되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="res_addr">위치(주소)</label>
        <div class="input-form-wrapper">
          <input
            id="res_addr"
            v-model="form.res_addr"
            no-validate
            type="text"
            name="res_addr"
            placeholder="위치를 입력하세요. (도로명/지번)"
            :class="{'error': validation.res_addr === false}"
          >
          <p
            v-if="validation.res_addr === false"
            class="auto-validate-noti"
            :class="{'error': validation.res_addr === false}"
          >
            위치 정보가 입력되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="res_phone">연락처</label>
        <div class="input-form-wrapper">
          <input
            id="res_phone"
            v-model="form.res_phone"
            no-validate
            type="tel"
            name="res_phone"
            placeholder="연락처를 입력하세요."
            :class="{'error': validation.res_phone === false}"
          >
          <p
            v-if="validation.res_phone === false"
            class="auto-validate-noti"
            :class="{'error': validation.res_phone === false}"
          >
            연락처가 입력되지 않았습니다.
          </p>
        </div>
      </div>
      <div class="input-form-group">
        <label for="res_icon">대표 썸네일</label>
        <div class="input-form-wrapper">
          <figure>
            <div class="cover new-gravatar">
              <b-upload
                v-model="icon"
                expanded
                accept="image/*"
              >
                <strong>변경</strong>
              </b-upload>
            </div>
            <img
              v-show="icon"
              :src="form.res_icon"
              :alt="form.res_nm"
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
            <span>아이콘 미지정시 서비스 노출시 부자연스러울 수 있으니, 가급적 지정을 요합니다. (미등록시 깨짐 표시)</span>
          </b-notification>
        </div>
      </div>
      <div class="input-form-group">
        <label for="resources">이미지</label>
        <div class="input-form-wrapper">
          <b-field>
            <b-upload
              v-model="resources"
              multiple
              drag-drop
              accept="image/*"
              @input="limitFiles"
            >
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon
                      icon="upload"
                      size="is-large"
                    />
                  </p>
                  <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
                </div>
              </section>
            </b-upload>
          </b-field>
          <div class="tags">
            <span
              v-for="(file, index) in resources"
              :key="index"
              class="tag is-primary"
            >
              {{ file.name }}
              <button
                class="delete is-small"
                type="button"
                @click="removeResources(index)"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="input-form-controls buttons">
        <b-button
          size="is-small"
          type="is-primary"
          @click="submitForm"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>작성</span>
        </b-button>
        <b-button
          size="is-small"
          type="is-dark"
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
import { AllCates } from '@/assets/graphql/queries'
import { addGourmetPlace, singleUpload, multiUpload } from '@/assets/graphql/mutations'

export default {
  data () {
    return {
      tags: [],
      categories: [],
      icon: null,
      resources: [],
      form: {
        category_idx: '',
        res_nm: '',
        res_menu: '',
        res_addr: '',
        res_phone: '',
        res_info: '',
        res_lat: '',
        res_lon: '',
        res_icon: ''
      },
      validation: {
        category_idx: null,
        res_nm: null,
        res_menu: null,
        res_addr: null,
        res_phone: null,
        res_info: null
        // res_lat: '',
        // res_lon: '',
      },
      validated: false
    }
  },
  watch: {
    'form.res_nm' (value) {
      this.validateInput('res_nm')
    },
    'form.res_menu' (value) {
      this.validateInput('res_menu')
    },
    'form.res_info' (value) {
      this.validateInput('res_info')
    },
    'form.res_addr' (value) {
      this.validateInput('res_addr')
    },
    'form.res_phone' (value) {
      this.validateInput('res_phone')
    },
    tags (value) {
      this.form.res_menu = value.join(',')
    },
    icon (file) {
      this.$apollo.mutate({
        mutation: gql`${singleUpload}`,
        variables: {
          uploadType: 'REST_ST_ICON',
          file,
          options: {
            REST_ST_ICON: true
          }
        }
      }).then(({ data: { imageUpload } }) => {
        this.form.res_icon = imageUpload
      })
    }
  },
  beforeMount () {
    this.$apollo.query({
      query: gql`${AllCates}`,
      variables: {
        depth: 0,
        category_type: 'GOURMET'
      }
    }).then(({ data: { boards } }) => {
      this.categories = boards
    })
  },
  methods: {
    limitFiles (files) {
      if (files.length > 10) {
        this.flashError('이미지는 10개까지 첨부가능합니다. 초과된 파일은 제외합니다.')
        this.resources = this.resources.splice(0, 10)
      }
    },
    removeResources (index) {
      this.resources.splice(index, 1)
    },
    selectedCategory (value) {
      this.form.category_idx = value
      this.validateInput('category_idx')
    },
    validateInput (key, compare = null) {
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
        if (this.form[key]) {
          this.validation[key] = true
        } else {
          this.validation[key] = false
        }
      }
    },
    validate () {
      this.validateInput('category_idx')
      this.validateInput('res_nm')
      this.validateInput('res_menu')
      this.validateInput('res_addr')
      this.validateInput('res_phone')
      this.validateInput('res_info')
      // this.validateInput('res_lat')
      // this.validateInput('res_lon')
      this.validated = Object.keys(this.validation).every((key) => this.validation[key])
    },
    submitForm () {
      this.validate()
      if (this.validated) {
        this.$buefy.dialog.confirm({
          title: '최종 확인',
          message: '<span>승인 즉시 데이터가 서비스에 노출됩니다.</span><br/><strong>(업소 정보가 올라가는만큼 신중히 검토하여주시기바랍니다.)</strong>',
          confirmText: '업로드',
          cancelText: '취소',
          type: 'is-warning',
          hasIcon: true,
          icon: 'exclamation-triangle',
          onConfirm: () => {
            document.body.classList.add('loading')
            // 우선 게시물 생성하여 이를 바탕으로 하는 리소스 이미지 릴레이션 진행
            this.form.category_idx = parseInt(this.form.category_idx)
            this.form.user_idx = this.$store.state.user.idx
            this.form.reg_ip = this.$store.state.user.access_loc
            this.form.reg_dt = Date.now()
            this.form.upt_ip = this.form.reg_ip
            this.form.upt_dt = this.form.reg_dt
            // 위도 경도 임시 조치
            delete this.form.res_lat
            delete this.form.res_lon
            // 게시물 업로드
            this.$apollo.mutate({
              mutation: gql`${addGourmetPlace}`,
              variables: { ...this.form }
            }).then(({ data: { addGourmetPlace } }) => {
              if (addGourmetPlace) {
                this.$apollo.mutate({
                  mutation: gql`${multiUpload}`,
                  variables: {
                    uploadType: 'POST_ATTACHMENTS',
                    files: this.resources,
                    options: {
                      POST_ATTACHMENTS: {
                        res_idx: parseInt(addGourmetPlace.res_idx)
                      }
                    }
                  }
                }).then(({ data: { batchImageUpload } }) => {
                  if (batchImageUpload) {
                    document.body.classList.remove('loading')
                    this.$buefy.toast.open('게시물 생성 및 관련 이미지를 업로드하였습니다.')
                    this.$router.push('/gate/manager/boards/gourmet')
                  }
                })
              }
            })
          }
        })
      } else {
        this.$buefy.dialog.alert({
          title: '에러',
          message: '작성하지 않거나 잘못된 입력 항목이 있습니다.',
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

<style scoped>
.upload .upload-draggable {
  width: 100%;
}
</style>
