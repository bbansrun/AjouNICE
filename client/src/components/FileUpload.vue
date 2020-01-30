<template>
    <section>
        <b-field>
            <b-upload v-model="dropFiles"
                multiple
                drag-drop
                accept="jpg,png"
                >
                <section class="section">
                    <div class="content has-text-centered">
                        <p>
                            <font-awesome-icon icon="upload" />
                        </p>
                        <p>파일을 이곳에 드래그하거나 클릭하여 업로드하세요</p>
                    </div>
                </section>
            </b-upload>
        </b-field>

        <div class="tags">
            <span v-for="(file, index) in dropFiles"
                :key="index"
                class="tag is-primary" >
                {{file.name}}
                <button class="delete is-small"
                    type="button"
                    @click="deleteDropFile(index)">
                </button>
            </span>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import { Upload } from 'buefy'

Vue.use(Upload)
export default {
  data () {
    return {
      dropFiles: []
    }
  },
  methods: {
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
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