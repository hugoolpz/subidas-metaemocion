<template>
  <q-dialog v-model="abrir" persistent>
    <q-card class="dialog_upload">
      <q-card-section class="row items-center">
        <div class="text-h6">¿Seguro que deseas borrar el archivo {{nombreArchivoElim}}?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="me-naranja" v-close-popup />
        <q-btn flat label="Aceptar" color="me-rojo-claro" v-close-popup @click="$emit('hacerBorrado')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref} from "vue";
import UploaderComponent from "components/UploaderComponent.vue";

const abrir = defineModel()
const emit = defineEmits(['hacerBorrado'])
const props = defineProps(['nombreArchivoElim'])
</script>
