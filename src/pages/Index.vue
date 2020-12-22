<template>
  <q-page >
    <!-- content -->

    <div padding style="width: 500px; margin: auto">
      <q-toolbar class="bg-black text-white">

        <q-toolbar-title><small>Stepik Handle</small></q-toolbar-title>

      </q-toolbar>

      <br><br>
      <h4>Введите номер урока, чтобы получить список его шагов</h4>

      <div style="width: 300px; ">
        <q-input color="green-2" v-model="lesson_id" inverted />
      </div>
      <br>
      <span v-for="(item, index) in steps">
        <q-btn
          :to="'editor?lesson='+lesson_id+'&step='+item+'&position='+(index+1)"
          color="white"
          text-color="black"
          :label="index+1" />
      </span>

      <br><br>
      <q-btn v-on:click="loadLesson" color="white" text-color="black"  label="Получить список" /> &nbsp; &nbsp;
      <q-btn :to="'settings'" color="white" text-color="black"  label="Настроить авторизацию" />

      <br><br>

      <!--btn to="editor?lesson=&step=1799692" color="white" text-color="black"  label="Перейти к тестовому редактору" /-->


    </div>



  </q-page>
</template>

<script>


  export default {

    data () {
      return {

        lesson_id: this.$q.localStorage.getItem("lesson"),
        steps: []

      }
    },

    methods: {

      loadLesson() {
        console.log("Начинаем загрузку урока")

        this.$axios.get("https://stepik.org/api/lessons/" + this.lesson_id).then((result) => {

          this.steps = result.data.lessons[0].steps
          this.$q.localStorage.set("lesson", this.lesson_id)

          console.log(this.steps)
        })
      },
    },
    created () {

      this.$axios.getAuthorizationCode().then((value) => this.$axios.setAuthorizationToken(value));

      if (this.lesson_id !== undefined) {
        this.loadLesson()
      }

    }

  }
</script>

<style>

  h1, h2, h3, h4 {
    font-size: 24px;
    line-height: normal;
    margin: 5px 0
  }


</style>


