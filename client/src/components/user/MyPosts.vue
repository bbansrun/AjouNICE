<template>
  <section class="my my-posts">
    <header class="underline underline-inline-block">
      <strong>나의 게시물</strong>
    </header>
    <div class="posts-list">
      <b-table
        :data="posts"
        :narrowed="true"
        :focusable="true"
        :mobile-cards="false"

        paginated
        :total="posts.length"
        :per-page="perPage"
        aria-next-label="다음 페이지"
        aria-previous-label="이전 페이지"
        aria-page-label="페이지"
        aria-current-label="현재 페이지"
      >
        <template slot-scope="props">
          <b-table-column
            field="title"
            label="제목"
          >
            <router-link :to="`/board/${props.row.board_idx}/view`">
              {{ props.row.title }}
            </router-link>
          </b-table-column>
          <b-table-column
            field="category_idx"
            label="카테고리"
          >
            {{ props.row.category_idx }}
          </b-table-column>
          <b-table-column
            field="view_cnt"
            label="조회"
          >
            {{ props.row.view_cnt | numberWithCommas }}회
          </b-table-column>
          <b-table-column
            field="reg_dt"
            label="작성일"
          >
            {{ props.row.reg_dt | formatDateTime }}
          </b-table-column>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data () { return { perPage: 10 } }
}
</script>
