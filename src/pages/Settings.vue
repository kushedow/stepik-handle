<template>
  <q-page padding>
    <!-- content -->

    <h4> Настроечки </h4>

    <br>

    <q-input filled v-model="stepik_id" placeholder="Stepik ID" />
    <br>

    <q-input filled v-model="stepik_secret" placeholder ="Stepik Secret" />
    <br>

    <q-btn v-on:click="saveSettings" color="white" text-color="black"  label="Сохранить настройки" />&nbsp; &nbsp;
    <q-btn :to="'/'" color="white" text-color="black"  label="Вернуться" />


  </q-page>

</template>

<script>

export default {

 // name: 'Settings',

  data () {
    return {

      stepik_id:  this.$q.localStorage.getItem("stepik_id"),
      stepik_secret:  this.$q.localStorage.getItem("stepik_secret"),

    }
  },

  methods: {

    saveSettings: function () {

      this.$q.localStorage.set("stepik_id", this.stepik_id)
      this.$q.localStorage.set("stepik_secret", this.stepik_secret)

      console.log("Сохранили настройки!")

    },
  },


}
</script>
