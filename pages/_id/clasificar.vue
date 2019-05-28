<template>
  <div>
    <h3 class="title">
      Clasificar archivos
      <b-button
        title="Mostrar ayuda"
        type="is-text"
        icon-right="help-circle"
        @click="showHelp = !showHelp"
      />
    </h3>
    <b-modal :active.sync="showHelp" scroll="keep">
      <div class="box content">
        <h2>Clasificar archivos</h2>
        <p class="has-text-justified">
          Como resultado del paso anterior se puede obtener una gran
          cantidad de archivos, muchos de estos archivos válidos,
          muchos otros corruptos y otros simplemente archivos
          basura. El clasificador de archivos analiza un directorio y
          los ordena por:
        </p>

        <div class="columns">
          <div class="column">
            <p class="has-text-centered">
              <b-icon
                size="is-medium"
                type="is-success"
                icon="file-check"
              />
              <br>
              <b>Positivos</b>
              <br><br>
              Archivos recuperados correctamente
            </p>
          </div>
          <div class="column">
            <p class="has-text-centered">
              <b-icon
                size="is-medium"
                type="is-danger"
                icon="file-question"
              />
              <br>
              <b>Falsos positivos</b>
              <br><br>
              Archivos que fueron recuperados, pero tienen fallas de
              integridad
            </p>
          </div>
          <div class="column">
            <p class="has-text-centered">
              <b-icon
                size="is-medium"
                icon="file-find"
              />
              <br>
              <b>Sin clasificación</b>
              <br><br>
              Archivos que deben clasificarse manualmente por el
              usuario.
            </p>
          </div>
        </div>
      </div>
    </b-modal>
    <form @submit.prevent="submit">
      <div class="columns">
        <div class="column">
          <label class="label">Seleccionar carpeta de entrada</label>
          <folder-input v-model="data.inputdir" />
        </div>
        <div class="column">
          <label class="label">Seleccionar carpeta de salida</label>
          <folder-input v-model="data.outputdir" />
        </div>
      </div>
      <div
        v-if="done || running"
        class="columns"
      >
        <div class="column">
          <progress
            :value="percentValue"
            :class="{
              'is-success': done,
              'is-info': !done,
            }"
            class="progress"
            max="100"
          >
            {{ percentString }}
          </progress>
        </div>
      </div>
      <div v-if="statistics" class="columns">
        <div class="column">
          <GChart
            type="ColumnChart"
            :data="chartData"
          />
        </div>
      </div>
      <div class="buttons">
        <button
          :class="{ 'is-loading': !!running }"
          class="button is-dark"
        >
          Clasificar archivos
        </button>
        <button
          v-if="running"
          type="button"
          class="button is-danger"
          @click="remove"
        >
          Cancelar clasificación
        </button>
        <button
          v-if="done"
          :class="{ 'is-loading': !!runningInforme }"
          type="button"
          class="button is-success"
          @click="generarInforme"
        >
          Generar Informe
        </button>
      </div>
    </form>
    <br>
    <div v-if="running || message">
      <h3 class="title is-4 is-pulled-left">
        Clasificación
      </h3>
      <div class="buttons is-right">
        <b-button
          class="is-pulled-right"
          type="is-text"
          @click="showOutput = !showOutput"
        >
          {{ showOutput ? 'Ocultar' : 'Mostrar' }} output
        </b-button>
      </div>
      <pre v-if="showOutput" class="terminal">{{ message }}</pre>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron'
import { GChart } from 'vue-google-charts'
import socket from '@/plugins/socket.io.js'

export default {
  transition: 'zoom',
  async beforeRouteLeave (to, from, next) {
    if (this.running === true) {
      if (confirm('Hay un proceso en segundo plano. ¿Seguro que desea salir?')) {
        await this.remove()
        next()
      }
    } else {
      next()
    }
  },
  components: {
    GChart
  },
  data: () => ({
    showHelp: false,
    showOutput: true,
    message: '',
    data: {
      inputdir: '',
      outputdir: '',
    },
    running: false,
    runningInforme: false,
    percent: 0,
    statistics: undefined,
  }),
  computed: {
    chartData () {
      const positivos = this.statistics ? this.statistics.good : 0
      const negativos = this.statistics ? this.statistics.bad : 0
      const sinclasif = this.statistics ? this.statistics.unknown : 0
      return [
        ['Tipo', 'Positivos', 'Negativos', 'Sin clasificación'],
        ['Archivos procesados', positivos, negativos, sinclasif],
      ]
    },
    id () {
      return this.$route.params.id
    },
    rest () {
      return `/api/projects/${this.id}/sorter`
    },
    percentValue () {
      return this.percent * 100
    },
    percentString () {
      return parseFloat(Math.round(this.percentValue) / 100).toFixed(2)
    },
    done () {
      return this.percent === 1 && !!this.statistics
    },
  },
  async created () {
    socket.on('output-percent', percent => {
      this.percent = percent
    }).on('output-file', file => {
      this.message += file
    }).on('end-sort', async () => {
      this.running = false
      await this.$store.dispatch('refresh')
      await this.$store.dispatch('load', this.id)
      const project = this.$store.state.project
      this.statistics = JSON.parse(project.statistics)
      this.percent = project.percent
    })
    await this.$store.dispatch('load', this.id)
    // default data
    const project = this.$store.state.project
    this.statistics = JSON.parse(project.statistics) || undefined
    this.data.inputdir = this.$store.state.project.outputFolderRecover || ''
    this.data.outputdir = this.$store.state.project.outputFolderSorter || ''
    this.percent = project.percent || 0
  },
  methods: {
    async submit () {
      try {
        this.running = true
        this.$toast.open('Se está clasificando los archivos en segundo plano')
        await this.$axios.$post(this.rest, this.data)
        this.percent = 0
        this.statistics = undefined
      } catch (err) {
        this.$toast.open({ message: err.message, type: 'is-danger' })
        console.error(err)
      }
    },
    async remove () {
      if (!confirm('¿Cancelar clasificación de archivos?')) return
      try {
        await this.$axios.$delete(this.rest)
        this.$toast.open('Se canceló la clasificación de datos')
        this.running = false
        await this.$store.dispatch('refresh')
      } catch (err) {
        console.error(err)
        this.$toast.open({ message: err.message, type: 'is-danger' })
      }
    },
    async generarInforme () {
      try {
        this.runningInforme = true
        const informe =
          await this.$axios.$post(`/api/projects/${this.id}/informe`, this.data)
        shell.openItem(informe)
        this.$toast.open('El informe se generó correctamente')
      } catch (err) {
        console.error(err)
        this.$toast.open({ message: err.message, type: 'is-danger' })
      } finally {
        this.runningInforme = false
      }
    }
  }
}
</script>
