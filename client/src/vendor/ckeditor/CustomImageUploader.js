//
// CKEditor Custom Image Upload Adapter applied to Amazon S3
//
// 2020. 02. Created by J.W.Jeon
// http://github.com/this-is-g1
// Team bbansrun. AjouNICE! - Community Service for Ajou University
//

import Vue from 'vue'
import gql from 'graphql-tag'
import { singleUpload } from '@/assets/graphql/mutations'

class ImageUploadToS3Adapter {
  constructor (loader) {
    this.loader = loader
  }

  upload () {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        Vue.prototype.$Apollo.mutate({
          mutation: gql`${singleUpload}`,
          variables: {
            uploadType: 'EDITOR_ATTACHMENTS',
            file,
            options: {
              EDITOR_ATTACHMENTS: {
                category: 'TEST'
              }
            }
          }
        }).then(({ data: { singleUpload } }) => {
          resolve({ default: singleUpload })
        }).catch(error => {
          console.error(error)
          reject(error)
        })
      }))
  }
}

const ImageUploadToS3AdapterPlugin = (editor) => {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new ImageUploadToS3Adapter(loader)
  }
}

export {
  ImageUploadToS3AdapterPlugin
}
