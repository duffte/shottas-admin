<template>
  <div>
    <BaseHero 
      :title="'Add New '+ $route.params.id" 
      subtitle="based on defaults"/>
    <section class="section has-background-light">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h2 class="title">Add {{ $route.params.id }}</h2>
            <b-field label="Permalink/id">
              <b-input 
                v-model="document.id" 
                type="text" 
                placeholder="e.g. this-is-a-permalink"/>
            </b-field>
            <b-field 
              v-for="(item, index) in data" 
              :label="item.name" 
              :key="index">
              <!-- Text-->
              <b-field v-if="item.type == 'text'">
                <b-input v-model="document[item.name]"/>
              </b-field>
              <!-- number-->
              <b-field v-if="item.type == 'number'">
                <b-input 
                  v-model="document[item.name]" 
                  type="number"/>
              </b-field>
              <!-- Textarea-->
              <b-field v-if="item.type == 'textarea'">
                <b-input 
                  v-model="document[item.name]" 
                  type="textarea"/>
              </b-field>
              <!-- Topics -->
              <b-field v-if="item.type == 'array'">
                <b-taginput
                  v-model="document[item.name]"
                  ellipsis
                  icon="label"
                  placeholder="Add an option"
                />
              </b-field>
              <!-- Date-->
              <b-field v-if="item.type == 'date'">
                <b-datepicker
                  v-model="document[item.name]"
                  :first-day-of-week="1"
                  placeholder="Click to select..."
                >
                  <button 
                    class="button is-primary" 
                    @click="date = new Date()">
                    <b-icon icon="calendar-today"/>
                    <span>Today</span>
                  </button>
                  
                  <button 
                    class="button is-danger" 
                    @click="date = null">
                    <b-icon icon="close"/>
                    <span>Clear</span>
                  </button>
                </b-datepicker>
              </b-field>
              <!-- Image-->
              <div v-if="item.type == 'image'">
                <input
                  id="files"
                  ref="uploadInput"
                  :multiple="false"
                  type="file"
                  name="file"
                  accept="image/*"
                  @change="detectFiles($event)"
                >
                <progress
                  v-if="uploading && !uploadEnd"
                  :value="progressUpload"
                >{{ progressUpload }}%</progress>
                <img 
                  v-if="uploadEnd" 
                  :src="downloadURL" 
                  width="100%">
                <div v-if="uploadEnd">
                  <button 
                    class="button" 
                    @click="deleteImage()">Delete</button>
                </div>
                <b-field label="Source URL">
                  <b-input 
                    v-model="document[item.name]" 
                    type="text"/>
                </b-field>
              </div>

              <!-- Radio -->
              <b-field v-if="item.type == 'radio'">
                <b-switch
                  :value="false"
                  v-model="document[item.name]"
                  type="is-info"
                  true-value="Yes"
                  false-value="No"
                >{{ document[item.name] }}</b-switch>
              </b-field>

              <!-- Author -->
              <b-field v-if="item.type == 'author'">
                <b-field>
                  <b-autocomplete
                    v-model="selected[item.name]"
                    :data="author"
                    :open-on-focus="openOnFocus"
                    :keep-first="keepFirst"
                    placeholder="e.g. Anne"
                    field="autorName"
                    @select="option => document[item.name] = option"
                  />
                </b-field>
              </b-field>

              <!-- typ -->
            </b-field>

            <br>
            <button
              :disabled="writeCarSuccessful"
              class="button is-success is-fullwidth"
              @click="writeCarToFirestore"
            >
              <span v-if="!writeCarSuccessful">Store</span>
              <span v-else>Successful!</span>
            </button>
          </div>

          <div class="column">

            <div class="column">
              <h1 class="title">CSS</h1>

              <label>appbar background</label>
              <input 
                v-model="css.appbarbackground" 
                type="text" 
                class="input">
              <label>appbar text color</label>
              <input 
                v-model="css.appbarcolor" 
                type="text" 
                class="input">
              <label>page background</label>
              <input 
                v-model="css.background" 
                type="text" 
                class="input">
              <label>content card background</label>
              <input 
                v-model="css.content" 
                type="text" 
                class="input">
              <label>text color</label>
              <input 
                v-model="css.text" 
                type="text" 
                class="input"> 
              <label>card elevation</label>
              <input 
                v-model="css.elevation" 
                type="number" 
                class="input">
              <label>pattern</label>
              <input 
                v-model="css.pattern" 
                type="text" 
                class="input">
              <div class="field">
                <label>Show Contact?</label>
                <b-switch 
                  v-model="css.showContact"
                  true-value="Yes"
                  false-value="No">
                  {{ showContact }}
                </b-switch>
              </div>
              <label>card background</label>
              <input 
                v-model="css.card.background" 
                type="text" 
                class="input">
              <label>card text color</label>
              <input 
                v-model="css.card.color" 
                type="text" 
                class="input">
              <label>card elevation</label>
              <input 
                v-model="css.card.elevation" 
                type="number" 
                class="input">
              <hr>
              <hr>
              <!--css!-->
              <h1 class="title">Blocks</h1>

              <ul class>
                <li 
                  v-for="(block, index) in blocks" 
                  :key="index" 
                  class="box">
                  <div v-if="block.type == 'text'">
                    <h3 class="title is-5">
                      Paragraph
                      <button 
                        class="delete" 
                        @click="deleteBlock(index)">x</button>
                    </h3>
                    <label>Text</label>
                    <no-ssr>
                      <markdown-editor 
                        ref="markdownEditor" 
                        v-model="block.content"/>
                    </no-ssr>
                    <hr>
                  </div>
                  <div v-if="block.type == 'image'">
                    <h3 class="title is-5">
                      Image
                      <button 
                        class="delete" 
                        @click="deleteBlock(index)">x</button>
                    </h3>
                    <div>
                      <button 
                        v-if="!uploadEnd && !uploading" 
                        @click="selectFile">Upload an image</button>
                      <input
                        id="files"
                        ref="uploadInput"
                        :multiple="false"
                        type="file"
                        name="file"
                        accept="image/*"
                        @change="detectFiles($event)"
                      >
                      <progress
                        v-if="uploading && !uploadEnd"
                        :value="progressUpload"
                      >{{ progressUpload }}%</progress>
                      <img 
                        v-if="uploadEnd" 
                        :src="downloadURL" 
                        width="100%">
                      <div v-if="uploadEnd">
                        <button 
                          class="button" 
                          @click="deleteImage()">Delete</button>
                      </div>
                    </div>
                    <label>Source</label>
                    <input 
                      v-model="block.src" 
                      type="text" 
                      class="input">
                    <label>Caption</label>
                    <input 
                      v-model="block.caption" 
                      type="text" 
                      class="input">
                    <label>Cols Width</label>
                    <input 
                      v-model="block.col" 
                      type="text" 
                      class="input">
                    <hr>
                  </div>
                </li>
              </ul>
              <hr>
              <b-field grouped>
                <button 
                  class="button" 
                  @click="addBlock()">Add new Text</button>
                <button 
                  class="button" 
                  @click="addImage()">Add new Image</button>
              </b-field>
            </div>
          </div>
        

        </div>
    </div></section>
  </div>
