<template>
  <div>
    <h3 class="title">
      Clasificar archivos
    </h3>
    <p class="content">
      El clasificador de archivos identidificará cuales son los
      archivos válidos.
    </p>
    <form @submit.prevent="submit">
      <div class="columns">
        <div class="column">
          <label class="label">Seleccionar carpeta de entrada</label>
          <b-field class="file is-fullwidth">
            <b-upload
              v-model="dirinput"
              webkitdirectory
            >
              <a class="button">
                <b-icon icon="upload" />
                <span>Seleccione la carpeta de entrada</span>
              </a>
            </b-upload>
            <span v-if="dirinput" class="file-name">
              {{ dirinput.name }}
            </span>
          </b-field>
        </div>
        <div class="column">
          <label class="label">Seleccionar carpeta de salida</label>
          <b-field class="file is-fullwidth">
            <b-upload
              v-model="diroutput"
              webkitdirectory
            >
              <a class="button">
                <b-icon icon="upload" />
                <span>Seleccione la carpeta de entrada</span>
              </a>
            </b-upload>
            <span v-if="diroutput" class="file-name">
              {{ diroutput.name }}
            </span>
          </b-field>
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
  </div>
</template>

<script>
import { shell } from 'electron'
import { GChart } from 'vue-google-charts'

export default {
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
    dirinput: undefined,
    diroutput: undefined,
    running: false,
    runningInforme: false,
    interval: undefined,
    percent: 0,
    statistics: undefined,
  }),
  computed: {
    body () {
      return {
        inputdir: this.dirinput ? this.dirinput.path : undefined,
        outputdir: this.diroutput ? this.diroutput.path : undefined,
      }
    },
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
    await this.$store.dispatch('project/load', this.id)
    // default data
    const project = this.$store.state.project.data
    this.statistics = JSON.parse(project.statistics) || undefined
    this.percent = project.percent || 0
  },
  methods: {
    async submit () {
      if (!this.dirinput || !this.diroutput) {
        return this.$toast.open({
          type: 'is-warning',
          message: 'Seleccione la carpeta de entrada y salida',
        })
      }
      try {
        this.$snackbar.open('Se está clasificando los archivos en segundo plano')
        this.percent = 0
        this.statistics = undefined
        this.running = true
        await this.$axios.$post(this.rest, this.body)
        this.interval = setInterval(this.checkPercent, 500)
      } catch (err) {
        this.$toast.open({ message: err.message, type: 'is-danger' })
        console.error(err)
      }
    },
    async checkPercent () {
      try {
        const data = await this.$axios.$get(this.rest, { progress: false })
        this.percent = data.percent
        if (data.percent === 1) {
          this.statistics = JSON.parse(data.statistics)
          this.running = false
          await this.$store.dispatch('project/load', this.id)
          clearInterval(this.interval)
        }
      } catch (err) {
        await this.remove()
      }
    },
    async remove () {
      if (!confirm('¿Cancelar clasificación de archivos?')) return
      try {
        this.running = false
        await this.$axios.$delete(this.rest)
        this.$snackbar.open('Se canceló la clasificación de datos')
        clearInterval(this.interval)
        await this.$store.dispatch('project/load', this.id)
      } catch (err) {
        console.error(err)
        this.$toast.open({ message: err.message, type: 'is-danger' })
      }
    },
    async generarInforme () {
      try {
        this.runningInforme = true
        const informe =
          await this.$axios.$post(`/api/projects/${this.id}/informe`, this.body)
        shell.openItem(informe)
        this.$snackbar.open('El informe se generó correctamente')
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
