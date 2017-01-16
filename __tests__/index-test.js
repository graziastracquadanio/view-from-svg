import fromSvg from '../index.js'
import fs from 'fs'

const sources = [`${__dirname}/f.svg`, `${__dirname}/f2.svg`]

describe('fromSvg', () => {
  sources.forEach(file => {
    const raw = fs.readFileSync(file, 'utf-8')

    it(`${file}:\n${raw}`, () => {
      expect(fromSvg(raw)).toMatchSnapshot()
    })
    it(`${file} legacy:\n${raw}`, () => {
      expect(fromSvg(raw, true)).toMatchSnapshot()
    })
  })
})
