<template>
  <form @submit.prevent="enviar">
    <h3 class="title">
      Formulario
    </h3>
    <div class="content">
      Contestar el siguiente formulario le ayudará a identificar cuál
      es el <b>carver</b> que puede recuperar la mayor cantidad de
      datos de acuerdo al tipo de daño del dispositivo de
      almacenamiento.
    </div>
    <div class="columns is-multiline">
      <div class="column is-12">
        <div class="field">
          <b-switch v-model="hasCaida">
            ¿Su disco ha sufrido alguna caída?
          </b-switch>
        </div>
        <b-field
          v-if="hasCaida"
          label="¿Desde que escenario podría ser la caída?"
        >
          <b-select
            v-model="selected"
            placeholder="Seleccione el escenario"
            required
            expanded
          >
            <option :value="escritorio">
              Escritorio
            </option>
            <option :value="librero">
              Librero
            </option>
            <option :value="piso2">
              Segundo Piso
            </option>
            <option :value="piso3">
              Tercer Piso
            </option>
            <option :value="piso4">
              Cuarto Piso
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="column is-12">
        <div class="field">
          <b-switch v-model="hasImpacto">
            ¿Su disco ha sufrido daño por aplastamiento o impacto?
          </b-switch>
        </div>
        <b-field
          v-if="hasImpacto"
          label="La fuerza de aplazmiento es similar a un:"
        >
          <b-select
            v-model="selected1"
            placeholder="Seleccione un tipo de aplaztamiento"
            required
            expanded
          >
            <option :value="vliviano">
              Vehículo Liviano
            </option>
            <option :value="vmediano">
              Vehículo Mediano
            </option>
            <option :value="vpesado">
              Vehículo Pesado
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="column is-12">
        <div class="field">
          <b-switch v-model="hasHumedad">
            ¿Su disco ha estado en contacto con el humedecimiento o
            derrame de líquidos?
          </b-switch>
        </div>
        <b-field
          v-if="hasHumedad"
          label="¿Cuánto tiempo ha permanecido humedecido el disco?"
        >
          <b-select
            v-model="selected2"
            placeholder="Seleccione el tiempo de humedecimiento"
            required
            expanded
          >
            <option :value="seg10">
              10 Segundos
            </option>
            <option :value="seg30">
              30 Segundos
            </option>
            <option :value="seg65">
              65 Segundos
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="column is-12">
        <div class="field">
          <b-switch v-model="hasVoltaje">
            ¿Su disco ha recibido mayor voltaje de lo normal?
          </b-switch>
        </div>
        <b-field
          v-if="hasVoltaje"
          label="¿Cuál es el voltaje que ha recibido?"
        >
          <b-select
            v-model="selected3"
            placeholder="Seleccione el voltaje recibido"
            required
            expanded
          >
            <option :value="volt6">
              6 Voltios
            </option>
            <option :value="volt7">
              7 Voltios
            </option>
            <option :value="volt8">
              8 Voltios
            </option>
            <option :value="volt9">
              9 Voltios
            </option>
            <option :value="volt12">
              12 Voltios
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="column is-12">
        <div class="field">
          <b-switch v-model="hasMagnetizmo">
            ¿Su disco ha sufrido procesos de magnetización?
          </b-switch>
        </div>
        <b-field
          v-if="hasMagnetizmo"
          label="¿Que tiempo ha estado su disco en el campo magnético?"
        >
          <b-select
            v-model="selected4"
            placeholder="Seleccione el tiempo de magnetización"
            required
            expanded
          >
            <option :value="seg10m">
              10 Segundos
            </option>
            <option :value="seg15m">
              15 Segundos
            </option>
            <option :value="seg20m">
              20 Segundos
            </option>
          </b-select>
        </b-field>
      </div>
    </div>
    <div class="buttons is-right">
      <button class="button is-dark">
        Enviar
      </button>
      <button
        class="button"
        type="button"
        @click="hasCaida = false, hasHumedad = false, hasMagnetizmo =false, hasVoltaje = false, hasImpacto = false"
      >
        Limpiar formulario
      </button>
    </div>
    <div class="column is-4 is-offset-4">
      <div class="control">
        <p class="control">
          Foremost:  {{ valorfores }}
        </p>
        <progress id="profo" class="progress is-primary" :value="valorfores" max="100" :show-label="true" />
      </div>
      <br>
      <br>
      <div class="control">
        <p class="control">
          Scalpel: {{ valorscalpel }}
        </p>
        <progress class="progress is-danger" :value="valorscalpel" max="100" />
      </div>
    </div>
  </form>
