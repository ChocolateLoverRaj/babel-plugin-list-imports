import generate from 'common-ignore'
import { dirname } from 'dirname-filename-esm'

const __dirname = dirname(import.meta)

console.log('Generating')
console.time('generate')
generate({
  inputDir: './',
  outputDir: '../',
  files: {
    'git.txt': {
      extends: [],
      output: '.gitignore'
    },
    'npm.txt': {
      extends: ['git.txt'],
      output: '.npmignore'
    }
  }
}, __dirname)
  .then(console.timeEnd.bind(undefined, 'generate'))
  .catch(e => { throw e })
