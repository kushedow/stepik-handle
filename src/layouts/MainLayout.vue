<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

// require component

export default {
  name: 'MainLayout',
  components: {},
  data () {
    return {
      step_title: 'Test Stepik Title'

    }
  }
}
</script>
