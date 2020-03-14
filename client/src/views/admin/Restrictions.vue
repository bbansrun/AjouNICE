<template>
  <section class="status reviews">
    <header class="underline underline-inline-block underline-animated">
      <strong>차단 정책 관리</strong>
    </header>
    <hr>
    <div class="area">
      <h4>일반 게시판</h4>
      <b-table
        :data="data.reports"
        :mobile-cards="false"
        :loading="loading.reports"
      >
        <template slot-scope="props">
          <b-table-column
            field="report_idx"
            label="ID"
            numeric
            sortable
          >
            <strong>{{ props.row.report_idx }}</strong>
          </b-table-column>

          <b-table-column
            field="type"
            label="타입"
          >
            <strong>일반</strong>
          </b-table-column>

          <b-table-column
            field="post.title"
            label="게시물"
          >
            <router-link :to="`/board/${props.row.post.board_idx}/view`">
              {{ props.row.post.title }}
            </router-link>
          </b-table-column>

          <b-table-column
            field="user.user_nm"
            label="신고자"
          >
            {{ props.row.user.user_nm }}
          </b-table-column>

          <b-table-column
            field="text"
            label="신고사유"
          >
            {{ props.row.text }}
          </b-table-column>

          <b-table-column
            field="reg_dt"
            label="등록일"
          >
            {{ props.row.reg_dt | formatDateTime }}
          </b-table-column>

          <b-table-column
            field="settings"
            label="조작"
          >
            <div class="buttons">
              <b-dropdown
                hoverable
                aria-role="list"
              >
                <b-button
                  slot="trigger"
                  type="is-warning"
                  size="is-small"
                >
                  <font-awesome-icon icon="user-cog" />&nbsp;
                  <span>수정</span>
                </b-button>
                <b-dropdown-item aria-role="listitem">
                  영구정지
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem">
                  탈퇴복원
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem">
                  일시잠금
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem">
                  계정복원(암호 초기화)
                </b-dropdown-item>
              </b-dropdown>&nbsp;
              <b-button
                type="is-danger"
                size="is-small"
              >
                <font-awesome-icon icon="times" />&nbsp;
                <span>삭제</span>
              </b-button>
            </div>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div class="area">
      <h4>맛집 게시판</h4>
      <b-table
        :data="data.resReports"
        :mobile-cards="false"
        :loading="loading.resReports"
      >
        <template slot-scope="props">
          <b-table-column
            field="report_idx"
            label="ID"
            numeric
            sortable
          >
            <strong>{{ props.row.report_idx }}</strong>
          </b-table-column>

          <b-table-column
            field="type"
            label="타입"
          >
            <strong>맛집</strong>
          </b-table-column>

          <b-table-column
            field="resource.res_nm"
            label="게시물"
          >
            <router-link :to="`/board/${props.row.resource.res_idx}/view`">
              {{ props.row.resource.res_nm }}
            </router-link>
          </b-table-column>

          <b-table-column
            field="user.user_nm"
            label="신고자"
          >
            {{ props.row.user.user_nm }}
          </b-table-column>

          <b-table-column
            field="text"
            label="신고사유"
          >
            {{ props.row.text }}
          </b-table-column>

          <b-table-column
            field="reg_dt"
            label="등록일"
          >
            {{ props.row.reg_dt | formatDateTime }}
          </b-table-column>

          <b-table-column
            field="settings"
            label="조작"
          >
            <div class="buttons">
              <b-dropdown
                hoverable
                aria-role="list"
              >
                <b-button
                  slot="trigger"
                  type="is-warning"
                  size="is-small"
                >
                  <font-awesome-icon icon="user-cog" />&nbsp;
                  <span>수정</span>
                </b-button>
                <b-dropdown-item aria-role="listitem">
                  영구정지
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem">
                  탈퇴복원
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem">
                  일시잠금
                </b-dropdown-item>
                <b-dropdown-item aria-role="listitem">
                  계정복원(암호 초기화)
                </b-dropdown-item>
              </b-dropdown>&nbsp;
              <b-button
                type="is-danger"
                size="is-small"
              >
                <font-awesome-icon icon="times" />&nbsp;
                <span>삭제</span>
              </b-button>
            </div>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { Reports } from '@/assets/graphql/queries'
export default {
  data () {
    return {
      loading: {
        reports: true,
        resReports: true
      },
      data: {
        reports: [],
        resReports: []
      }
    }
  },
  apollo: {
    data: {
      query: gql`${Reports}`,
      result ({ data }) {
        this.data.reports = data.reports
        this.data.resReports = data.resReports
      }
    }
  },
  watch: {
    'data.reports' (value) {
      if (value) {
        this.loading.reports = false
      }
    },
    'data.resReports' (value) {
      if (value) {
        this.loading.resReports = false
      }
    }
  }
}
</script>

<style>

</style>
