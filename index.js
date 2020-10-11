// A babel plugin that lists imports
import babel from '@babel/core'

const code = `
import React from 'react'
export { default } from 'a'
export * from 'c'
var b = 'hallo'
import(b)
`
const imports = new Set()

babel.transformAsync(code, {
  plugins: [{
    visitor: {
      ImportDeclaration(path) {
        imports.add(path.node.source.value)
      },
      ExportNamedDeclaration(path) {
        if (path.node.source) {
          imports.add(path.node.source.value)
        }
      },
      ExportAllDeclaration(path) {
        imports.add(path.node.source.value)
      },
      CallExpression(path) {
        if (babel.types.isImport(path.node.callee)) {
          if (babel.types.isStringLiteral(path.node.arguments[0])) {
            imports.add(path.node.arguments[0].value)
          }
          else if (
            babel.types.isIdentifier(path.node.arguments[0]) &&
            path.scope.bindings[path.node.arguments[0].name].constant &&
            babel.types.isVariableDeclarator(path.scope.bindings[path.node.arguments[0].name].path.node) &&
            babel.types.isStringLiteral(path.scope.bindings[path.node.arguments[0].name].path.node.init)
          ) {
            imports.add(path.scope.bindings[path.node.arguments[0].name].path.node.init.value)
          }
        }
      }
    }
  }]
}).then(() => {
  console.log(imports)
})
