<template>
  <section class="codes">
    <header class="underline underline-inline-block underline-animated">
      <strong>학부/학과 코드관리</strong>
    </header>
    <div class="buttons">
      <b-button
        type="is-primary"
        size="is-small"
        tag="router-link"
        to="/gate/manager/codes/new"
      >
        <font-awesome-icon icon="pen" />&nbsp;
        <span>신규 코드 등록</span>
      </b-button>
    </div>
    <hr>
    <b-table
      :data="data"
      :loading="loading"
      :mobile-cards="false"
    >
      <template slot-scope="props">
        <b-table-column
          field="type"
          label="구분"
          sortable
          searchable
        >
          {{ props.row.type }}
        </b-table-column>

        <b-table-column
          field="code"
          label="코드"
          sortable
          searchable
        >
          {{ props.row.code }}
        </b-table-column>

        <b-table-column
          field="value"
          label="값"
          sortable
          searchable
        >
          <strong>{{ props.row.value }}</strong>
        </b-table-column>

        <b-table-column
          field="link"
          label="공지사항 링크"
          sortable
        >
          {{ props.row.link }}
        </b-table-column>

        <b-table-column
          field="settings"
          label="설정"
        >
          <div class="buttons">
            <b-button
              type="is-light"
              size="is-small"
              tag="router-link"
              :to="`/gate/manager/codes/edit/${props.row.id}`"
            >
              <font-awesome-icon icon="pen" />&nbsp;
              <span>수정</span>
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              @click="removeItem(props.row.id, props.row.uid)"
            >
              <font-awesome-icon icon="trash" />&nbsp;
              <span>삭제</span>
            </b-button>
          </div>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import { Codes } from '@/assets/graphql/queries'
import { modCollege, modDepartment } from '@/assets/graphql/mutations'
export default {
  data () {
    return {
      data: [],
      loading: true
    }
  },
  apollo: {
    data: {
      query: gql`${Codes}`,
      update: ({ allColleges, departments }) => {
        const data = []
        allColleges.forEach(item => {
          data.push({ uid: item.id, id: btoa(`college|${item.college_cd}`), type: '학부', code: item.college_cd, value: item.college_nm, reg_dt: item.reg_dt, upt_dt: item.upt_dt, link: item.link.link_url })
        })
        departments.forEach(item => {
          data.push({ uid: item.id, id: btoa(`dpt|${item.dpt_cd}`), type: '학과', code: item.dpt_cd, value: item.dpt_nm, reg_dt: item.reg_dt, upt_dt: item.upt_dt, link: item.link.link_url })
        })
        return data
      },
      fetchPolicy: 'network-only'
    }
  },
  watch: {
    data (value) {
      if (value) {
        this.loading = false
      }
    }
  },
  methods: {
    removeItem (itemId, id) {
      this.$buefy.dialog.prompt({
        title: '코드 데이터 삭제',
        message: '삭제하시겠습니까?<br><strong>이 데이터 삭제는 서비스의 모든 사용자에게<br>중대한 영향을 미칠 수 있습니다.</strong><br>신중히 선택해주시기 바랍니다.<br>계속 진행하시려면 <strong>확인</strong>을 입력해주세요.',
        inputAttrs: {
          placeholder: '\'확인\'을 입력해주세요.',
          maxlength: 2
        },
        confirmText: '삭제',
        cancelText: '취소',
        type: 'is-danger',
        hasIcon: true,
        icon: 'exclamation-triangle',
        trapFocus: true,
        onConfirm: (value) => {
          if (value === '확인') {
            document.body.classList.add('loading')
            const type = atob(itemId).split('|')[0]
            const variables = {
              mode: 'DESTROY',
              options: {
                id
              }
            }
            if (type === 'college') {
              this.$apollo.mutate({
                mutation: gql`${modCollege}`,
                variables
              }).then(({ data: { modCollege } }) => {
                if (modCollege) {
                  document.body.classList.remove('loading')
                  this.data = _.filter(this.data, item => item.id !== itemId)
                  this.$buefy.toast.open('삭제하였습니다.')
                  this.$router.go(0)
                }
              }).catch(error => {
                console.error(error)
                document.body.classList.remove('loading')
                this.$buefy.toast.open('알 수 없는 오류로 삭제하지 못했습니다.')
              })
            } else if (type === 'dpt') {
              this.$apollo.mutate({
                mutation: gql`${modDepartment}`,
                variables
              }).then(({ data: { modDepartment } }) => {
                if (modDepartment) {
                  document.body.classList.remove('loading')
                  this.data = _.filter(this.data, item => item.id !== itemId)
                  this.$buefy.toast.open('삭제하였습니다.')
                }
              }).catch(error => {
                console.error(error)
                document.body.classList.remove('loading')
                this.$buefy.toast.open('알 수 없는 오류로 삭제하지 못했습니다.')
              })
            }
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
