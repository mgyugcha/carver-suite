<template>
  <form @submit.prevent="onSubmit">
    <h3 class="title">
      Informe de estado de dispositivo
    </h3>
    <div class="content">
      Ingrese el título del proyecto, los datos de ingreso y cuando el
      proceso de clasificación de datos haya terminado puede llenar
      los datos de entrega. Esta información servirá para generar
      un <b>informe</b> al final del proceso.
    </div>
    <div class="columns">
      <div class="column">
        <b-field label="Título del proyecto">
          <b-input
            v-model="data.titulo"
            placeholder="Ingrese el título del proyecto"
            required
          />
        </b-field>
      </div>
    </div>
    <h3 class="title is-4">
      Datos de ingreso
    </h3>
    <div class="columns">
      <div class="column">
        <b-field label="Nombre del propietario">
          <b-input
            v-model="data.propietario"
            placeholder="Ingrese el nombre del propietario"
          />
        </b-field>
      </div>
      <div class="column">
        <b-field
          label="Fecha de ingreso"
        >
          <b-datepicker
            v-model="data.fechaDeIngreso"
            placeholder="Seleccione la fecha de ingreso"
            icon="calendar-today"
          />
        </b-field>
      </div>
      <div class="column">
        <b-field
          label="Hora de ingreso"
        >
          <b-timepicker
            v-model="data.horaDeIngreso"
            placeholder="Seleccione la hora de ingreso"
            icon="clock"
          />
        </b-field>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <b-field label="Diagnóstico express">
          <b-input
            v-model="data.diagnosticoExpress"
            type="textarea"
            placeholder="Describa una breve reseña del estado de ingreso del dispositivo"
          />
        </b-field>
      </div>
      <div class="column">
        <b-field label="Requerimiento del usuario">
          <b-input
            v-model="data.requerimientosDelUsuario"
            type="textarea"
            placeholder="Describa en una o mas lineas cuales son los requerimientos del usuario"
          />
        </b-field>
      </div>
    </div>

    <h3 class="title is-4">
      Datos de entrega
    </h3>
    <div class="columns">
      <div class="column">
        <b-field label="Nombre del especialista">
          <b-input
            v-model="data.especialista"
            placeholder="Especialista que atendió el requerimiento"
          />
        </b-field>
      </div>
      <div class="column">
        <b-field
          label="Fecha de entrega"
        >
          <b-datepicker
            v-model="data.fechaDeEntrega"
            placeholder="Seleccione la fecha de entrega"
            icon="calendar-today"
          />
        </b-field>
      </div>
      <div class="column">
        <b-field
          label="Hora de entrega"
        >
          <b-timepicker
            v-model="data.horaDeEntrega"
            placeholder="Seleccione la hora de entrega"
            icon="clock"
          />
        </b-field>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <b-field label="Novedades finales">
          <b-input
            v-model="data.novedadesFinales"
            placeholder="Ingrese las novedades finales"
            type="textarea"
          />
        </b-field>
      </div>
      <div class="column">
        <b-field label="Observaciones finales">
          <b-input
            v-model="data.observacionesFinales"
            placeholder="Ingrese las observaciones finales"
            type="textarea"
          />
        </b-field>
      </div>
    </div>
    <div class="buttons">
      <button class="button is-dark">
        Guardar
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data: () => ({
    data: { },
  }),
  async created () {
    try {
      await this.$store.dispatch('load', this.$route.params.id)
      const tmp = JSON.parse(JSON.stringify(this.$store.state.project))
      if (tmp.fechaDeIngreso) tmp.fechaDeIngreso = new Date(tmp.fechaDeIngreso)
      if (tmp.horaDeIngreso) tmp.horaDeIngreso = new Date(tmp.horaDeIngreso)
      if (tmp.fechaDeEntrega) tmp.fechaDeEntrega = new Date(tmp.fechaDeEntrega)
      if (tmp.horaDeEntrega) tmp.horaDeEntrega = new Date(tmp.horaDeEntrega)
      this.data = tmp
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    async onSubmit () {
      try {
        await this.$store.dispatch('update', {
          id: this.$route.params.id, data: this.data
        })
        this.$toast.open('Se guardó correctamente')
        await this.$store.dispatch('refresh')
      } catch (err) {
        this.$toast.open({ message: err.message, type: 'is-danger' })
      }
    },
  },
}
</script>
