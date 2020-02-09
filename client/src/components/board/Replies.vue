<template>
  <section class="replies">
    <article>
      <header class="underline underline-inline-block">
        <h3>{{ content.length }}개의 댓글이 달렸습니다.</h3>
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
          placeholder="댓글을 작성하세요."
          no-validate
        >
        <button @click="makeReply">
          작성
        </button>
      </div>
      <div class="replies-view">
        <div
          v-for="reply in content"
          :key="reply.cmt_idx"
          class="card reply"
        >
          <div class="content">
            <header>{{ reply.nick_nm }}</header>
            <p>{{ reply.text }}</p>
            <small>{{ new Date(reply.upt_dt).toLocaleDateString() }}</small>
          </div>
          <div class="controls">
            <button
              v-show="reply.user_idx === $store.state.user.idx"
              @click="removeReply(reply.cmt_idx)"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import gql from 'graphql-tag'
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
  methods: {
    makeReply () {
      this.$apollo.mutate({
        mutation: gql`${writeReply}`,
        variables: {
          board: parseInt(this.post),
          user: this.$store.state.user.idx,
          nick: this.$store.state.user.nick_nm,
          text: this.reply
        }
      }).then(({ data }) => {
        document.body.classList.toggle('loading')
        this.flash('댓글을 달았습니다.', 'success')
        location.reload()
      })
    },
    removeReply (id) {
      this.$apollo.mutate({
        mutation: gql`${removeReply}`,
        variables: {
          id: parseInt(id)
        }
      }).then(({ data }) => {
        document.body.classList.toggle('loading')
        this.flash('댓글을 삭제하였습니다.', 'success')
        location.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
form.reply {
  padding: 0 2rem;
}

div.reply {
  display: grid;
  grid-template-columns: 9fr 1fr;
  padding: 1rem;
  margin-bottom: 1rem;
}

.input-form-reply {
  display: grid;
  grid-template-columns: 9fr 1fr;
  margin-bottom: 1rem;
}
</style>
