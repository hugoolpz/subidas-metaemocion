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
              color="me-azul-oscuro"
              icon="add"
              label="Nuevo"
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
            color="me-azul-oscuro"
            icon="add"
            label="Nuevo"
            @click="abrirSubida = true"
          />
        </div>
      </div>
    </q-tab-panel>

    <q-tab-panel name="urls">
      <q-scroll-area style="height: 68vh;" class="column q-pa-md" :bar-style="estiloScroll" :thumb-style="estiloBarra">
        <div class="col q-gutter-y-lg">
          <upload-card-component tipo-archivo="urls" :nombre-archivo="archivo.name" v-for="archivo in archivos" :key="archivo" @al-editar="prepararEdicion(archivo.name)" @al-borrar="prepararBorrado(archivo.name)"></upload-card-component>
        </div>
      </q-scroll-area>

      <div class="row justify-end q-pa-md">
        <div>
          <q-btn
            size="md"
            color="me-azul-oscuro"
            icon="add"
            label="Nuevo"
            @click="abrirSubida = true"
          />
        </div>
      </div>
    </q-tab-panel>
  </q-tab-panels>

  <dialog-upload-component v-model="abrirSubida" tipo-subida="nueva" @obtener-archivos="obtenerArchivos(tabActual)" @obtener-urls="obtenerUrls"></dialog-upload-component>
  <dialog-upload-component v-model="abrirEdicion" :nombre-archivo-act="nombreArchivoAct" tipo-subida="edicion" @obtener-archivos="obtenerArchivos(tabActual)" @obtener-urls="obtenerUrls"></dialog-upload-component>
  <dialog-delete-component v-model="abrirElim" :nombre-archivo-elim="nombreArchivoElim" @hacer-borrado="tabActual !== 'urls' ? borrarArchivo(nombreArchivoElim) : borrarUrl(nombreArchivoElim)"></dialog-delete-component>
</template>

<script setup>
import UploadCardComponent from "components/UploadCardComponent.vue";
import DialogUploadComponent from "components/DialogUploadComponent.vue";
import {onMounted, ref, watch} from "vue";
import {QSpinner, useQuasar} from "quasar";
import api from "boot/httpSingleton";
import DialogDeleteComponent from "components/DialogDeleteComponent.vue";
import {useRouter} from "vue-router";

const $q = useQuasar()
const urlApi = api
const tabActual = defineModel()
const abrirSubida = ref(false)
const abrirEdicion = ref(false)
const abrirElim = ref(false)
const archivos = ref([])
const nombreArchivoAct = ref('')
const nombreArchivoElim = ref('')
const router = useRouter()

const estiloBarra = {
    borderRadius: '5px',
    backgroundColor: '#0200DB',
    opacity: 0.75
};

const estiloScroll = {
    borderRadius: '9px',
    backgroundColor: '#0200DB',
    opacity: 0.2
}

onMounted(async () => {
  if (!localStorage.getItem('token-privado')) {
    notificacion('Debes autenticarte...', 'negative', 'close')
    await router.push({path: "/login"})
  } else {
    await obtenerArchivos(tabActual.value)
  }
})

async function obtenerArchivos(tipo) {
  mostrarCarga()
  await fetch(`${urlApi}/files`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.getItem('token-privado')
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

async function obtenerUrls() {
  mostrarCarga()
  await fetch(`${urlApi}/urls`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': localStorage.getItem('token-privado')
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.code === 500) {
        notificacion('Hubo un error en el servidor...', 'negative', 'close')
      } else {
        archivos.value = []
        archivos.value = datos.urls
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
  console.log(nombreArchivoElim.value)
}

async function borrarArchivo(nombre) {
  await fetch(`${urlApi}/files/${nombre}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': window.localStorage.getItem('token-privado')
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

async function borrarUrl(nombre) {
  await fetch(`${urlApi}/urls/${nombre}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'token-privado': window.localStorage.getItem('token-privado')
    },
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.code === 404) {
        notificacion('Recurso no encontrado...', 'negative', 'close')
      } else if (datos.code === 500) {
        notificacion('Hubo un error en el servidor...', 'negative', 'close')
      } else {
        notificacion('Recurso borrado correctamente...', 'positive', 'check')
        obtenerUrls()
      }
    })
    .catch(err => {
      notificacion('El servidor no esta disponible...', 'negative', 'close')
    })
}

watch(tabActual, async (nuevo, viejo) => {
  if (viejo !== nuevo && nuevo !== 'urls') {
    await obtenerArchivos(nuevo)
  } else {
    await obtenerUrls()
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
    backgroundColor: 'me-naranja',
    message: 'Cargando...',
    messageColor: 'white'
  })
}

function terminarCarga(){
  $q.loading.hide()
}
</script>
