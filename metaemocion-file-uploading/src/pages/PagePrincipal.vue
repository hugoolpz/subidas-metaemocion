<template>
  <q-tab-panels v-model="tabActual" animated>
    <q-tab-panel name="docs">
      <q-scroll-area style="height: 68vh;" class="column q-pa-md" :bar-style="estiloScroll" :thumb-style="estiloBarra">
        <div class="col q-gutter-y-lg">
          <upload-card-component tipo-archivo="docs" :nombre-archivo="archivo.name" v-for="archivo in archivos" :key="archivo" @al-editar="prepararEdicion(archivo.name)" @al-borrar="prepararBorrado(archivo.name)"></upload-card-component>
        </div>
      </q-scroll-area>

      <div class="row justify-end q-pa-md">
        <div>
          <q-btn
              size="md"
              color="primary"
              icon="add"
              label="Nuevo documento"
              @click="abrirSubida = true"
          />
        </div>
      </div>
    </q-tab-panel>

    <q-tab-panel name="vids">
      <q-scroll-area style="height: 68vh;" class="column q-pa-md" :bar-style="estiloScroll" :thumb-style="estiloBarra">
        <div class="col q-gutter-y-lg">
          <upload-card-component tipo-archivo="vids" :nombre-archivo="archivo.name" v-for="archivo in archivos" :key="archivo" @al-editar="prepararEdicion(archivo.name)" @al-borrar="prepararBorrado(archivo.name)"></upload-card-component>
        </div>
      </q-scroll-area>

      <div class="row justify-end q-pa-md">
        <div>
          <q-btn
            size="md"
            color="primary"
            icon="add"
            label="Nuevo vídeo"
            @click="abrirSubida = true"
          />
        </div>
      </div>
    </q-tab-panel>
  </q-tab-panels>

  <dialog-upload-component v-model="abrirSubida" tipo-subida="nueva" @obtener-archivos="obtenerArchivos(tabActual)"></dialog-upload-component>
  <dialog-upload-component v-model="abrirEdicion" :nombre-archivo-act="nombreArchivoAct" tipo-subida="edicion" @obtener-archivos="obtenerArchivos(tabActual);"></dialog-upload-component>
  <dialog-delete-component v-model="abrirElim" :nombre-archivo-elim="nombreArchivoElim" @borrar-archivo="borrarArchivo(nombreArchivoElim)"></dialog-delete-component>
</template>

<script setup>
import UploadCardComponent from "components/UploadCardComponent.vue";
import DialogUploadComponent from "components/DialogUploadComponent.vue";
import {onMounted, ref, watch} from "vue";
import {QSpinner, useQuasar} from "quasar";
import api from "boot/httpSingleton";
import DialogDeleteComponent from "components/DialogDeleteComponent.vue";

const $q = useQuasar()
const urlApi = api
const tabActual = defineModel()
const abrirSubida = ref(false)
const abrirEdicion = ref(false)
const abrirElim = ref(false)
const archivos = ref([])
const nombreArchivoAct = ref('')
const nombreArchivoElim = ref('')

const estiloBarra = {
    borderRadius: '5px',
    backgroundColor: '#027be3',
    opacity: 0.75
};

const estiloScroll = {
    borderRadius: '9px',
    backgroundColor: '#027be3',
    opacity: 0.2
}

onMounted(async () => {
  await obtenerArchivos(tabActual.value)
})

async function obtenerArchivos(tipo) {
  mostrarCarga()
  await fetch(`${urlApi}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.code === 500) {
        notificacion('Hubo un error en el servidor...', 'negative', 'close')
      } else {
        const extensionesDocs = [
          '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.odt', '.ods', '.txt', '.rtf', '.csv', '.jpg', '.jpeg', '.png'
        ];

        const extensionesMedia = [
          '.mp3', '.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.wav', '.ogg', '.m4a', '.aac', '.wma'
        ];

        archivos.value = []

        datos.fileList.forEach((file) => {
          if (tipo === 'docs') {
            if (extensionesDocs.some(ext => file.name.endsWith(ext))) {
              archivos.value.push(file);
            }
          } else {
            if (extensionesMedia.some(ext => file.name.endsWith(ext))) {
              archivos.value.push(file);
            }
          }
        });
      }
    })
    .catch(err => {
      notificacion('El servidor no esta disponible...', 'negative', 'close')
    })
  terminarCarga()
}

async function prepararEdicion(nombre) {
  nombreArchivoAct.value = nombre
  abrirEdicion.value = true
}

async function prepararBorrado(nombre) {
  nombreArchivoElim.value = nombre
  abrirElim.value = true
}

async function borrarArchivo(nombre) {
  await fetch(`${urlApi}/${nombre}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.code === 404) {
        notificacion('Archivo no encontrado...', 'negative', 'close')
      } else if (datos.code === 500) {
        notificacion('Hubo un error en el servidor...', 'negative', 'close')
      } else {
        notificacion('Archivo borrado correctamente...', 'positive', 'check')
        obtenerArchivos(tabActual.value)
      }
    })
    .catch(err => {
      notificacion('El servidor no esta disponible...', 'negative', 'close')
    })
}

watch(tabActual, async (nuevo, viejo) => {
  if (viejo !== nuevo) {
    await obtenerArchivos(nuevo)
  }
})

function notificacion(mensaje, color, icono) {
  $q.notify({
    message: mensaje,
    color: color,
    position: "top",
    timeout: 1000,
    icon: icono
  });
}

function mostrarCarga() {
  $q.loading.show({
    spinner: QSpinner,
    spinnerColor: 'white',
    spinnerSize: 150,
    backgroundColor: 'secondary',
    message: 'Reuniendo archivos...',
    messageColor: 'white'
  })
}

function terminarCarga(){
  $q.loading.hide()
}
</script>
