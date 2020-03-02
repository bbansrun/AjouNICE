<template>
  <section class="users">
    <header class="underline underline-inline-block underline-animated">
      <strong>사용자 현황 및 관리</strong>
    </header>
    <hr>
    <b-table
      :data="users"
      :mobile-cards="false"
      :loading="loading"
    >
      <template slot-scope="props">
        <b-table-column
          field="user_idx"
          label="ID"
          width="5"
          numeric
          sortable
        >
          {{ props.row.user_idx }}
        </b-table-column>

        <b-table-column
          field="user_nm"
          label="이름"
          sortable
        >
          <strong>{{ props.row.user_nm }}</strong>
        </b-table-column>

        <b-table-column
          field="nick_nm"
          label="닉네임"
          sortable
        >
          {{ props.row.nick_nm }}
        </b-table-column>

        <b-table-column
          label="설정"
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
              @click="removeUser(props.row.user_idx)"
            >
              <font-awesome-icon icon="times" />&nbsp;
              <span>삭제</span>
            </b-button>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import { Users } from '@/assets/graphql/queries'
export default {
  data () {
    return {
      loading: true
    }
  },
  apollo: {
    users: {
      query: gql`${Users}`,
      fetchPolicy: 'network-only'
    }
  },
  watch: {
    users (value) {
      if (value) {
        this.loading = false
      }
    }
  },
  methods: {
    removeUser (user) {
      this.$buefy.dialog.prompt({
        title: '경고',
        message: '사용자 처리는 <strong>상태값 변경을 권장</strong>합니다.<br>가급적 삭제를 지양해주시기 바랍니다.<br>그럼에도 불구하고 계속해서 진행을 원하시면, <br><strong>확인</strong>을 입력해주시기 바랍니다.<br><small>(사용자 삭제에 대한 위험성을 인지하고 확인하였습니다.)</small>',
        inputAttrs: {
          placeholder: '\'확인\'을 입력해주세요.',
          maxlength: 2
        },
        confirmText: '진행',
        cancelText: '취소',
        trapFocus: true,
        icon: 'exclamation-triangle',
        hasIcon: true,
        type: 'is-danger',
        onConfirm: (value) => {
          if (value === '확인') {
            this.$buefy.toast.open('사용자 데이터 삭제를 진행합니다.')
          } else {
            this.$buefy.toast.open('입력값 오류. 취소되었습니다.')
          }
        },
        onCancel: () => this.$buefy.toast.open('취소되었습니다.')
      })
    }
  }
}
</script>

<style>

</style>
