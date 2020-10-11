import { PluginObj } from '@babel/core'
import EventEmitter from 'eventemitter3'

interface Events {
  list: () => void;
}

interface ImportLister extends EventEmitter<Events> {
  plugin: PluginObj;
  state: Set<string>;
}

function createImportLister(): ImportLister;

export default createImportLister
