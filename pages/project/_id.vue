<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h3 class="title">
            {{ $store.state.project.data.titulo }}
          </h3>
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
                    :to="`/project/${$route.params.id}`"
                    active-class="is-active"
                    exact
                  >
                    Inicio
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link
                    :to="`/project/${$route.params.id}/recuperar`"
                    active-class="is-active"
                  >
                    Recuperar archivos
                  </nuxt-link>
                  <nuxt-link
                    :to="`/project/${$route.params.id}/clasificar`"
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
  async created () {
    try {
      await this.$store.dispatch('project/load', this.$route.params.id)
    } catch (err) {
      this.$router.push('/')
      this.$toast.open({ message: err.response.data, type: 'is-danger' })
    }
  }
}
</script>
