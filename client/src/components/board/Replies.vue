<template>
  <section class="replies">
    <article>
      <header class="underline underline-inline-block underline-animated">
        <strong>{{ content.length | numberWithCommas }}개의 댓글이 달렸습니다.</strong>
      </header>
    </article>
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
          @click="makeReply"
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
        v-for="reply in content"
        :key="reply.cmt_idx"
        class="reply"
        :class="{ 'counterpart': !checkMyReply(reply.commenter.user_idx), 'my': checkMyReply(reply.commenter.user_idx) }"
      >
        <div class="meta">
          <header>{{ reply.commenter.nick_nm }}</header>
          <small class="timestamp">{{ reply.upt_dt | formatDateTime }}</small>
        </div>
        <div class="reply-wrapper">
          <p class="content">
            {{ reply.text }}
          </p>
          <div class="controls">
            <button class="reply">
              <font-awesome-icon icon="reply" />&nbsp;
              <span>대댓글</span>
            </button>
            <button
              v-show="checkMyReply(reply.commenter.user_idx)"
              class="edit"
              @click="toggleEditReply(reply.cmt_idx, reply.text)"
            >
              <font-awesome-icon icon="pen" />&nbsp;
              <span>수정</span>
            </button>
            <button
              v-show="checkMyReply(reply.commenter.user_idx)"
              class="remove"
              @click="removeReply(reply.cmt_idx)"
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
import { replyWritten, replyRemoved } from '@/assets/graphql/subscriptions'
import { writeReply, removeReply } from '@/assets/graphql/mutations'
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
        mode: {
          edit: false,
          replyHierarchical: false
        },
        content: ''
      }
    }
  },
  mounted () {
    const that = this
    const writtenObserver = this.$apollo.subscribe({
      query: gql`${replyWritten}`
    })
    const removedObserver = this.$apollo.subscribe({
      query: gql`${replyRemoved}`
    })

    writtenObserver.subscribe({
      next ({ data }) {
        console.log(data.replyWritten)
        that.flash('댓글을 달았습니다.', 'success')
        that.content.unshift(data.replyWritten)
        that.content = ''
        // document.body.classList.toggle('loading')
      },
      error (error) {
        console.error(error)
      }
    })

    removedObserver.subscribe({
      next ({ data }) {
        that.flash('댓글을 삭제하였습니다.', 'success')
        that.content.pop()
        // document.body.classList.toggle('loading')
      },
      error (error) {
        console.error(error)
      }
    })
  },
  methods: {
    checkMyReply (id) {
      return parseInt(this.$store.state.user.idx) === parseInt(id)
    },
    makeReply () {
      if (this.reply.content && this.reply.content.length > 0) {
        this.$apollo.mutate({
          mutation: gql`${writeReply}`,
          variables: {
            board: parseInt(this.post),
            user: this.$store.state.user.idx,
            nick: this.$store.state.user.nick_nm,
            text: this.reply.content,
            ip: this.$store.state.user.access_loc
          }
        }).then(({ data }) => {
          // document.body.classList.toggle('loading')
          this.reply.content = ''
        }).catch(error => {
          console.error(error)
        })
      } else {
        this.flash('댓글을 입력해주세요.', 'error')
      }
    },
    removeReply (id) {
      this.$swal({
        title: '댓글을 삭제하시겠습니까?',
        text: '삭제한 댓글은 복구할 수 없습니다.',
        width: '90vw',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then((result) => {
        if (result.value) {
          this.$apollo.mutate({
            mutation: gql`${removeReply}`,
            variables: {
              id: parseInt(id)
            }
          }).then(({ data }) => {
            // document.body.classList.toggle('loading')
          })
        }
      })
    },
    editReply (id, text) {

    },
    toggleEditReply (id, text) {
      if (this.reply.mode.edit) {
        this.reply.mode.edit = false
        this.reply.content = ''
      } else {
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
      border-left: 10px solid transparent;
      border-right: 10px solid #363636;
      border-top: 10px solid #363636;
      border-bottom: 10px solid transparent;
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
      border-left: 10px solid #363636;
      border-right: 10px solid transparent;
      border-top: 10px solid #363636;
      border-bottom: 10px solid transparent;
      right: -19px;
      top: 6px;
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
