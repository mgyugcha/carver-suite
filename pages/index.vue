<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            <nuxt-link to="/">
              Carvers
            </nuxt-link>
          </h1>
          <h2 class="subtitle">
            Suite de recuperación de archivos
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title">
              Proyectos
            </h1>
          </div>
          <div class="column">
            <b-field grouped position="is-right">
              <div class="control">
                <button
                  class="button"
                  @click="add"
                >
                  Insertar
                </button>
              </div>
            </b-field>
          </div>
        </div>
        <b-table :data="data">
          <template slot-scope="props">
            <b-table-column field="id" label="ID">
              {{ props.row.id }}
            </b-table-column>
            <b-table-column field="titulo" label="Título">
              {{ props.row.titulo }}
            </b-table-column>
            <b-table-column centered field="options" label="Opciones">
              <div class="buttons has-addons is-centered">
                <nuxt-link
                  :to="`/${props.row.id}`"
                  class="button is-small"
                >
                  <b-icon
                    size="is-small"
                    icon="eye"
                  />
                </nuxt-link>
                <button
                  class="button is-small"
                  @click="remove(props.row.id)"
                >
                  <b-icon
                    size="is-small"
                    icon="delete"
                  />
                </button>
              </div>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data: () => ({
    data: [],
  }),
  async created () {
    await this.init()
  },
  methods: {
    async init () {
      try {
        this.data = await this.$axios.$get('/api/projects')
      } catch (err) {
        this.$toast.open({ message: err.message, type: 'is-danger' })
      }
    },
    add () {
      this.$dialog.prompt({
        type: 'is-dark',
        message: 'Nombre del proyecto',
        confirmText: 'Añadir',
        cancelText: 'Cancelar',
        inputAttrs: { placeholder: 'Ingrese el nombre del proyecto' },
        onConfirm: value => this.sendToServer(value)
      })
    },
    async sendToServer (titulo) {
      try {
        const { id } = await this.$axios.$post('/api/projects', { titulo })
        this.$router.push(`/${id}`)
      } catch (err) {
        this.$toast.open({ message: err.message, type: 'is-danger' })
      }
    },
    remove (id) {
      this.$dialog.confirm({
        message: '¿Eliminar proyecto?',
        onConfirm: async () => {
          try {
            await this.$axios.$delete(`/api/projects/${id}`)
            await this.init()
          } catch (err) {
            this.$toast.open({ message: err.message, type: 'is-danger' })
          }
        }
      })
    }
  },
}
</script>
