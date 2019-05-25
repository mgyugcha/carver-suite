<template>
  <div>
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <h3 class="title">
            {{ $store.state.project.titulo }}
          </h3>
          <p class="subtitle">
            Carver Suite
          </p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-narrow">
            <aside class="menu">
              <p class="menu-label">
                Navegación
              </p>
              <ul class="menu-list">
                <li>
                  <nuxt-link
                    :to="`/${$route.params.id}`"
                    active-class="is-active"
                    exact
                  >
                    Proyecto
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link
                    :to="`/${$route.params.id}/form`"
                    active-class="is-active"
                  >
                    Formulario
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link
                    :to="`/${$route.params.id}/recuperar`"
                    active-class="is-active"
                  >
                    Recuperar archivos
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link
                    :to="`/${$route.params.id}/clasificar`"
                    active-class="is-active"
                  >
                    Clasificar archivos
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/">
                    Volver al inicio
                  </nuxt-link>
                </li>
              </ul>
            </aside>
          </div>
          <div class="column">
            <nuxt-child />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  transition: 'fade',
  async created () {
    try {
      await this.$store.dispatch('load', this.$route.params.id)
    } catch (err) {
      this.$router.push('/')
      this.$toast.open({ message: err.response.data, type: 'is-danger' })
    }
  }
}
</script>
