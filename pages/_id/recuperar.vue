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
            <b-field class="file is-fullwidth">
              <b-upload v-model="diroutput" webkitdirectory>
                <a class="button">
                  <b-icon icon="upload" />
                  <span>Seleccionar</span>
                </a>
              </b-upload>
              <span v-if="diroutput" class="file-name">
                {{ diroutput.name }}
              </span>
            </b-field>
          </b-field>
        </div>
      </div>
      <div class="buttons">
        <nuxt-link
          v-if="!runningHasProblems"
          :to="`/project/${id}/sorter`"
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
      </div>
    </form>
    <br>
    <div v-if="running || message">
      <h3 class="title is-4">
        Resultado
      </h3>
      <b-field grouped group-multiline>
        <div class="control">
          <b-taglist attached>
            <b-tag type="is-dark">
              pid
            </b-tag>
            <b-tag>
              {{ $store.state.project.data.pid }}
            </b-tag>
          </b-taglist>
        </div>
        <div
          v-if="$store.state.project.data.code !== null"
          class="control"
        >
          <b-taglist attached>
            <b-tag type="is-dark">
              status final
            </b-tag>
            <b-tag
              :type="runningHasProblems ? 'is-danger' : 'is-success'"
            >
              {{ $store.state.project.data.code }}
            </b-tag>
          </b-taglist>
        </div>
      </b-field>
      <br>
      <b-notification
        v-if="$store.state.project.data.code !== null && runningHasProblems"
        type="is-danger"
      >
        Ocurrieron problemas al correr el carver, por favor verifique
        la consola para identificar los errores.
      </b-notification>
      <pre class="box terminal">{{ message }}</pre>
      <button
        v-if="running"
        class="button is-danger"
        type="button"
        @click="remove(true)"
      >
        Cancelar recuperación de datos
      </button>
    </div>
  </div>
</template>

<script>
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
    diroutput: undefined,
    data: { },
    running: undefined,
    interval: undefined,
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
      return this.$store.state.project.data.code !== '0'
    }
  },
  async created () {
    this.options.drives = await this.$axios.$get('/api/get-drives')
    this.data.drive = this.drives[0] ? this.drives[0].device : ''
    this.options.carvers = await this.$axios.$get('/api/get-carvers')
    this.data.carver = this.options.carvers[0]
    await this.$store.dispatch('project/load', this.id)
    // default data
    const project = this.$store.state.project.data
    this.message = project.stdout || ''
    this.data.carver = project.carver || this.data.carver
    this.data.outputdir = project.outputdir || this.data.outputdir
  },
  methods: {
    async submit () {
      if (!this.diroutput) {
        return this.$toast.open({
          message: 'Ingrese una carpeta de salida',
          type: 'is-warning'
        })
      }
      try {
        this.data.outputdir = this.diroutput.path
        await this.$axios.$post(`/api/projects/${this.id}/recover`, this.data)
        this.$snackbar.open('Se está corriendo el carver en segundo plano')
        await this.$store.dispatch('project/load', this.id)
        this.message = ''
        this.running = true
        this.interval = setInterval(this.checkProgress, 1000)
      } catch (err) {
        this.$toast.open({ message: err.message, type: 'is-danger' })
        console.error(err)
      }
    },
    async checkProgress () {
      try {
        const data = await this.$axios.$get(`/api/projects/${this.id}/recover`, {
          progress: false
        })
        this.message = data.stdout
        if (data.code !== null) {
          this.running = false
          await this.$store.dispatch('project/load', this.id)
          clearInterval(this.interval)
          if (!this.runningHasProblems) {
            alert('Se recuperó los archivos correctamente. Procediendo a clasificar.')
            this.$router.push(`/${this.id}/clasificar`)
          }
        }
      } catch (err) {
        await this.remove()
      }
    },
    async remove (prevent = false) {
      if (prevent && !confirm('¿Cancelar recuperación de datos?')) return
      try {
        await this.$axios.$delete(`/api/projects/${this.id}/recover`)
        this.$snackbar.open('Se canceló la recuperación de datos')
        this.running = false
        clearInterval(this.interval)
        await this.$store.dispatch('project/load', this.id)
      } catch (err) {
        console.error(err)
        this.$toast.open({ message: err.message, type: 'is-danger' })
      }
    }
  }
}
</script>

<style>
.terminal {
  background: black;
  color: white;
  border-radius: 6px;
  width: 100%;
  overflow: auto;
}
</style>
