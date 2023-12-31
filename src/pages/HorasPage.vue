<template>
  <q-page padding>

    <q-form
      @submit="agregarHoras"
      class="q-gutter-md"
    >
      <div class="row">

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-input rounded outlined v-model="periodoActivo" type="text" disable label="Id Periodo" />
        </div>

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-select rounded outlined v-model="modelEmpleado" :options="optionsEmpleado" label="Seleccione Empleado" filled @update:model-value="val =>{getHorasEmpleado(val)}"/>
        </div>

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-input rounded outlined v-model="horasExtras" type="number" label="Ingrese Total de Horas Extras" />
        </div>

        <div class="col-xs-4 col-md-4 q-pa-md">
          <q-input rounded outlined v-model="horasDobles" type="number" label="Ingrese Total de Horas Dobles" />
        </div>

      </div>
      <div>
        <q-btn label="Agregar" type="submit" color="primary"/>
      </div>
    </q-form>

    <div style="height: 500px;">

      <q-table
        class="full-height"
        title="Horas Empleado"
        :rows="horasEmpleadoRows"
        :columns="columns"
        :filter="filter"
        :pagination="{ rowsPerPage: 0 }"
      >
      <template v-slot:body-cell-Eliminar="props">
          <q-td :props="props" class="q-pa-sm">
            <q-btn
            outline size="sm"
            color='red'
            icon='delete'
            label='Eliminar'
            @click="bajaHoras(props.row)">
          </q-btn>
          </q-td>
        </template>
      </q-table>

    </div>

  </q-page>
</template>

<script lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import { api, endPoints } from 'src/boot/axios';
import { showAlertAsync, showError, showErrorEx, showSucces } from 'src/helpers/showAlerts';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';


const columns:QTableProps['columns']=[
  {
    name: 'IdPeriodo',
    label:'Id Periodo',
    field:'id_periodo',
    align: 'center'
  },
  {
    name:'IdEmpleado',
    label:'Id Empleado',
    field:'id_empleado',
    align: 'center'
  },
  {
    name:'HorasExtras',
    label:'Horas Extras',
    field:'horas_extas',
    align: 'center'
  },
  {
    name: 'HorasDobles',
    label:'Horas Dobles',
    field:'horas_dobles',
    align: 'center'
  },
  {
    name: 'Eliminar',
    label:'Eliminar',
    field:'Eliminar',
    align: 'center'
  },
]

export default defineComponent({
  name: 'HorasPage',
  setup(){

    const $q = useQuasar()
    const $router = useRouter()
    const periodoActivo = ref<any|null>(null)
    const filter = ref('');
    const horasEmpleadoRows = ref<any[]>([]);

    const optionsEmpleado = ref([])
    const modelEmpleado = ref<any>(null)

    const horasExtras = ref(null)
    const horasDobles = ref(null)


    const getEmpleados = async()=>{
      await api.get(endPoints.EMPLEADOS + '/combo').then((resp)=>{

        optionsEmpleado.value = resp.data

      }).catch((ex)=>{
        showErrorEx(ex)
      })
    }

    const getHorasEmpleado = async(val)=>{

      const idEmpleado = val.value

       $q.loading.show()

      await api.get(endPoints.HORAS, {params:{
        'idEmpleado': idEmpleado,
        'idPeriodo' : periodoActivo.value
      }})
      .then((resp)=>{

        horasEmpleadoRows.value = resp.data

      })
      .catch((ex)=>{

        showErrorEx(ex)
      }).finally(()=>{

        $q.loading.hide()
      })

    }


    const bajaHoras = async(val)=>{

      const conf = await showAlertAsync('Confirmacion', 'Esta seguro de Eliminar?', {})

      if(!conf) return

      const idEmpleado = val.id_empleado

       $q.loading.show()

      await api.delete(endPoints.HORAS, {params:{
        'idEmpleado': idEmpleado,
        'idPeriodo' : periodoActivo.value
      }})
      .then(async(resp)=>{

        await getHorasEmpleado({value: idEmpleado})
        showSucces('Proceso Correcto')
      })
      .catch((ex)=>{

        showErrorEx(ex)
      }).finally(()=>{

        $q.loading.hide()
      })

    }

    const getPeriodoActivo = async()=>{

      $q.loading.show()

      await api.get(endPoints.PERIODOS+ '/activo')
      .then((resp)=>{

        if(!resp.data[0]){
          showError('Error', {subtitulo:'No existe un Periodo Activo, debe aperturar el periodo', timeout:10000})
          $q.loading.hide()
          $router.back()
          return
        }

        periodoActivo.value = resp.data[0].id

      })
      .catch((ex)=>{

        showErrorEx(ex)
      }).finally(()=>{

        $q.loading.hide()
      })
    }

    const agregarHoras = async()=>{

      if(!periodoActivo.value || !horasDobles.value || !horasExtras.value || !modelEmpleado.value){
        showError('Debe Seleccionar todos los campos')
        return
      }

      const conf = await showAlertAsync('Confirmacion', 'Desea Agregar las Horas al Empleado?', {})

      if(!conf) return

      const data = {
        idPeriodo: periodoActivo.value,
        horasDobles: horasDobles.value,
        horasExtras: horasExtras.value,
        idEmpleado: modelEmpleado.value.value
      }

      $q.loading.show()

      const resp = await api.post(endPoints.HORAS, data)
      .then(async(resp)=>{

        if (resp.status === 200){
          showSucces('Agregado Correctamente')
          await getHorasEmpleado({value: data.idEmpleado})
          horasExtras.value = null
          horasDobles.value = null
        }

      }).catch((ex)=>{
        showErrorEx(ex)
      })

      $q.loading.hide()

    }


    return{
      getPeriodoActivo,
      horasEmpleadoRows,
      columns,
      periodoActivo,
      filter,
      agregarHoras,
      getEmpleados,
      modelEmpleado,
      optionsEmpleado,
      horasExtras,
      horasDobles,
      getHorasEmpleado,
      bajaHoras
    }
  },
  created(){
    void this.getPeriodoActivo();
    void this.getEmpleados();
  }
});
</script>
