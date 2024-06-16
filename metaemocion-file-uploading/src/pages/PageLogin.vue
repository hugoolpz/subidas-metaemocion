<template>
  <div class="column flex-center fullscreen">
    <login-form-component></login-form-component>
  </div>
</template>

<script setup>
import LoginFormComponent from "components/LoginFormComponent.vue";
localStorage.clear()
</script>
