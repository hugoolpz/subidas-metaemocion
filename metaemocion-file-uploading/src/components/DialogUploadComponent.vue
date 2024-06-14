<template>
  <q-dialog v-model="abrir" persistent>
    <q-card class="dialog_upload">
      <q-card-section class="row items-center">
        <div class="text-h6" v-if="tipoSubida === 'nueva'">Rellena el formulario para proceder con la subida</div>
        <div class="text-h6" v-else>Rellena el formulario para proceder con la edición</div>
        <q-space />
        <q-btn icon="close" color="negative" round dense v-close-popup />

        <uploader-component :nombre-archivo-act="nombreArchivoAct" :tipo-subida="tipoSubida" @obtener-archivos="$emit('obtenerArchivos')"></uploader-component>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref} from "vue";
import UploaderComponent from "components/UploaderComponent.vue";

const abrir = defineModel()
const emit = defineEmits(['obtenerArchivos'])
const props = defineProps(['tipoSubida', 'nombreArchivoAct'])
</script>
