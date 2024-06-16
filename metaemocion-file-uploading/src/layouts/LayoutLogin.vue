<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-me-gradiente text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          Subida de archivos de Met@emoción
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
</script>
