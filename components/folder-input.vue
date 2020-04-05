<template>
  <b-field>
    <p class="control">
      <b-button
        title="Seleccionar carpeta"
        icon-right="folder"
        @click="leaveHer"
      />
    </p>
    <b-input
      :value="value"
      required
      expanded
      readonly
      placeholder="Seleccione una carpeta"
    />
  </b-field>
</template>

<script>
const { dialog } = require('electron').remote

export default {
  props: {
    value: { type: String, default: '' },
  },
  data: () => ({
    file: undefined,
  }),
  methods: {
    async leaveHer () {
      const folder = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
      })
      this.$emit('input',
        folder.filePaths.length === 0 ? undefined : folder.filePaths[0])
    },
  },
}
</script>
