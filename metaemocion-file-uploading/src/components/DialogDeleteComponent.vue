<template>
  <q-dialog v-model="abrir" persistent>
    <q-card class="dialog_upload">
      <q-card-section class="row items-center">
        <div class="text-h6">¿Seguro que deseas borrar el archivo {{nombreArchivoElim}}?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="positive" v-close-popup />
        <q-btn flat label="Aceptar" color="negative" v-close-popup @click="$emit('borrarArchivo')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref} from "vue";
import UploaderComponent from "components/UploaderComponent.vue";

const abrir = defineModel()
const emit = defineEmits(['borrarArchivo'])
const props = defineProps(['nombreArchivoElim'])
</script>
