import { App } from 'antd'
import { AxiosError } from 'axios'

export async function getMensajeError(err: any) {
  const result: string | Blob = err.response?.data
    ? err.response.data?.message || err.response.data
    : err.message
  if (result instanceof Blob) {
    try {
      const error = JSON.parse(await result.text())
      return error.message
    } catch {
      return result.text()
    }
  }
  return result
}

export function useUtils() {
  const { modal } = App.useApp()

  const showError = async (
    err: unknown,
    { title = 'Proceso fallido' } = {}
  ) => {
    const content = await getMensajeError(err as AxiosError)
    console.error(err)
    modal.error({
      title,
      width: 450,
      content: content,
      okType: 'danger',
    })
  }

  return {
    showError,
  }
}
