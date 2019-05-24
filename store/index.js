const rest = '/api/projects'

export const state = () => ({
  project: {}
})

export const mutations = {
  setProject (state, project) {
    state.project = project
  }
}

export const actions = {
  refresh ({ state, dispatch }) {
    return dispatch('load', state.project.id)
  },
  async load ({ commit }, id) {
    const project = await this.$axios.$get(`${rest}/${id}`)
    commit('setProject', project)
  },
  async update (store, update) {
    await this.$axios.$put(`${rest}/${update.id}`, update.data)
  }
}
