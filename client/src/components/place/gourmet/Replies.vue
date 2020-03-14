<template>
  <section class="replies">
    <header class="underline underline-inline-block underline-animated">
      <strong>{{ content.length | numberWithCommas }}개의 댓글이 달렸습니다.</strong>
    </header>
    <form
      class="reply"
      autocomplete="off"
      @submit.prevent
    >
      <div class="input-form-group input-form-reply">
        <input
          id="reply"
          v-model="form.options.text"
          type="text"
          name="reply"
          required
          :placeholder="inputMessage"
          no-validate
          @keyup.enter="modReply"
        >
        <b-switch
          v-model="anonymous"
          size="is-small"
        >
          익명
        </b-switch>
        <b-button
          size="is-small"
          :type="{ 'is-primary': mode !== 'EDIT', 'is-warning': mode === 'EDIT' }"
          @click="modReply"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>{{ submitText }}</span>
        </b-button>
      </div>
    </form>
    <div class="replies-view">
      <div
        v-show="!content"
        class="no-replies has-text-centered"
      >
        <h3>아직 댓글이 없어요.</h3>
        <span>이 게시물의 첫번째 댓글 주인공이 되어주시겠어요?</span>
      </div>
      <div
        v-for="comment in content"
        :key="comment.cmt_idx"
        :data-comment-id="comment.cmt_idx"
        class="reply"
        :class="{
          'counterpart': !checkMyReply(comment.commenter.user_idx),
          'my': checkMyReply(comment.commenter.user_idx)
        }"
      >
        <div class="meta">
          <header>{{ comment.commenter.nick_nm }}</header>
          <small class="timestamp">{{ comment.upt_dt | formatDateTime }}</small>
        </div>
        <div class="reply-wrapper">
          <p class="content">
            {{ comment.text }}
          </p>
          <div class="controls">
            <button
              class="reply"
              @click="toggleReply('CHILDREPLY', comment.cmt_idx)"
            >
              <font-awesome-icon icon="reply" />&nbsp;
              <span>{{ mode === 'CHILDREPLY' ? '취소' : '대댓글' }}</span>
            </button>
            <button
              v-show="checkMyReply(comment.commenter.user_idx)"
              class="edit"
              @click="toggleReply('EDIT', comment.cmt_idx, text = comment.text)"
            >
              <font-awesome-icon icon="pen" />&nbsp;
              <span>{{ mode === 'EDIT' ? '취소' : '수정' }}</span>
            </button>
            <button
              v-show="checkMyReply(comment.commenter.user_idx)"
              class="remove"
              @click="toggleReply('DESTROY', comment.cmt_idx)"
            >
              <font-awesome-icon icon="trash" />&nbsp;
              <span>삭제</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { modReply } from '@/assets/graphql/mutations'
