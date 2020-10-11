/* global test, expect */

import createImportLister from './index.js'
import babel from '@babel/core'

test('README.md example', async () => {
  const importLister = createImportLister()

  const code = `
// Normal default and named imports
import React from 'react'
import { niceTool, helper as someHelper } from './some-utils.js'

// Importing for side effects only
import 'side-effects.js'

// Extension doesn't matter
import styles from './styles.css'

// Importing all as namespace
import * as namespaceImport from 'some-lib'

// Exporting from source
export { default as something } from './source.js'

// Exporting everything from a source
export * from './another-source.js'

// Dynamic imports
import('dynamic')

// Dynamic imports referencing an unchanged variable
const dynamicSrc = './tool.js'
var unchangedDynamicSrc = '../path/to/import.js'

import(dynamicSrc)
import(unchangedDynamicSrc)

// Non top-level dynamic imports
document.getElementById('load-button').addEventListener('click', () => {
  import('string-literal')
  import(dynamicSrc)
  import(unchangedDynamicSrc)
})
`
  importLister.once('list', () => {
    expect(importLister.state).toMatchSnapshot()

    importLister.state.clear()
    expect(importLister.state.size).toBe(0)
  })

  babel.transformAsync(code, { plugins: [importLister.plugin] })
})
