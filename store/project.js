const rest = '/api/projects'

export const state = () => ({
  data: {}
})

export const mutations = {
  setProject (state, data) {
    state.data = data
  }
}

export const actions = {
  async load ({ commit }, id) {
    const project = await this.$axios.$get(`${rest}/${id}`)
    commit('setProject', project)
  },
  async update (store, update) {
    await this.$axios.$put(`${rest}/${update.id}`, update.data)
  }
}
