import { createDocument, registerElement, registerDOMElement, aliasTagName, scope } from './dom.js'
import { makeTweakable } from './utils.js'
import { globals } from './globals.js'
import { isNode } from 'undom-ng'

import registerAllElements from './register-all.js'

const document = createDocument()

const domImpl = {
	Node: scope.Node,
	document,
	isNode
}

globals.domImpl = domImpl
globals.document = document
globals.scope = scope

// eslint-disable-next-line no-undef
const globalRegister = (_global = globalThis) => {
	if (!_global.window) _global.window = _global
	if (!_global.document) _global.document = document
	Object.assign(_global, scope)
}

// Register all elements if tree shaking is not enabled explicitly
// eslint-disable-next-line no-negated-condition, no-undef
if (typeof __UI_USE_EXTERNAL_RENDERER__ !== 'undefined' && !__UI_USE_EXTERNAL_RENDERER__) {
	registerAllElements()
} else if (process.env.NODE_ENV !== 'production') {
	console.warn('[DOMiNATIVE] Tree shaking is enabled! Make sure to register {N} core elements manually! See https://github.com/SudoMaker/DOMiNATIVE#tree-shaking for details.')
}

export { domImpl, document, createDocument, registerElement, aliasTagName, registerDOMElement, registerAllElements, scope, globalRegister, makeTweakable }
export * from './native-views/makers.js'
export * from './native-views'
export * from './pseudo-elements'