export default {
  props: {
    post: {
      type: Number,
      required: true
    },
    content: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      mode: 'CREATE', // CREATE, CHILDREPLY, EDIT
      anonymous: true,
      form: {
        mode: '', // Will be designated when the method triggered
        options: {
          board_idx: parseInt(this.post),
          user_idx: this.$store.state.user.idx,
          text: '',
          ip: this.$store.state.user.access_loc
        }
      },
      validated: false
    }
  },
  computed: {
    inputMessage () {
      if (this.mode === 'CREATE') {
        return '댓글을 입력해주세요.'
      } else if (this.mode === 'EDIT') {
        return '수정할 댓글 메시지를 입력해주세요.'
      } else if (this.mode === 'CHILDREPLY') {
        return '대댓글을 입력해주세요.'
      } else return ''
    },
    submitText () {
      if (this.mode === 'CREATE') {
        return '등록'
      } else if (this.mode === 'EDIT') {
        return '수정'
      } else if (this.mode === 'CHILDREPLY') {
        return '등록'
      } else return ''
    }
  },
  methods: {
    checkExistKeyInForm (key) {
      return Object.prototype.hasOwnProperty.call(this.form.options, key)
    },
    validate () {
      if (this.mode === 'CREATE') {
        const keys = ['board_idx', 'user_idx', 'text', 'ip']
        if (keys.every(item => this.checkExistKeyInForm(item))) {
          this.validated = true
        }
      } else if (this.mode === 'EDIT') {
        const keys = ['cmt_idx', 'user_idx', 'text', 'ip']
        if (keys.every(item => this.checkExistKeyInForm(item))) {
          this.validated = true
        }
      } else if (this.mode === 'CHILDREPLY') {
        const keys = ['cmt_idx', 'user_idx', 'parent_idx', 'text', 'ip']
        if (keys.every(item => this.checkExistKeyInForm(item))) {
          this.validated = true
        }
      }
    },
    checkMyReply (id) {
      return parseInt(this.$store.state.user.idx) === parseInt(id)
    },
    modReply (target = null) {
      if (this.mode === 'CREATE') {
        this.form.mode = 'CREATE'
        this.validate()
        if (this.validated) {
          document.body.classList.add('loading')
          this.$apollo.mutate({
            mutation: gql`${modReply}`,
            variables: { ...this.form }
          }).then(({ data }) => {
            document.body.classList.remove('loading')
            this.form.text = ''
            this.flashSuccess('댓글을 달았습니다.')
          }).catch(error => {
            console.error(error)
          })
        } else {
          this.flashError('댓글을 입력해주세요.')
        }
      } else if (this.mode === 'EDIT') {
        this.form.mode = 'EDIT'
        this.validate()
        if (this.validated) {
          document.body.classList.add('loading')
          this.$apollo.mutate({
            mutation: gql`${modReply}`,
            variables: { ...this.form }
          }).then(({ data }) => {
            this.form.text = ''
            this.flashSuccess('댓글을 수정했습니다.')
          }).catch(error => {
            console.error(error)
          })
        }
      } else if (this.mode === 'CHILDREPLY') {
        this.form.mode = 'CREATE'
        this.form.options.parent_idx = parseInt(target)
        this.validate()
        if (this.validated) {
          document.body.classList.add('loading')
          this.$apollo.mutate({
            mutation: gql`${modReply}`,
            variables: { ...this.form }
          }).then(({ data }) => {
            this.form.text = ''
            this.flashSuccess('대댓글을 달았습니다.')
          }).catch(error => {
            console.error(error)
          })
        }
      }
    },
    toggleReply (mode, target, text = '') {
      if (mode === 'EDIT') {
        if (this.mode === 'EDIT') {
          this.mode = 'CREATE'
          this.form.options.text = ''
        } else {
          this.mode = mode
          this.form.options.cmt_idx = target
          this.form.options.text = text
        }
      } else if (mode === 'CHILDREPLY') {
        this.form.options.text = ''
        if (this.mode === 'CHILDREPLY') {
          this.mode = 'CREATE'
        } else {
          this.mode = mode
          this.form.options.parent_idx = target
        }
      } else if (mode === 'DESTROY') {
        this.form.mode = 'DESTROY'
        this.$buefy.dialog.confirm({
          title: '삭제하시겠습니까?',
          message: '삭제한 댓글은 복구가 불가능합니다.',
          confirmText: '삭제',
          cancelText: '취소',
          type: 'is-danger',
          hasIcon: true,
          icon: 'exclamation-triangle',
          onConfirm: () => {
            document.body.classList.add('loading')
            this.$apollo.mutate({
              mutation: gql`${modReply}`,
              variables: {
                mode: this.form.mode,
                options: {
                  cmt_idx: parseInt(target)
                }
              }
            }).then(({ data: { modReply: { result } } }) => {
              document.body.classList.remove('loading')
              if (result) {
                this.flashSuccess('댓글을 삭제하였습니다.')
              }
            }).catch(error => {
              console.error(error)
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

label.switch {
  padding: 0 .5rem;
}

div.reply {
  position: relative;
  margin: {
    bottom: 1rem;
  }
  background: #363636;
  color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  &.counterpart {
    margin: {
      left: 1rem;
    }
    &::before {
      content: "";
      width: 0px;
      height: 0px;
      position: absolute;
      border: {
        left: 10px solid transparent;
        right: 10px solid #363636;
        top: 10px solid #363636;
        bottom: 10px solid transparent;
      }
      left: -19px;
      top: 6px;
    }
  }
  &.my {
    margin: {
      right: 1rem;
    }
    &::before {
      content: "";
      width: 0px;
      height: 0px;
      position: absolute;
      border: {
        left: 10px solid #363636;
        right: 10px solid transparent;
        top: 10px solid #363636;
        bottom: 10px solid transparent;
      }
      right: -19px;
      top: 6px;
    }
  }
  &.target {
    font: {
      weight: bolder;
    }
    background: rgba(255, 46, 99, .5);
    &.my {
      &::before {
        border: {
          left: 10px solid rgba(255, 46, 99, .5);
          top: 10px solid rgba(255, 46, 99, .5);
          right: 10px solid transparent;
          bottom: 10px solid transparent;
        }
      }
    }
  }
  > .meta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: .4rem;
    > header {
      font: {
        size: .6rem;
      }
    }
    > .timestamp {
      font: {
        size: .5rem;
      }
      white-space: nowrap;
    }
  }
  > .reply-wrapper {
    > .content {
      margin-bottom: unset;
      padding: .4rem;
      font: {
        size: 1rem;
        weight: 500;
      }
      min-height: 4rem;
    }
    > .controls {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      & button {
        font: {
          size: .8rem;
        }
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        padding: .4rem;
        color: #fff;
        &:hover {
          cursor: pointer;
        }
        &.reply {
          background: #00A8CC;
        }
        &.edit {
          background: #ffdd57;
          color: #000;
        }
        &.remove {
          background: #FF2E63;
        }
      }
    }
  }
}

.input-form-reply {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>

<style>
.no-replies {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 30vh;
}
</style>
