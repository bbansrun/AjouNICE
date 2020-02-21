<template>
    <div class="wrapper">
        <header class="underline underline-inline-block underline-animated">
            <strong>맛집 신규 모듈 생성</strong>
        </header>
        <form
            data-post-form
            @submit.prevent
        >
            <div class="input-form">
                <label for="category_nm">모듈명</label>
                <input
                    id="name"
                    v-model="category_nm"
                    type="text"
                    name="category_nm"
                    placeholder="모듈명을 입력해주세요"
                    required
                    pattern=".{1,}"
                >
            </div>
            <div class="input-form">
                <label for="title">영문명</label>
                <div class="input-form-group">
                <input
                    id="title"
                    v-model="title"
                    type="text"
                    name="title"
                    placeholder="URL로 들어갈 구분자입니다. (/place/gourmet/:category)"
                    required
                    :class="{ 'error': titleError }"
                >
                <p
                    v-if="titleError"
                    class="auto-validate-noti"
                    :class="{ 'error': titleError }"
                >
                    {{ titleErrorMsg }}
                </p>
                </div>
            </div>
            <div class="input-form-controls buttons">
                <b-button
                    type="is-primary"
                    size="is-small"
                    expanded
                    @click="createNewModule"
                >
                    <font-awesome-icon icon="pen" />&nbsp;
                    <span>신규 모듈 생성</span>
                </b-button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            titleError: false,
            titleErrorMsg: '',
            category_nm: '',
        }
    },
    methods: {
        createNewModule () {

        }
    }
}
</script>

<style>

</style>