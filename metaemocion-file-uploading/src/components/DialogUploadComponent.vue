<template>
  <q-dialog v-model="abrir" persistent>
    <q-card class="dialog_upload">
      <q-tabs v-model="tab" class="text-me-azul-oscuro" inline-label>
        <q-tab name="archivos" icon="description" label="Archivo" />
        <q-tab name="urls" icon="link" label="Url" />
      </q-tabs>
      <q-card-section class="row items-center">
        <div class="text-h6" v-if="tipoSubida === 'nueva'">Rellena el formulario para proceder con la subida</div>
        <div class="text-h6" v-else>Rellena el formulario para proceder con la edición</div>
        <q-space />
        <q-btn icon="close" color="me-rojo-claro" round dense v-close-popup v-show="tab !== 'urls'" />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="archivos">
              <uploader-component :nombre-archivo-act="nombreArchivoAct" :tipo-subida="tipoSubida" @obtener-archivos="$emit('obtenerArchivos')"></uploader-component>
            </q-tab-panel>
            <q-tab-panel name="urls">
              <q-form
                  @submit="tipoSubida === 'nueva' ? subirUrl() : actualizarUrl()"
                  @reset="nombre = ''; url = ''"
                  class="q-gutter-md">
                <q-input
                  v-model="nombre"
                  label="Nombre del recurso*"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Campo requerido*']"
                  color="me-azul-oscuro"
                  outlined
                  class="q-mt-lg"
                  style="width: 30.8rem"
                />
                <q-input
                  v-model="url"
                  label="Url del recurso*"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Campo requerido*']"
                  color="me-azul-oscuro"
                  outlined
                  class="q-mt-lg"
                  style="width: 30.8rem"
                />
                  <div align="right">
                      <q-btn label="Subir" type="submit" color="positive"/>
                      <q-btn label="Cancelar" type="reset" color="negative" flat class="q-ml-sm" v-close-popup/>
                  </div>
              </q-form>
            </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref} from "vue";
import UploaderComponent from "components/UploaderComponent.vue";
import api from "boot/httpSingleton";
import {useQuasar} from "quasar";

const abrir = defineModel()
const emit = defineEmits(['obtenerArchivos', 'obtenerUrls'])
const props = defineProps(['tipoSubida', 'nombreArchivoAct'])
const tab = ref('archivos')
const url = ref('')
const nombre = ref('')
const urlApi = api
const $q = useQuasar()

async function subirUrl() {
  await fetch(`${urlApi}/urls`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": nombre.value,
      "url": url.value,
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.code === 400) {
        notificacion('Hubo un error en la subida...', 'negative', 'close')
      } else {
        notificacion('El recurso se subió correctamente...', 'positive', 'check')
        if (tab.value === 'urls') {
          emit('obtenerUrls')
        }
      }
    })
}

async function actualizarUrl() {
  await fetch(`${urlApi}/urls/${props.nombreArchivoAct}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "name": nombre.value,
      "url": url.value,
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.code === 400) {
        notificacion('Hubo un error en la subida...', 'negative', 'close')
      } else {
        notificacion('El recurso se actualizó correctamente...', 'positive', 'check')
        if (tab.value === 'urls') {
          emit('obtenerUrls')
        }
      }
    })
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
