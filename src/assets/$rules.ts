import { Rule } from 'antd/lib/form'

const pattern = (
  patron: RegExp,
  message = 'No se cumple el formato requerido'
): Rule => ({
  pattern: patron,
  message,
})

const $rules = {
  required: (message = 'El campo es requerido'): Rule => ({
    required: true,
    message,
  }),
  min: (
    length: number,
    message = `Debe tener mínimo ${length.toString()} caracteres`
  ): Rule => ({
    min: length,
    message,
  }),
  max: (
    length: number,
    message = `Debe tener máximo ${length.toString()} caracteres`
  ): Rule => ({
    max: length,
    message,
  }),
  email: (message = 'El correo electrónico no es válido'): Rule => ({
    type: 'email',
    message,
  }),
  pattern,
}

export default $rules
