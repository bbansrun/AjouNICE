<template>
  <section class="replies">
    <article>
      <header class="underline underline-inline-block">
        {{ content.length }}개의 댓글이 달렸습니다.
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
          v-model="reply"
          type="text"
          name="reply"
          required
          placeholder="댓글을 작성하세요."
          no-validate
          @keyup.enter="makeReply"
        >
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
        <div
          v-show="$store.state.user.idx === reply.user_idx"
          class="controls"
        >
          <button
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
      reply: ''
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
      if (this.reply && this.reply.length > 0) {
        this.$apollo.mutate({
          mutation: gql`${writeReply}`,
          variables: {
            board: parseInt(this.post),
            user: this.$store.state.user.idx,
            nick: this.$store.state.user.nick_nm,
            text: this.reply,
            ip: this.$store.state.user.access_loc
          }
        }).then(({ data }) => {
          // document.body.classList.toggle('loading')
        })
      }
    },
    removeReply (id) {
      this.$apollo.mutate({
        mutation: gql`${removeReply}`,
        variables: {
          id: parseInt(id)
        }
      }).then(({ data }) => {
        // document.body.classList.toggle('loading')
      })
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
  grid-template-columns: 1fr 8fr 1fr;
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
    & button {
      font: {
        size: .8rem;
      }
      border: none;
      outline: none;
      width: 100%;
      height: 100%;
      background: red;
      color: #fff;
    }
  }
}

.input-form-reply {
  display: grid;
  grid-template-columns: 9fr 1fr;
  margin-bottom: 1rem;
}
</style>
