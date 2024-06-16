<template>
  <q-card class="upload_card" bordered>
    <q-card-section horizontal class="row">
      <div class="col-2 self-center text-center">
        <q-icon
          :name="tipoArchivo === 'docs' ? 'description' : 'videocam'"
          color="me-azul-oscuro"
          size="32px"
        />
      </div>

      <q-card-section class="col-8 self-center text-center">
        <div class="column">
          <div class="col text-h5">{{ nombreArchivo }}</div>
        </div>
      </q-card-section>

      <q-card-section class="col-2 self-center text-center">
        <div class="row flex-center">
          <div class="col">
            <q-btn round
                   size="md"
                   color="me-naranja"
                   icon="edit"
                   @click="$emit('alEditar')"
            />
          </div>
          <div class="col">
            <q-btn round
                   size="md"
                   color="me-rojo-claro"
                   icon="delete"
                   @click="$emit('alBorrar')"
            />
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps(['nombreArchivo', 'tipoArchivo'])
const emit = defineEmits(['alEditar', 'alBorrar'])
</script>

