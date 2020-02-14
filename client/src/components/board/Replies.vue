<template>
  <section class="replies">
    <article>
      <header class="underline underline-inline-block underline-animated">
        <strong>{{ content.length }}개의 댓글이 달렸습니다.</strong>
      </header>
    </article>
    <form
      class="reply edit"
      autocomplete="off"
      @submit.prevent
    >
      <div class="input-form input-form-reply">
        <font-awesome-icon
          v-show="reply.mode.edit"
          icon="pen"
        />
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
          @click="makeReply"
        >
          작성
        </b-button>
      </div>
    </form>
    <div class="replies-view">
      <div
        v-for="reply in content"
        :key="reply.cmt_idx"
        class="card reply"
      >
        <div class="meta">
          <header>{{ reply.nick_nm }}</header>
          <small>{{ new Date(reply.upt_dt).toLocaleDateString() }}</small>
        </div>
        <p class="content">
          {{ reply.text }}
        </p>
        <div class="controls">
          <button class="reply">
            <font-awesome-icon icon="reply" />
          </button>
          <button
            v-show="$store.state.user.idx === reply.user_idx"
            class="edit"
            @click="toggleEditReply(reply.cmt_idx, reply.text)"
          >
            <font-awesome-icon icon="pen" />
          </button>
          <button
            v-show="$store.state.user.idx === reply.user_idx"
            class="remove"
            @click="removeReply(reply.cmt_idx)"
          >
            <font-awesome-icon icon="trash" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'
import { Switch } from 'buefy'
import { replyWritten, replyRemoved } from '@/assets/graphql/subscriptions'
import { writeReply, removeReply } from '@/assets/graphql/mutations'

Vue.use(Switch)
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
        that.reply = ''
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
        })
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
article {
  padding: unset !important;
  > header {
    font: {
      size: 1rem;
    }
  }
}

div.reply {
  display: grid;
  grid-template-columns: 1fr 7fr 2fr;
  margin-bottom: 1rem;
  > .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: .4rem;
    > header {
      font: {
        size: .8rem;
      }
    }
  }
  > .content {
    display: flex;
    align-items: center;
    margin-bottom: unset;
    padding: .4rem;
    font: {
      size: .8rem;
    }
  }
  > .controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    & button {
      font: {
        size: .8rem;
      }
      border: none;
      outline: none;
      width: 100%;
      height: 100%;
      color: #fff;
      &.reply {
        background: blue;
      }
      &.edit {
        background: orange;
      }
      &.remove {
        background: red;
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

.switch {
  > .control-label {
    white-space: nowrap !important;
  }
}
</style>
