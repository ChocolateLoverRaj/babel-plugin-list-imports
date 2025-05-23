> [!WARNING]  
> I no longer use or maintain this library. I don't really code in JavaScript anymore (I switched to Rust). If you want to maintain or fork it let me know and I can put the link here.

# babel-plugin-list-imports
Lists the files imported by a ESModule file.

## Install
```bash
npm i babel-plugin-list-imports
```

## Using
```javascript
import babel from '@babel/core'
import createImportLister from 'babel-plugin-list-imports'

// Create the plugin
const importLister = createImportLister() // EventEmitter { plugin: [Plugin], state: [Set] }

// Example code, demonstrates all recognized imports
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

// Use the plugin

// You don't need to wait for other plugins to run before accessing the imports
// You can listen for the 'list' event
importLister.once('list', () => {
  // You can get the [Set] of imports with the state property
  console.log(importLister.state) 
  /* Set { 
    'react', 
    './some-utils.js',
    'side-effects.js',
    './styles.css',
    'some-lib',
    './source.js',
    './another-source.js',
    'dynamic',
    './tool.js',
    '../path/to/import.js',
    'string-literal'
  } */

  // If you are going to reuse this plugin, remember to reset the state
  importLister.state.clear()
})

// This example does transformAsync
babel.transformAsync(code, { plugins: [importLister.plugin] })
