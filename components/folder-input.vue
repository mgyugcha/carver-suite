<template>
  <b-field>
    <p class="control">
      <b-upload
        v-model="file"
        :required="!value"
        webkitdirectory
        @input="input"
      >
        <a class="button">
          <b-icon icon="folder" />
        </a>
      </b-upload>
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
export default {
  props: {
    value: { type: String, default: '' },
  },
  data: () => ({
    file: undefined,
  }),
  methods: {
    input () {
      this.$emit('input', this.file ? this.file.path : '')
    },
  },
}
</script>
