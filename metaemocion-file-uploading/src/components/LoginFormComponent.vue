<template>
  <q-card bordered class="login_form bg-white">
    <q-card-section>
      <div class="text-h4 text-center text-me-azul-oscuro">Inicia sesión</div>
      <q-form
        @submit="iniciarSesion"
        @reset="reiniciarForm"
        class="q-gutter-md q-mt-lg"
      >
        <q-input
          v-model="nombre"
          label="Nombre de usuario*"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Campo requerido*']"
          color="me-azul-oscuro"
          outlined
          :error="correoErroneo"
        />

        <q-input
          v-model="contra"
          label="Contraseña*"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Campo requerido*']"
          color="me-azul-oscuro"
          outlined
          :error="contraErronea"
          :type="esContra ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="esContra ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="esContra = !esContra"
            />
          </template>
        </q-input>

        <div align="right">
          <q-btn label="Entrar" type="submit" color="me-naranja"/>
          <q-btn label="Cancelar" type="reset" color="me-rojo-claro" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import {ref} from "vue";
import {QSpinner, useQuasar} from "quasar";
import {useRouter} from "vue-router";
import api from "boot/httpSingleton";

const nombre = ref('')
const contra = ref('')
const esContra = ref(true)

const correoErroneo = ref(false)
const contraErronea = ref(false)
const $q = useQuasar()
const router = useRouter()
const urlApi = api

async function iniciarSesion() {
  correoErroneo.value = false
  contraErronea.value = false
  mostrarCarga()
  fetch(`${urlApi}/users`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "username": nombre.value,
      "password": contra.value,
    })
  })
    .then(respuesta => respuesta.json())
    .then(datos => {
      if (datos.code === 400) {
        if (datos.error === "Contraseña incorrecta") {
          contraErronea.value = true
        } else {
          correoErroneo.value = true
        }
        terminarCarga()
      } else if (datos.code === 404) {
        notificacion('El usuario no existe...', 'negative', 'close')
      } else {
        localStorage.clear()
        localStorage.setItem("token-privado", datos.token)

        setTimeout(function () {
          terminarCarga()
          router.push({path: "/subidas"})
        }, 1000)
      }
    })
}

async function reiniciarForm() {
  nombre.value = '';
  contra.value = '';
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
