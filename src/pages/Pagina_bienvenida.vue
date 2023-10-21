<template>
  <q-page class="row items-center justify-evenly">

    <card-social icon_position="center"/>


  </q-page>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import CardSocial from '../components/Empresa_Info.vue'

export default defineComponent({
  name: 'DashBoardPage',
  components: {
    CardSocial
  },
  setup() {


    return {  };
  }
});
</script>
