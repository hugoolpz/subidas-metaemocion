<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-me-gradiente text-white" height-hint="98">
      <q-toolbar>
        <q-btn
            size="md"
            color="white"
            icon="reply"
            text-color="black"
            @click="$router.push({path: '/login'})"
        />
        <q-toolbar-title class="text-weight-bold">
          Subida de archivos de Met@emoción
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs
        v-model="tabActual"
        inline-label
        class="text-white bg-me-gradiente text-weight-bold"
        align="left"
      >
        <q-tab label="Documentos" icon="description" name="docs" class="text-weight-bold"/>
        <q-tab label="Vídeos" icon="videocam" name="vids" class="text-weight-bold"/>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view v-model="tabActual"/>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const tabActual = ref('docs')
</script>
