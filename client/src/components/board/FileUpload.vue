<template>
  <section>
    <b-field>
      <b-upload
        v-model="dropFiles"
        multiple
        drag-drop
        accept="image/*"
      >
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <font-awesome-icon icon="upload" />
            </p>
            <p>파일을 이곳에 드래그하거나 클릭하여 업로드하세요.<br><small>이미지만 허용됩니다.</small></p>
          </div>
        </section>
      </b-upload>
    </b-field>

    <div class="tags">
      <span
        v-for="(file, index) in dropFiles"
        :key="index"
        class="tag is-primary"
      >
        {{ file.name }}
        <button
          class="delete is-small"
          type="button"
          @click="deleteDropFile(index)"
        />
      </span>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import gql from 'graphql-tag'
import { Field, Upload } from 'buefy'
import { UploadFiles } from '@/assets/graphql/mutations'

Vue.use(Field)
Vue.use(Upload)
export default {
  data () {
    return {
      dropFiles: []
    }
  },
  watch: {
    dropFiles (value) {
      // TEST Push
      this.uploadFiles(value)
    }
  },
  methods: {
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    },
    uploadFiles (file) {
      console.log(file)
      console.log('Will upload ', file[0])
      this.$apollo.mutate({
        mutation: gql`${UploadFiles}`,
        variables: {
          file: file[0]
        }
      }).then(({ data }) => {
        console.log(data)
      })
    }
  }
}
</script>

<style lang="scss">
.upload {
    display: block;
    margin: 1rem 0;
}
</style>
