export const handleNumericInput = (value: string, handle: Function) => {
  if (!/^[0-9., ]*$/.test(value)) {
    return
  }
  handle()
}
