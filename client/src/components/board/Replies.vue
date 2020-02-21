<template>
  <section class="replies">
    <header class="underline underline-inline-block underline-animated">
      <strong>{{ content.length | numberWithCommas }}개의 댓글이 달렸습니다.</strong>
    </header>
    <form
      class="reply edit"
      autocomplete="off"
      @submit.prevent
    >
      <div class="input-form input-form-reply">
        <input
          id="reply"
          v-model="reply.content"
          type="text"
          name="reply"
          required
          :placeholder="!(reply.mode.edit || reply.mode.replyHierarchical) ? `댓글을 작성하세요.` : `수정하실 댓글을 입력해주세요.`"
          no-validate
          @keyup.enter="!(reply.mode.edit || reply.mode.replyHierarchical) ? makeReply : editReply"
        >
        <b-switch
          v-model="anonymous"
          size="is-small"
        >
          익명
        </b-switch>
        <b-button
          size="is-small"
          :type="{ 'is-primary': !reply.mode.edit, 'is-warning': reply.mode.edit }"
          @click="!(reply.mode.edit || reply.mode.replyHierarchical) ? makeReply() : editReply()"
        >
          <font-awesome-icon icon="pen" />&nbsp;
          <span>{{ reply.mode.edit ? '수정' : '작성' }}</span>
        </b-button>
      </div>
    </form>
    <div class="replies-view">
      <div
        v-show="content.length === 0"
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
        :class="{ 'counterpart': !checkMyReply(comment.commenter.user_idx), 'my': checkMyReply(comment.commenter.user_idx), 'target': parseInt(reply.target) === parseInt(comment.cmt_idx) }"
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
            <button class="reply">
              <font-awesome-icon icon="reply" />&nbsp;
              <span>대댓글</span>
            </button>
            <button
              v-show="checkMyReply(comment.commenter.user_idx)"
              class="edit"
              @click="toggleEditReply(comment.cmt_idx, comment.text)"
            >
              <font-awesome-icon icon="pen" />&nbsp;
              <span>수정</span>
            </button>
            <button
              v-show="checkMyReply(comment.commenter.user_idx)"
              class="remove"
              @click="removeReply(comment.cmt_idx)"
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
import { writeReply, removeReply, editReply } from '@/assets/graphql/mutations'
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
      anonymous: true,
      reply: {
        target: null,
        mode: {
          edit: false,
          replyHierarchical: false
        },
        content: ''
      }
    }
  },
  methods: {
    checkMyReply (id) {
      return parseInt(this.$store.state.user.idx) === parseInt(id)
    },
    makeReply () {
      if (!this.reply.mode.edit && this.reply.content && this.reply.content.length > 0) {
        document.body.classList.add('loading')
        this.$apollo.mutate({
          mutation: gql`${writeReply}`,
          variables: {
            board: parseInt(this.post),
            user: this.$store.state.user.idx,
            nick: this.$store.state.user.nick_nm,
            text: this.reply.content,
            ip: this.$store.state.user.access_loc
            // anonymous: this.anonymous
          }
        }).then(({ data }) => {
          this.reply.content = ''
          this.flashSuccess('댓글을 달았습니다.')
        }).catch(error => {
          console.error(error)
        })
      } else {
        this.flashError('댓글을 입력해주세요.')
      }
    },
    removeReply (id) {
      const self = this
      self.$swal({
        title: '댓글을 삭제하시겠습니까?',
        text: '삭제한 댓글은 복구할 수 없습니다.',
        type: 'question',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        preConfirm () {
          document.body.classList.add('loading')
          self.$apollo.mutate({
            mutation: gql`${removeReply}`,
            variables: {
              id: parseInt(id)
            }
          }).then(({ data }) => {
          }).catch(error => {
            console.error(error)
          })
        }
      }).then((result) => {
        if (result.value) {
          self.flash('댓글을 삭제하였습니다.', 'success')
        }
      })
    },
    editReply () {
      document.body.classList.add('loading')
      this.$apollo.mutate({
        mutation: gql`${editReply}`,
        variables: {
          id: parseInt(this.reply.target),
          text: this.reply.content
        }
      }).then(({ data }) => {
          this.reply.target = null
          this.reply.mode.edit = false
          this.reply.content = ''
          this.flashSuccess('댓글을 수정했습니다.')
      }).catch(error => {
        console.error(error)
      })
    },
    toggleEditReply (id, text) {
      if (this.reply.mode.edit) {
        this.reply.target = null
        this.reply.mode.edit = false
        this.reply.content = ''
      } else {
        this.reply.target = id
        this.reply.mode.edit = true
        this.reply.content = text
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
