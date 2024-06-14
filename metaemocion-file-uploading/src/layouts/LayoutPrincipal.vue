<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Subida de archivos de Met@emoción
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs
        v-model="tabActual"
        inline-label
        class="bg-primary text-white"
        align="left"
      >
        <q-tab label="Documentos" icon="description" name="docs"/>
        <q-tab label="Vídeos" icon="videocam" name="vids"/>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view v-model="tabActual"/>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import {ref} from "vue";

const tabActual = ref('docs')
const busqueda = ref('')
</script>
