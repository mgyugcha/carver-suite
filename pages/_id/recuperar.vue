<template>
  <div>
    <h3 class="title">
      Recuperar archivos
    </h3>
    <div class="content">
      Seleccione el carver que desea utilizar, el dispositivo de
      almacenamiento y la carpeta de salida.  Una vez presione el
      botón de <b>Recuperar datos</b> se generará un <b>pid</b> que es
      un identificador del proceso. Al terminar se muestra
      el <b>estado</b> de finalización, si es <b>0</b> entonces
      finalizó correctamente, si es diferente de <b>0</b> quiere decir
      que ocurrió algún problema.
    </div>
    <form @submit.prevent="submit">
      <div class="columns">
        <div class="column">
          <b-field
            label="Seleccionar carver"
          >
            <b-select
              v-model="data.carver"
              placeholder="Seleccionar el carver a usar"
              expanded
              required
            >
              <option
                v-for="carver in options.carvers"
                :key="carver"
                :value="carver"
              >
                {{ carver }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column">
          <b-field
            label="Seleccionar dispositivo"
          >
            <b-select
              v-model="data.drive"
              placeholder="Seleccionar el dispositivo"
              expanded
              required
            >
              <option
                v-for="drive in drives"
                :key="drive.device"
                :value="drive.device"
              >
                {{ drive.description }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Carpeta de salida">
            <folder-input v-model="data.outputdir" />
          </b-field>
        </div>
      </div>
      <div class="buttons">
        <nuxt-link
          v-if="!runningHasProblems"
          :to="`/${id}/clasificar`"
          class="button"
        >
          Clasificar archivos
        </nuxt-link>
        <button
          :class="{ 'is-loading': !!running }"
          class="button is-dark"
        >
          Recuperar datos
        </button>
        <button
          v-if="running"
          class="button is-danger"
          type="button"
          @click="remove(true)"
        >
          Cancelar recuperación de datos
        </button>
      </div>
    </form>
    <br>
    <div v-if="running || message">
      <h3 class="title is-4">
        Resultado
      </h3>
      <b-field class="is-pulled-left">
        <div
          v-if="$store.state.project.pid !== null"
          class="control"
        >
          <b-taglist attached>
            <b-tag type="is-dark">
              pid
            </b-tag>
            <b-tag>
              {{ $store.state.project.pid }}
            </b-tag>
          </b-taglist>
        </div>
        <div
          v-if="$store.state.project.code !== null"
          class="control"
        >
          <b-taglist attached>
            <b-tag type="is-dark">
              status final
            </b-tag>
            <b-tag
              :type="runningHasProblems ? 'is-danger' : 'is-success'"
            >
              {{ $store.state.project.code }}
            </b-tag>
          </b-taglist>
        </div>
      </b-field>
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
import socket from '@/plugins/socket.io.js'

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
  data: () => ({
    isLoading: false,
    options: {
      carvers: [],
      drives: [],
    },
    data: {
      outputdir: '',
    },
    running: false,
    showOutput: true,
    message: '',
  }),
  computed: {
    id () {
      return this.$route.params.id
    },
    drives () {
      return this.options.drives.filter(x => !x.isSystem)
    },
    runningHasProblems () {
      return this.$store.state.project.code !== '0'
    }
  },
  async created () {
    socket.on('output', msg => {
      this.message = msg
    }).on('end', async () => {
      this.running = false
      await this.$store.dispatch('refresh')
      if (!this.runningHasProblems) {
        alert('Se recuperó los archivos correctamente. Procediendo a clasificar.')
        this.$router.push(`/${this.id}/clasificar`)
      }
    })
    this.options.drives = await this.$axios.$get('/api/get-drives')
    this.data.drive = this.drives[0] ? this.drives[0].device : ''
    this.options.carvers = await this.$axios.$get('/api/get-carvers')
    this.data.carver = this.options.carvers[0]
    await this.$store.dispatch('load', this.id)
    // default data
    const project = this.$store.state.project
    this.message = project.stdout || ''
    this.data.carver = project.carver || this.data.carver
    this.data.outputdir = project.outputFolderRecover
  },
  methods: {
    async submit () {
      try {
        this.running = true
        await this.$axios.$post(`/api/projects/${this.id}/recover`, this.data)
        await this.$store.dispatch('refresh')
      } catch (err) {
        this.$toast.open({ message: err.message, type: 'is-danger' })
        console.error(err)
      }
    },
    async remove (prevent = false) {
      if (prevent && !confirm('¿Cancelar recuperación de datos?')) return
      try {
        await this.$axios.$delete(`/api/projects/${this.id}/recover`)
        this.$toast.open('Se canceló la recuperación de datos')
        this.running = false
        await this.$store.dispatch('refresh')
      } catch (err) {
        console.error(err)
        this.$toast.open({ message: err.message, type: 'is-danger' })
      }
    }
  }
}
</script>

<style scoped>
.terminal {
  background: #000;
  font: 14px monospace;
  color: white;
  overflow: auto;
  width: 100%;
  word-break: break-all;
  white-space: pre-wrap;
  margin-bottom: 20px;
  word-spacing: 0px;
}
</style>
