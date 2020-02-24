<template>
  <div class="wrapper">
    <header class="underline underline-inline-block underline-animated">
      <strong>신규 게시판 모듈 생성</strong>
    </header>
    <form
      data-post-form
      @submit.prevent
    >
      <div class="input-form">
        <label for="category_nm">모듈명</label>
        <input
          id="name"
          v-model="category_nm"
          type="text"
          name="category_nm"
          placeholder="모듈명을 입력해주세요"
          required
          pattern=".{1,}"
        >
      </div>
      <div class="input-form">
        <label for="inherited">대분류</label>
        <v-select />
      </div>
      <div class="input-form">
        <label for="title">영문명</label>
        <div class="input-form-group">
          <input
            id="title"
            v-model="title"
            type="text"
            name="title"
            placeholder="URL로 들어갈 구분자입니다. (/board/:category[depth0]/:category[depth1]...)"
            required
            :class="{ 'error': titleError }"
          >
          <p
            v-if="titleError"
            class="auto-validate-noti"
            :class="{ 'error': titleError }"
          >
            {{ titleErrorMsg }}
          </p>
        </div>
      </div>
      <div class="input-form">
        <label for="title">특정그룹 접속제한</label>
        <div class="input-form-group" />
      </div>
      <div class="input-form">
        <label for="title">모듈 공개여부</label>
        <div class="input-form-group">
          <b-checkbox
            v-model="private_yn"
            true-value="Y"
            false-value="N"
          >
            {{ private_yn_label }}
          </b-checkbox>
        </div>
      </div>
      <div class="input-form">
        <label for="desc">모듈부가설명</label>
        <div class="input-form-group">
          <input
            id="desc"
            v-model="desc"
            type="text"
            name="desc"
            placeholder="어떤 게시판인지 설명을 작성해주세요."
            required
            :class="{ 'error': descError }"
          >
          <p
            v-if="descError"
            class="auto-validate-noti"
            :class="{ 'error': descError }"
          >
            {{ descErrorMsg }}
          </p>
        </div>
      </div>
      <div class="input-form">
        <label for="icon">아이콘 업로드</label>
        <div class="input-form-group">
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
              :src="icon_src"
              alt="카테고리 대표 이미지"
            >
            <v-gravatar
              v-show="!icon"
              :email="$store.state.user.email"
            />
          </figure>
        </div>
      </div>
      <div class="input-form-controls buttons">
        <b-button
          type="is-primary"
          size="is-small"
          expanded
          @click="createNewModule"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>신규 모듈 생성</span>
        </b-button>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { UploadedCategoryIcon, addCategory } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      title: '',
      titleError: false,
      titleErrorMsg: '',
      desc: '',
      descError: false,
      descErrorMsg: '',
      category_nm: '',
      access_auth: 'ALL',
      depth: 0,
      private_yn: 'N',
      private_yn_label: '공개',
      icon: null,
      icon_src: ''
    }
  },
  watch: {
    private_yn (value) {
      if (value === 'Y') {
        this.private_yn_label = '비공개'
      } else if (value === 'N') {
        this.private_yn_label = '공개'
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
  methods: {
    createNewModule () {
      this.$apollo.mutate({
        mutation: gql`${addCategory}`,
        variables: {
          category_nm: this.category_nm,
          category_type: 'NORMAL',
          title: this.title,
          depth: this.depth,
          access_auth: this.access_auth,
          private_yn: this.private_yn,
          category_icon: this.icon_src,
          desc: this.desc,
          reg_ip: this.$store.state.user.access_loc,
          upt_ip: this.$store.state.user.access_loc,
          reg_dt: Date.now(),
          upt_dt: Date.now()
        }
      }).then(({ data: { addCategory } }) => {
        console.log(addCategory)
      })
    }
  }
}
</script>

<style>

</style>
