import Vue from 'vue'
import axios from 'axios'
import oauth from 'axios-oauth-client'

import { LocalStorage } from 'quasar'

const stepik_keys =  {

  stepik_id: LocalStorage.getItem("stepik_id"),
  stepik_secret: LocalStorage.getItem("stepik_secret"),

}

axios.getAuthorizationCode = oauth.client(axios.create(), {
  url: 'https://stepik.org/oauth2/token/',
  grant_type: 'client_credentials',
  client_id: stepik_keys.stepik_id,
  client_secret: stepik_keys.stepik_secret,
  //redirect_uri: '...',

});

axios.setAuthorizationToken = function(value){

  axios.defaults.headers.common['Authorization'] ="Bearer " + value.access_token
  axios.token = value.access_token
  console.log("Токен степика записан")

}


Vue.prototype.$axios = axios
