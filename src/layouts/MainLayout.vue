<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar
      class="bg-yellow-9 text-white "
      >

        <q-toolbar-title shrink>
          Bienvenido {{name}}
        </q-toolbar-title>

          <q-item to="/home" >
            <q-item-section avatar>
              <q-icon name="home" color="white"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Inicio</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator dark vertical inset />

          <q-item v-if="rol == 'Administrador'" to="/usuarios" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="person_add" color="white"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Usuarios</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator dark vertical inset />


         <q-item v-if="rol != 'Colaborador'" to="/empleados" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="supervised_user_circle" color="white"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Empleados</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator dark vertical inset />




        <q-btn-dropdown stretch flat label="Tienda Solidarista" icon="las la-store">

          <q-list >

            <q-item to="/productos" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="las la-shopping-cart" color="indigo"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Productos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item to="/store" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="las la-cart-plus" color="indigo"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Tienda Solidarista</q-item-label>
              </q-item-section>
            </q-item>



          <q-separator> </q-separator>



          </q-list>
        </q-btn-dropdown>

        <q-separator dark vertical inset />



        <q-btn-dropdown stretch flat label="Nominas" icon="badge">

          <q-list >

            <q-item to="/periodos" active-class="q-item-no-link-highlighting">
              <q-item-section avatar>
                <q-icon name="calendar_month" color="indigo"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Periodos</q-item-label>
              </q-item-section>
            </q-item>


            <q-btn-dropdown stretch flat icon="playlist_add" label="Bonos y Extras">

              <q-list class="q-pl-lg">

                <q-item to="/horas" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="more_time" color="indigo"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Horas Extras / Dobles</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item to="/comisiones" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="local_atm" color="indigo"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Comisiones Empleado</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item to="/bonificaciones" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="add_card" color="indigo"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Bonificaciones Empleado</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>

            </q-btn-dropdown>



          <q-separator> </q-separator>


            <q-btn-dropdown stretch flat icon="person_remove" label="Deducciones">


                 <q-item to="/dias" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="playlist_remove" color="indigo"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Reporte dias Empleado</q-item-label>
                  </q-item-section>
                </q-item>

                 <q-item to="/aportes" active-class="q-item-no-link-highlighting">
                  <q-item-section avatar>
                    <q-icon name="volunteer_activism" color="indigo"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Aportes Solidarios</q-item-label>
                  </q-item-section>
                </q-item>

            </q-btn-dropdown>

          </q-list>
        </q-btn-dropdown>





        <q-btn
        icon="logout"
        label="Cerrar Sesion"
        style="max-width: 140px !important;"
        flat
        class="text-white-6" @click="onlogOut">
        </q-btn>

      </q-toolbar>
    </q-header>



    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { showAlertAsync } from 'src/helpers/showAlerts';
import { useRouter } from 'vue-router';
import { removeToken, getToken } from '../helpers/token'



export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {

    const leftDrawerOpen = ref(false)
    const $router = useRouter()
    const name = ref<string|null>('')
    const email = ref<string|null>('')
    const rol = ref<string|null>('')
    const onlogOut = async()=>{
      await showAlertAsync('Confirmacion','Desea salir',{
        onPressOk(){
          removeToken()
          void $router.push('/')
        }
      })
    }
    //const $q = useQuasar()
    return {
      //$q,
      leftDrawerOpen,
      onlogOut,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      name,
      email,
      rol
    }
  },
  created(){
    const data = getToken()

    if(!data.storedToken){
      void this.$router.push('/')
    }else{
      this.name = data.storedName
      this.email = data.storedEmail
      this.rol = data.storedRol
    }
  }
});
</script>
