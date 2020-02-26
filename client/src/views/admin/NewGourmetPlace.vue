<template>
  <div class="wrapper">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 맛집 등록</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form-group">
        <label for="category_idx">분류</label>
        <v-select
          v-model="category_idx"
          placeholder="등록하실 맛집 카테고리를 선택해주세요."
          :value="category_idx"
          :options="categories"
          :reduce="options => options.category_idx"
          label="category_nm"
          @input="selectedCategory"
        />
      </div>
      <div class="input-form-group">
        <label for="res_nm">맛집명</label>
        <input
          id="res_nm"
          v-model="form.res_nm"
          type="text"
          name="res_nm"
          required
          placeholder="맛집명을 입력해주세요."
        >
      </div>
      <div class="input-form-group">
        <label for="res_menu">주요 메뉴</label>
        <b-field label="시그니처 메뉴 태그">
          <b-taginput
            v-model="tags"
            no-validate
            ellipsis
            icon="tag"
            placeholder="이곳의 시그니처 메뉴를 입력해주세요."
          />
        </b-field>
      </div>
      <div class="input-form-group">
        <label for="res_info">설명</label>
        <input
          id="res_info"
          v-model="form.res_info"
          type="text"
          name="res_info"
          placeholder="맛집의 특색을 나타내는 설명을 입력해주세요."
        >
      </div>
      <div class="input-form-group">
        <label for="res_addr">위치(주소)</label>
        <input
          id="res_addr"
          v-model="form.res_addr"
          no-validate
          type="text"
          name="res_addr"
          placeholder="위치를 입력하세요. (도로명/지번)"
        >
      </div>
      <div class="input-form-group">
        <label for="res_phone">연락처</label>
        <input
          id="res_phone"
          v-model="form.res_phone"
          no-validate
          type="tel"
          name="res_phone"
          placeholder="연락처를 입력하세요."
        >
      </div>
      <div class="input-form-group">
        <label for="res_icon">대표 썸네일</label>
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
            :src="form.res_icon"
            :alt="form.res_nm"
          >
          <v-gravatar
            v-show="!icon"
          />
        </figure>
        <b-notification
          v-show="!icon"
          type="is-info"
          has-icon
          aria-close-label="닫기"
        >
          <span>아이콘 미지정시 서비스 노출시 부자연스러울 수 있으니, 가급적 지정을 요합니다. (미등록시 깨짐 표시)</span>
        </b-notification>
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
          type="is-danger"
        >
          <font-awesome-icon icon="times" />&nbsp;
          <span>취소</span>
        </b-button>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { AllCates } from '@/assets/graphql/queries'
import { addGourmetPlace, addGourmetResIcon } from '@/assets/graphql/mutations'

export default {
  data () {
    return {
      tags: [],
      categories: [],
      category_idx: '',
      icon: null,
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
      }
    }
  },
  watch: {
    tags (value) {
      this.form.res_menu = value.join(',')
    },
    icon (file) {
      this.$apollo.mutate({
        mutation: gql`${addGourmetResIcon}`,
        variables: { file }
      }).then(({ data: { addGourmetResIcon } }) => {
        this.form.res_icon = addGourmetResIcon
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
    selectedCategory (value) {
      this.category_idx = value
    },
    submitForm () {
      this.form.category_idx = parseInt(this.category_idx)
      this.form.user_idx = this.$store.state.user.idx
      this.form.reg_ip = this.$store.state.user.access_loc
      this.form.reg_dt = Date.now()
      this.form.upt_ip = this.form.reg_ip
      this.form.upt_dt = this.form.reg_dt
      // 위도 경도 임시 조치
      delete this.form.res_lat
      delete this.form.res_lon
      this.$apollo.mutate({
        mutation: gql`${addGourmetPlace}`,
        variables: { ...this.form }
      }).then(({ data: { addGourmetPlace } }) => {
        if (addGourmetPlace.res_idx) {
          this.flashSuccess('신규 맛집을 등록했습니다.')
          this.$router.push('/gate/manager/boards/gourmet')
        }
      })
    }
  }
}
</script>

<style>

</style>
