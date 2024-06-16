<template>
  <q-uploader :headers="headers" class="q-mt-lg" ref="archivo" :factory="tipoSubida === 'nueva' ? factoryFnPost : factoryFnPut" accept=".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .csv, .odt, .ods, .odp, .rtf, .txt, image/*, video/*, audio/*" color="me-azul-oscuro" field-name="file"
              label="Sube los archivos aquí"
              style="width: 528px" @rejected="alRechazar" @uploaded="alSubir" @failed="alFallar">
    <template v-slot:header="scope">
      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
        <q-btn v-if="scope.queuedFiles.length > 0" dense flat icon="clear_all"
               round @click="scope.removeQueuedFiles">
          <q-tooltip class="bg-me-rosa">Borrar todos</q-tooltip>
        </q-btn>
        <q-btn v-if="scope.uploadedFiles.length > 0" dense flat icon="done_all"
               round @click="scope.removeUploadedFiles">
          <q-tooltip class="bg-me-rosa">Quitar subidos</q-tooltip>
        </q-btn>
        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner"/>
        <div class="col">
          <div class="q-uploader__title">Subir archivos</div>
          <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
        </div>
        <q-btn v-if="scope.canAddFiles" dense flat icon="add_box" round type="a"
               @click="scope.pickFiles">
          <q-uploader-add-trigger/>
          <q-tooltip class="bg-me-rosa">Elegir archivos</q-tooltip>
        </q-btn>
        <q-btn v-if="scope.canUpload" dense flat icon="cloud_upload" round
               @click="scope.upload">
          <q-tooltip class="bg-me-rosa">Subir archivos</q-tooltip>
        </q-btn>

        <q-btn v-if="scope.isUploading" dense flat icon="clear" round
               @click="scope.abort">
          <q-tooltip class="bg-me-rosa">Cancelar subida</q-tooltip>
        </q-btn>
      </div>
    </template>
  </q-uploader>
</template>

<script setup>
import {useQuasar} from "quasar";
import api from "boot/httpSingleton";
import {ref} from "vue";
const $q = useQuasar()
const urlApi = api
const archivo = ref(null)

const emit = defineEmits(['obtenerArchivos'])
const props = defineProps(['tipoSubida', 'nombreArchivoAct'])
const headers = [{
  name: 'token-privado',
  value: window.localStorage.getItem('token-privado')
}]

function factoryFnPost() {
  return {
    url: `${urlApi}/files`,
    method: 'POST',
  }
}

function factoryFnPut() {
  return {
    url: `${urlApi}/files/${props.nombreArchivoAct}`,
    method: 'PUT',
  }
}

const alSubir = (info) => {
  notificacion('El archivo se subió correctamente...', 'positive', 'check')
  archivo.value.removeUploadedFiles()
  emit('obtenerArchivos')
};

const alRechazar = (rejectedEntries) => {
  notificacion('Hubo un error en la subida...', 'negative', 'close')
}

const alFallar = (err, files) => {
  notificacion('Hubo un error en la subida...', 'negative', 'close')
}

function notificacion(mensaje, color, icono) {
  $q.notify({
    message: mensaje,
    color: color,
    position: "top",
    timeout: 1000,
    icon: icono
  });
}
</script>