</template>

<script>
import { fireDb } from '~/plugins/firebase.js'
import { storage } from '~/plugins/firebase.js'

export default {
  data() {
    return {
      document: {},
      id: '',
      data: [],
      blocks: [],
      css: {
        appbarbackground: '#000',
        appbarcolor: '#fff',
        background: '#ffff00',
        content: '#fff',
        text: '#000',
        elevation: '1',
        pattern: '',
        showContact: true,
        card: {
          background: '#fff',
          color: '#000',
          elevation: '0'
        }
      },
      sheet: [],
      author: [],
      stoffe: [],
      wirkstoff: [],
      symptom: [],
      wirkstofftyp: [],
      prozess: [],
      name: '',
      date: new Date(),
      selected: [],
      //upload image
      oldImgUrl: '',
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      //cars
      writeCarSuccessful: false,
      //buefy
      keepFirst: false,
      openOnFocus: true
    }
  },
  layout: 'admin',
  computed: {
    filteredAuthors() {
      return this.authors.filter(option => {
        return (
          option.autorName
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        )
      })
    },
    filteredDataObj() {
      return this.cars.filter(option => {
        return (
          option.carName
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        )
      })
    }
  },
  watch: {
    uploadTask: function() {
      this.uploadTask.on(
        'state_changed',
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          )
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploadEnd = true
            this.downloadURL = downloadURL
          })
        }
      )
    }
  },
  methods: {
    getFilteredAuthors(text) {
      var authors = this.authors.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },
    getFilteredTopics(text) {
      var topics = this.topics.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },
    deleteBlock: function(index) {
      this.blocks.splice(index, 1)
    },
    addBlock() {
      this.blocks.push({
        content: '',
        type: 'text',
        id: this.idcounter++
      })
    },
    addImage() {
      this.blocks.push({ content: 'new block', type: 'image' })
    },
    setImageSource: function(index) {
      this.blocks[index].src = downloadURL
    },
    //upload image
    selectFile() {
      this.$refs.uploadInput.click()
    },
    detectFiles(e) {
      let fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload(file) {
      this.fileName = file.name
      this.uploading = true
      var baseDir = this.$route.params.id
      var extDir = this.document.id
      this.uploadTask = storage
        .ref(`${baseDir}/${extDir}/${file.name}`)
        .put(file)
    },
    deleteImage() {
      if (this.oldImgUrl === '') {
        this.deleteImgOnFirebase()
      } else {
        this.deleteImgOnUpdate()
      }
    },
    setCoverImgOnUpdate() {
      this.uploadEnd = true
      this.downloadURL = this.oldImgUrl
    },
    deleteImgOnFirebase() {
      var baseDir = this.$route.params.id
      var extDir = this.document.id
      storage
        .ref(`${baseDir}/${extDir}/${this.fileName}`)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
          console.log('deleted')
        })
        .catch(error => {
          console.error(`file delete error occured: ${error}`)
        })
    },
    deleteImgOnUpdate() {
      this.uploading = false
      this.uploadEnd = false
      this.downloadURL = ''
    },
    async writeCarToFirestore() {
      if (this.blocks.length > 0) {
        var timeToRead = await Math.round(
          JSON.stringify(this.blocks).split(' ').length / 200
        )
        this.document.timeToRead = timeToRead
      }
      const ref = fireDb.collection(this.$route.params.id).doc(this.document.id)

      const document = {
        css: this.css,
        data: this.document,
        blocks: this.blocks,
        wirkstoffe: this.stoffe
      }

      try {
        await ref.set(document)
      } catch (e) {
        // TODO: error handling
        console.error(e)
      }
      this.writeSuccessful = true
    }
  },
  async asyncData({ params }) {
    let def = await fireDb
      .collection('defaults')
      .doc(params.id)
      .get()

    let authorCollection = []
    let authors = await fireDb
      .collection('autor')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          authorCollection.push(doc.data().data)
        })
      })

    if (def.data()) {
      return {
        data: def.data().defaults,
        author: authorCollection
      }
    } else {
      return {
        data: [],
        author: authorCollection
      }
    }
  }
}
</script>
