<template>
  <div class="wrapper">
    <Navigation is-static />
    <main>
      <div class="wrapper container">
        <header class="underline underline-inline-block underline-animated">
          <strong>게시물 작성</strong>
        </header>
        <form
          data-post-form
          autocomplete="off"
          @submit.prevent
        >
          <div class="input-form-group">
            <label for="category">게시판명</label>
            <div class="input-form-wrapper">
              <v-select
                v-model="selectedCategory"
                :value="selectedCategory"
                :options="categories"
                :reduce="options => options.category_idx"
                label="category_nm"
                placeholder="게시판 분류 선택"
                :class="{'error': !selectedCategory && validation.options.category_idx === false}"
                @input="getCateDepth1()"
              />
              <v-select
                v-if="sub_categories"
                v-model="selectedSubCategory"
                :value="selectedSubCategory"
                :options="sub_categories"
                :reduce="options => options.category_idx"
                label="category_nm"
                placeholder="게시판 하위 분류 선택"
                :disabled="depth1Deactivated"
                :class="{'error': selectedCategory && validation.options.category_idx === false}"
              >
                <template v-slot:no-options>
                  <font-awesome-icon icon="times" />&nbsp;
                  <span>일치하는 옵션이 없어요.</span>
                </template>
              </v-select>
              <p
                v-show="validation.options.category_idx === false"
                class="auto-validate-noti"
                :class="{'error': validation.options.category_idx === false}"
              >
                분류가 선택되지 않았습니다.
              </p>
            </div>
          </div>
          <div class="input-form-group">
            <label for="title">제목</label>
            <div class="input-form-wrapper">
              <input
                id="title"
                v-model="form.options.title"
                type="text"
                name="title"
                placeholder="제목을 입력하세요"
                required
                :class="{'error': validation.options.title === false}"
              >
              <p
                v-show="validation.options.title === false"
                class="auto-validate-noti"
                :class="{'error': validation.options.title === false}"
              >
                제목을 입력하지 않았습니다.
              </p>
            </div>
          </div>
          <div class="input-form-group">
            <label for="textarea">내용</label>
            <div class="input-form-wrapper">
              <ckeditor
                v-model="form.options.body"
                :editor="editor"
                :config="editorConfig"
                name="textarea"
              />
              <p
                v-show="validation.options.body === false"
                class="auto-validate-noti"
                :class="{'error': validation.options.body === false}"
              >
                내용이 입력되지 않았습니다.
              </p>
            </div>
          </div>
          <div class="input-form-controls buttons">
            <b-button
              size="is-small"
              type="is-primary"
              @click="writePost()"
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
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { Navigation, Footer } from '@/components'
import { SubCates, AllCates } from '@/assets/graphql/queries'
import { modPost } from '@/assets/graphql/mutations'
import { ClassicEditor, editorConfig } from '@/vendor/ckeditor'
export default {
  components: {
    Navigation,
    Footer
  },
  data () {
    return {
      depth1Deactivated: true,
      scrollBase: null,
      selectedCategory: '',
      selectedSubCategory: '',
      category: '',
      sub_category: '',
      sub_categories: [],
      editor: ClassicEditor,
      editorConfig,
      form: {
        mode: 'CREATE',
        options: {
          category_idx: '',
          user_idx: this.$store.state.user.idx,
          title: '',
          body: '<p></p>',
          ip: this.$store.state.user.access_loc
        }
      },
      validation: {
        options: {
          category_idx: null,
          title: null,
          body: null
        }
      },
      validated: false
    }
  },
  watch: {
    depth1Deactivated (value) {
      if (value) {
        if (this.selectedCategory) {
          this.form.options.category_idx = parseInt(this.selectedCategory)
          this.validation.options.category_idx = true
        }
      } else {
        if (this.selectedCategory) {
          this.form.options.category_idx = null
          this.validation.options.category_idx = false
        }
      }
    },
    selectedCategory (value) {
      if (this.depth1Deactivated) {
        this.form.options.category_idx = parseInt(value)
        this.validation.options.category_idx = true
      }
    },
    selectedSubCategory (value) {
      this.form.options.category_idx = parseInt(value)
      this.validation.options.category_idx = true
    },
    'form.options.title' (value) {
      if (value) {
        this.validation.options.title = true
      }
    },
    'form.options.body' (value) {
      this.validateInput('body', { value: ['<p></p>', ''], checkIsCorrect: false })
    }
  },
  apollo: {
    categories: {
      query: gql`${AllCates},`,
      variables: {
        depth: 0,
        category_type: 'NORMAL'
      },
      update: data => data.boards
    }
  },
  methods: {
    validateInput (key, compare = null) {
      // Form Data가 적절한 조건 만족하였는지 판단
      // compare의 경우 object type data를 받을 경우,
      // 비교값인 value와 일치/불일치 비교 여부 checkIsCorrect (Boolean)를 전달하여야함
      if (compare) {
        if (Object.prototype.hasOwnProperty.call(compare, 'value') &&
            Object.prototype.hasOwnProperty.call(compare, 'checkIsCorrect')) {
          if (compare.checkIsCorrect) {
            if (compare.value instanceof Array) {
              this.validation.options[key] = compare.value.every(item => this.form.options[key] === item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          } else {
            if (compare.value instanceof Array) {
              this.validation.options[key] = compare.value.every(item => this.form.options[key] !== item)
            } else {
              throw Error('compare.value는 Array이어야 합니다.')
            }
          }
        } else {
          throw Error('파라미터 compare 값이 유효하지 않습니다.')
        }
      } else {
        if (this.form.options[key]) {
          this.validation.options[key] = true
        } else {
          this.validation.options[key] = false
        }
      }
    },
    validate () {
      this.validateInput('category_idx')
      this.validateInput('title')
      this.validateInput('body', { value: ['<p></p>', ''], checkIsCorrect: false })
      this.validated = Object.keys(this.validation.options).every((key) => this.validation.options[key])
    },
    writePost () {
      this.validate()
      if (this.validated) {
        document.body.classList.add('loading')
        this.$apollo.mutate({
          mutation: gql`${modPost}`,
          variables: { ...this.form }
        }).then(({ data: { modPost: { result, data } } }) => {
          document.body.classList.remove('loading')
          this.flashSuccess('게시되었습니다.')
          this.$router.push(`/board/${data.board_idx}/view`)
        })
      } else {
        this.$buefy.dialog.alert({
          title: '에러',
          message: '<span>작성하지 않은 항목이 있습니다.</span><br><small>누락된 부분을 확인 후 다시 시도해주시기 바랍니다.</small>',
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          ariaRole: 'alertdialog',
          ariaModal: true,
          confirmText: '확인'
        })
      }
    },
    // 대분류 하위 카테고리 로드
    getCateDepth1 () {
      this.sub_categories = []
      this.selectedSubCategory = ''
      this.$apollo.query({
        query: gql`${SubCates}`,
        variables: {
          depth: 1,
          parent: parseInt(this.selectedCategory)
        }
      }).then(({ data: { boards } }) => {
        this.sub_categories = boards
        if (boards.length > 0) {
          this.depth1Deactivated = false
        } else {
          this.depth1Deactivated = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-select {
    margin-bottom: 5px;
}
</style>
