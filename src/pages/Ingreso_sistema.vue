<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '75%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center">
              <img src="../assets/login2.png">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Bienvenido(a)
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
              @submit="onSubmit"
            >
            <q-select
              label="Empresas"
              rounded outlined  v-model="modelEmpresa"
              :options="optionsEmpresa"
              :rules="[val => !!val || 'Campo obligatorio']"
              @update:model-value="val =>{selectEmpresa(val)}"
              >

            </q-select>
              <q-input
                rounded
                outlined
                type="email"
                v-model="username"
                label="Correo Electronico"
                lazy-rules
                :rules="[
                  val => !!val || 'Campo obligatorio',
                  val =>  /.+@.+\..+/.test(val) || 'Ingresa un Correo Valido'
                ]"

              >
               <template v-slot:append>
                  <q-icon
                    name='las la-user-lock'
                  />
                </template>
              </q-input>


              <q-input
                rounded
                :type="isPwd ? 'password' : 'text'"
                outlined
                v-model="password"
                label="Contraseña"
                lazy-rules
                :rules="[val => !!val || 'Campo obligatorio']"

              >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'las la-lock' : 'las la-unlock'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
              </q-input>

              <div class="text-center q-pt-lg">
                 <q-btn
                  :loading="loading"
                  color="green"
                  type="submit"
                  size="md"
                >
                  Ingresar
                  <template v-slot:loading>
                    <q-spinner-pie class="on-left" />
                  </template>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { api, endPoints } from 'src/boot/axios'
import { showAlert, showErrorEx } from 'src/helpers/showAlerts'
import {defineComponent} from 'vue'
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import {saveToken} from '../helpers/token'

export default defineComponent({
  setup() {

      const optionsEmpresa = ref([])
      const modelEmpresa = ref<any>(null)
      const username = ref('')
      const password = ref('')
      const loading = ref(false)
      const $router = useRouter()
      const isPwd = ref(true)
      const Url = ref('')


      const getEmpresas = async()=>{

      await api.get( endPoints.EMPRESAS).then((resp)=>{

        optionsEmpresa.value = resp.data

      }).catch((ex)=>{
        showErrorEx(ex)
      })
    }

    const selectEmpresa = (val)=>{

      if(!val) return

      Url.value =  val.url;

    }

    const onSubmit = ()=>{
      void loginUser()
    }

    const loginUser = async ()=>{

      loading.value = true

      await api.post(endPoints.LOGIN, {
        'idEmpresa': modelEmpresa.value.value,
        'email': username.value,
        'pass': password.value
      },{}).then((resp)=>{
        const token = resp.data.data.token
        const name = resp.data.data.nombre
        const rol = resp.data.data.rol

        if(!token){
          showAlert('Alerta','No se pudo iniciar sesion, contante al administrador',{})
          return;
        }

        saveToken(token, name, rol, username.value, Url.value)
        loading.value = false
        void $router.push('/home');

      }).catch((ex)=>{
        //console.log(ex);
        showErrorEx(ex, {mensaje: ex.response.data.mensaje})
      }).finally(()=>{
        loading.value = false;
      })
    }

    return {
      username,
      password,
      getEmpresas,
      optionsEmpresa,
      modelEmpresa,
      onSubmit,
      loading,
      isPwd,
      Url,
      selectEmpresa
    }
  },
  created(){
    void this.getEmpresas();
  }
})
</script>

<style>

.bg-image {

  background-color:rgb(34, 93, 153);

}
</style>
