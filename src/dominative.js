import { createDocument, registerElement, registerDOMElement, aliasTagName, scope } from './dom.js'
import { makeTweakable } from './utils.js'
import { isNode } from 'undom-ng'

import registerAllElements from './register-all.js'

const document = createDocument()

const domImpl = {
	Node: scope.Node,
	document,
	isNode
}

// eslint-disable-next-line no-undef
const globalRegister = (_global = globalThis) => {
	if (!_global.window) _global.window = _global
	if (!_global.document) _global.document = document
	Object.assign(_global, scope)
}

// Register all elements if not explicitly marked tree shaken
// eslint-disable-next-line no-undef
if (typeof __UI_USE_EXTERNAL_RENDERER__ !== 'undefined' && !__UI_USE_EXTERNAL_RENDERER__) registerAllElements()

export { domImpl, document, createDocument, registerElement, aliasTagName, registerDOMElement, registerAllElements, scope, globalRegister, makeTweakable }
export * from './native-views/makers.js'
export * from './native-views'
export * from './pseudo-elements'
