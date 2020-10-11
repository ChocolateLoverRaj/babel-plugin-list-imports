// A babel plugin that lists imports
import babel from '@babel/core'
import EventEmitter from 'eventemitter3'

const createImportLister = () => {
  const ev = new EventEmitter()

  ev.state = new Set()

  ev.plugin = {
    visitor: {
      ImportDeclaration (path) {
        ev.state.add(path.node.source.value)
      },
      ExportNamedDeclaration (path) {
        if (path.node.source) {
          ev.state.add(path.node.source.value)
        }
      },
      ExportAllDeclaration (path) {
        ev.state.add(path.node.source.value)
      },
      CallExpression (path) {
        if (babel.types.isImport(path.node.callee)) {
          const arg = path.node.arguments[0]
          if (babel.types.isStringLiteral(arg)) {
            ev.state.add(arg.value)
          } else if (babel.types.isIdentifier(arg)) {
            const getBinding = scope => scope.bindings[arg.name] || getBinding(scope.parent)
            const binding = getBinding(path.scope)
            if (
              binding.constant &&
              babel.types.isVariableDeclarator(binding.path.node) &&
              babel.types.isStringLiteral(binding.path.node.init)
            ) {
              ev.state.add(binding.path.node.init.value)
            }
          }
        }
      }
    },
    post () {
      ev.emit('list')
    }
  }

  return ev
}

export default createImportLister
