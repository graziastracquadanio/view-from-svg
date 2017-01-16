import { html2json } from 'html2json'
import deasync from 'deasync'
import flatten from 'flatten'
import SvgOptimiser from 'svgo'
import toCamelCase from 'to-camel-case'
import toPascalCase from 'to-pascal-case'

const getGroupType = layers => {
  if (has('MSShapePathLayer', layers)) {
    return 'Svg'
  } else if (has('MSRectangleShape', layers)) {
    return false
  }
}

const getAttrs = (attr, legacy) => (
  Object.keys(attr).filter(a => a !== 'xmlns').map(prop => {
    let value = attr[prop]
    if (Array.isArray(value)) {
      value = value.join(' ')
    }
    return `${toCamelCase(prop)}${legacy ? ':' : ''} ${value}`
  })
)

const getBlock = (raw, legacy) => {
  const name = toPascalCase(raw)
  return legacy ? `- block: ${name}` : name
}

const IGNORE = [
  'title',
  'desc',
]

const indent = lines => (
  lines.map(l => Array.isArray(l) ? indent(l) : `  ${l}`)
)

const parseSvg = ({ attr, child, tag }, legacy) => {
  const s = []

  if (!tag || IGNORE.includes(tag.toLowerCase())) return false

  s.push(getBlock(tag, legacy))
  if (attr) {
    const attrs = getAttrs(attr, legacy)
    s.push(legacy ? indent(attrs) : attrs)
  }
  if (child) {
    if (legacy) s.push('  blocks:')

    s.push(child.map(c => {
      const parsed = parseSvg(c, legacy)
      return parsed && [legacy ? indent(parsed) : parsed, '']
    }))
  }

  return s
}

const svgo = new SvgOptimiser()
export default (raw, legacy=false) => {
  let text
  let done = false
  svgo.optimize(raw, res => {
    text = res.data
    done = true
  })
  deasync.loopWhile(() => !done)

  return flatten(parseSvg(html2json(text).child[0], legacy)).filter(l => l !== false).join('\n')
}
