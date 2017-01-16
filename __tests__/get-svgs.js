import fs from 'fs'

export default ({ layers, path = __dirname }) => {
  const ret = {}

  layers.forEach(layer => {
    ret[layer] = fs.readFileSync(`${path}/${layer}.svg`, 'utf-8')
  })

  return ret
}
