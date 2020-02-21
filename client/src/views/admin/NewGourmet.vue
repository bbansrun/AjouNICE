<template>
    <form
        data-post-form
        @submit.prevent
        >
        <div class="input-form">
            <label for="name">이름</label>
            <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            placeholder="이름을 입력해주세요"
            required
            pattern=".{1,}"
            >
        </div>
        <div class="input-form">
            <label for="email">이메일</label>
            <div class="input-form-group">
            <input
                id="email"
                v-model="email"
                type="email"
                name="email"
                placeholder="이메일 주소를 입력해주세요"
                required
                :class="{ 'error': emailError }"
            >
            <p
                v-if="emailError"
                class="auto-validate-noti"
                :class="{ 'error': emailError }"
            >
                {{ emailErrorMsg }}
            </p>
            </div>
        </div>
        <div class="input-form editor">
            <label for="textarea">내용</label>
            <div class="input-form-group">
            <ckeditor
                v-model="editorData"
                name="textarea"
                :editor="editor"
                :config="editorConfig"
            />
            <p
                v-if="editorError"
                class="auto-validate-noti"
                :class="{ 'error': editorError }"
            >
                {{ editorErrorMsg }}
            </p>
            </div>
        </div>
        <div class="input-form-controls buttons">
            <b-button
            type="is-primary"
            @click="contact"
            >
            <font-awesome-icon icon="envelope-open-text" />&nbsp;
            <span>이메일 발송</span>
            </b-button>
        </div>
    </form>
</template>

<script>
export default {

}
</script>

<style>

</style>