</template>

<script>
import * as bayes from '@/assets/bayes'

export default {
  data: () => ({
    questions: {},
    hasCaida: false,
    hasHumedad: false,
    hasMagnetizmo: false,
    hasVoltaje: false,
    hasImpacto: false,
    valorfores: '',
    valorscalpel: '',
    escritorio: bayes.escritorio,
    librero: bayes.librero,
    piso2: bayes.piso2,
    piso3: bayes.piso3,
    piso4: bayes.piso4,
    vliviano: bayes.cLiviano,
    vmediano: bayes.cMediano,
    vpesado: bayes.cPesado,
    seg10: bayes.seg10,
    seg30: bayes.seg30,
    seg65: bayes.seg65,
    volt6: bayes.volt6,
    volt7: bayes.volt7,
    volt8: bayes.volt8,
    volt9: bayes.volt9,
    volt12: bayes.volt12,
    seg10m: bayes.seg10m,
    seg15m: bayes.seg15m,
    seg20m: bayes.seg20m,
    selected: undefined,
    selected1: undefined,
    selected2: undefined,
    selected3: undefined,
    selected4: undefined,
  }),
  methods: {
    enviar: function () {
      const seleccionado = this.hasCaida ? this.selected : undefined
      const seleccionado1 = this.hasImpacto ? this.selected1 : undefined
      const seleccionado2 = this.hasHumedad ? this.selected2 : undefined
      const seleccionado3 = this.hasVoltaje ? this.selected3 : undefined
      const seleccionado4 = this.hasMagnetizmo ? this.selected4 : undefined
      if (seleccionado && seleccionado1) {
        console.log(bayes.inferir2(seleccionado, seleccionado1))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado, seleccionado1).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado, seleccionado1).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado2) {
        console.log(bayes.inferir2(seleccionado, seleccionado2))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado, seleccionado2).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado, seleccionado2).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado3) {
        console.log(bayes.inferir2(seleccionado, seleccionado3))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado, seleccionado3).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado, seleccionado3).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado4) {
        console.log(bayes.inferir2(seleccionado, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado1 && seleccionado2) {
        console.log(bayes.inferir2(seleccionado1, seleccionado2))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado1, seleccionado2).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado1, seleccionado2).valorS * 100).toFixed(2))
      } else if (seleccionado1 && seleccionado3) {
        console.log(bayes.inferir2(seleccionado1, seleccionado3))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado1, seleccionado3).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado1, seleccionado3).valorS * 100).toFixed(2))
      } else if (seleccionado1 && seleccionado4) {
        console.log(bayes.inferir2(seleccionado1, seleccionado4))
      } else if (seleccionado2 && seleccionado3) {
        console.log(bayes.inferir2(seleccionado2, seleccionado3))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado2, seleccionado3).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado2, seleccionado3).valorS * 100).toFixed(2))
      } else if (seleccionado2 && seleccionado4) {
        console.log(bayes.inferir2(seleccionado2, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado2, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado2, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado3 && seleccionado4) {
        console.log(bayes.inferir2(seleccionado3, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir2(seleccionado3, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir2(seleccionado3, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado1 && seleccionado2) {
        console.log(bayes.inferir3(seleccionado, seleccionado1, seleccionado2))
        this.valorfores = parseFloat((bayes.inferir3(seleccionado, seleccionado1, seleccionado2).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir3(seleccionado, seleccionado1, seleccionado2).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado1 && seleccionado3) {
        console.log(bayes.inferir3(seleccionado, seleccionado1, seleccionado3))
        this.valorfores = parseFloat((bayes.inferir3(seleccionado, seleccionado1, seleccionado3).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir3(seleccionado, seleccionado1, seleccionado3).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado1 && seleccionado4) {
        console.log(bayes.inferir3(seleccionado, seleccionado1, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir3(seleccionado, seleccionado1, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir3(seleccionado, seleccionado1, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado1 && seleccionado2 && seleccionado3) {
        console.log(bayes.inferir3(seleccionado1, seleccionado2, seleccionado3))
        this.valorfores = parseFloat((bayes.inferir3(seleccionado1, seleccionado2, seleccionado3).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir3(seleccionado1, seleccionado2, seleccionado3).valorS * 100).toFixed(2))
      } else if (seleccionado1 && seleccionado2 && seleccionado4) {
        console.log(bayes.inferir3(seleccionado1, seleccionado2, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir3(seleccionado1, seleccionado2, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir3(seleccionado1, seleccionado2, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado2 && seleccionado3 && seleccionado4) {
        console.log(bayes.inferir3(seleccionado2, seleccionado3, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir3(seleccionado2, seleccionado3, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir3(seleccionado2, seleccionado3, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado1 && seleccionado2 && seleccionado3) {
        console.log(bayes.inferir4(seleccionado, seleccionado1, seleccionado2, seleccionado3))
        this.valorfores = parseFloat((bayes.inferir4(seleccionado, seleccionado1, seleccionado2, seleccionado3).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir4(seleccionado, seleccionado1, seleccionado2, seleccionado3).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado1 && seleccionado2 && seleccionado4) {
        console.log(bayes.inferir4(seleccionado, seleccionado1, seleccionado2, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir4(seleccionado, seleccionado1, seleccionado2, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir4(seleccionado, seleccionado1, seleccionado2, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado1 && seleccionado2 && seleccionado3 && seleccionado4) {
        console.log(bayes.inferir4(seleccionado1, seleccionado2, seleccionado3, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir4(seleccionado1, seleccionado2, seleccionado3, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir4(seleccionado1, seleccionado2, seleccionado3, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado && seleccionado1 && seleccionado2 && seleccionado3 && seleccionado4) {
        console.log(bayes.inferir5(seleccionado, seleccionado1, seleccionado2, seleccionado3, seleccionado4))
        this.valorfores = parseFloat((bayes.inferir5(seleccionado, seleccionado1, seleccionado2, seleccionado3, seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir5(seleccionado, seleccionado1, seleccionado2, seleccionado3, seleccionado4).valorS * 100).toFixed(2))
      } else if (seleccionado) {
        console.log(bayes.inferir(seleccionado))
        this.valorfores = parseFloat((bayes.inferir(seleccionado).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir(seleccionado).valorS * 100).toFixed(2))
      } else if (seleccionado1) {
        console.log(bayes.inferir(seleccionado1))
        this.valorfores = parseFloat((bayes.inferir(seleccionado1).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir(seleccionado1).valorS * 100).toFixed(2))
      } else if (seleccionado2) {
        console.log(bayes.inferir(seleccionado2))
        this.valorfores = parseFloat((bayes.inferir(seleccionado2).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir(seleccionado2).valorS * 100).toFixed(2))
      } else if (seleccionado3) {
        console.log(bayes.inferir(seleccionado3))
        this.valorfores = parseFloat((bayes.inferir(seleccionado3).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir(seleccionado3).valorS * 100).toFixed(2))
      } else if (seleccionado4) {
        console.log(bayes.inferir(seleccionado4))
        this.valorfores = parseFloat((bayes.inferir(seleccionado4).valorF * 100).toFixed(2))
        this.valorscalpel = parseFloat((bayes.inferir(seleccionado4).valorS * 100).toFixed(2))
      }
    }
  }
}
</script>
