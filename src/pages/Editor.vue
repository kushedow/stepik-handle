<template>
  <div class="editor-dark">
    <q-toolbar class=" text-white">
      <q-btn flat round dense icon="arrow_back" to="/"></q-btn>
      <q-toolbar-title><small>
        Степ {{ step_id }}.
        &nbsp; <a :href="'https://stepik.org/lesson/'+step_lesson+'/step/'+step_position" class="q-link" target="_blank">Открыть на степике</a>
        &nbsp; <a :href="'https://stepik.org/edit-lesson/'+step_lesson+'/step/'+step_position" class="q-link" target="_blank">В редакторе</a>

      </small></q-toolbar-title>
      <q-btn v-on:click="loadData" color="white" text-color="black"  label="Загрузить" />&nbsp;&nbsp;&nbsp;
      <q-btn v-on:click="saveData" color="white" text-color="black"  label="Сохранить" />&nbsp;&nbsp;&nbsp;

    </q-toolbar>

    <div class="row">

      <div class="editor-left col-5 q-pa-md">

        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="editor" label="Задание" />
            <q-tab name="tests" label="Тесты" />
            <q-tab name="preview" label="Превью" />
            <q-tab name="templates" label="Шаблоны и импорт" />

          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="editor">

              <q-editor
                v-model="step_block.text"
                min-height="20rem"
                :toolbar="[
            [

              {
                label: $q.lang.editor.formatting,
                icon: $q.iconSet.editor.formatting,
                list: 'no-icons',
                options: [
                  'p',
                  'h1',
                  'h2',
                  'h3',
                  'h4',
                  'code'
                ]
              },
              'bold',
              'hr',
              'link',
              'fullscreen',
              'removeFormat',
              'viewsource',

            ],

          ]"
              />

            </q-tab-panel>

            <q-tab-panel name="tests">
              <div class="text-h6">Тесты</div>

              <span v-for="(sample, index) in step_block.source.test_cases">
               <q-input filled v-model="sample[0]" type="textarea" fill-mask="#" autogrow /><br>
               <q-input filled v-model="sample[1]" type="textarea" fill-mask="#" autogrow /><br>
               <hr>
              </span>

              <br><p>Показывать тестов:</p>
              <q-input filled v-model="step_block.source.samples_count" fill-mask="#"/>


            </q-tab-panel>

            <q-tab-panel name="preview">
              <q-btn v-on:click="refreshPreview" color="white" text-color="black"  label="Обновить превью" />
              <div class="preview">
                <iframe id="previewiframe" src=""></iframe>
              </div>
            </q-tab-panel>

            <q-tab-panel name="templates">
              <div class="text-h6">Шаблоны</div>
              <q-btn-dropdown color="primary" label="Загрузить шаблон">
                <q-list>
                  <q-item clickable v-close-popup @click="loadTemplate">
                    <q-item-section>
                      <q-item-label>Шаблон: django с Client</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup >
                    <q-item-section>
                      <q-item-label>Шаблон: django с фикстурами</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup >
                    <q-item-section>
                      <q-item-label>Шаблон: django с настройками</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup >
                    <q-item-section>
                      <q-item-label>Шаблон: django api с Api Client</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-tab-panel>



          </q-tab-panels>
        </q-card>



      </div>

      <div class="editor-right col-7 q-pa-md" style="position: relative">

        <codemirror v-model="step_block.source.templates_data" :options="cmOptions" min-height="30rem"> </codemirror>

        <br><br>




      </div>

    </div>

  </div>

</template>

<script>


  import { codemirror } from 'vue-codemirror'

  import 'codemirror/lib/codemirror.css'

  import 'codemirror/mode/python/python.js'

  import 'codemirror/theme/base16-dark.css'

  import 'codemirror/addon/selection/active-line.js'
  import 'codemirror/addon/selection/mark-selection.js'
  import 'codemirror/addon/search/searchcursor.js'

  // keyMap
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/addon/edit/matchbrackets.js'
  import 'codemirror/addon/comment/comment.js'
  import 'codemirror/addon/dialog/dialog.js'
  import 'codemirror/addon/dialog/dialog.css'
  import 'codemirror/addon/search/searchcursor.js'
  import 'codemirror/addon/search/search.js'
  import 'codemirror/keymap/sublime.js'

  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/comment-fold.js'
  import 'codemirror/addon/fold/foldcode.js'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/indent-fold.js'
  import 'codemirror/addon/fold/markdown-fold.js'
  import 'codemirror/addon/fold/xml-fold.js'

  export default {

    name: 'PageIndex',

    components: { codemirror },

    data () {
      return {

        step_lesson: this.$router.currentRoute.query.lesson, // первичный ключ топика-урока

        step_position: this.$router.currentRoute.query.position, // номер шага

        step_id: this.$router.currentRoute.query.step,  // из адресной строки берется первичный ключ степа

        step_data: {}, // сырые данные которые приходят из запроса

        step_source: {},

        step_block: { // собственно информация про степ
          text: "Текст задачки",
          source: {
            template_data: "",
            samples_count: 1
          },
          options: {samples: []}
        },


        cmOptions: {

          tabSize: 4,

          fold: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          viewportMargin: Infinity,
          mode: 'text/x-python',
          theme: 'base16-dark',

          lineNumbers: true,
          line: true,
          lineWrapping: true,
          styleActiveLine: true,
          styleSelectedText: true,

        },
        tab: "editor",
      }
    },

    methods: {



      loadData () {

        console.log("Начинаем загрузку степа")

        this.$axios.get("https://stepik.org/api/step-sources/"+this.step_id ).then((result) => {

          this.step_data = result["data"]
          this.step_source = this.step_data["step-sources"][0]
          this.step_block = this.step_source["block"]

          console.log(result)


        })
      },

      saveData (){


        let data = {
          stepSource: {
            block: this.step_block,
            lesson: this.step_lesson,
            position: this.step_position,
            cost: this.step_source.cost,
            worth: this.step_source.worth,

          }
        }

        this.$axios.put("https://stepik.org/api/step-sources/"+this.step_id, data ).then((result) => {

          alert("Данные записаны на степике")

        })

      },

      loadTemplate (){

        console.log("Загружаются шаблоны")
        this.step_block.source.templates_data = "Загружены данные какого то шаблона"

      },

      refreshPreview(){

        document.getElementById('previewiframe').src = 'https://stepik.org/lesson/'+this.step_lesson+'/step/'+this.step_position

      }

    },

    created () {

       this.loadData() // TODO: fix loading date when token is not ready

    },

  }

</script>

<style lang="scss">

 .editor-dark{
   background-color: #222;

   .bg-black{
     background-color: #222;
   }

 }



 .q-link {

   color: slategray;

 }

  .CodeMirror {
    border: 1px solid #555;
    height: auto;
    padding: 10px 0px;
    border-radius: 4px;
  }

  .q-editor {

    font-size: 16px;
    font-weight: medium;
  }

  h1, h2, h3, h4 {
    font-size: 24px;
    line-height: normal;
    margin: 5px 0
  }

  pre {

    background-color: #e4e4e4;
    border-radius: 4px;
    font-family: "Courier New" !important;
    font-weight: 600 !important;
    padding: 4px 4px 4px 12px ;

  }

  iframe {

    overflow: hidden;
    border:none;
    min-height:800px;
    width: 100%;
    position: relative;
    top: -55px;

  }

  .preview {
    overflow: hidden;


    border-radius: 4px;

    margin-top: 20px;
    margin-left: -10px;
    margin-right: -10px;
  }



</style>
