import * as nativeViews from './native-views/index.js'
import * as makers from './native-views/makers.js'
import * as pseudoElements from './pseudo-elements/index.js'
import { createDocument, registerDOMElement, scope } from './dom.js'
import { makeTweakable } from './utils.js'
import { isNode } from 'undom-ng'

const registerElement = (key, val) => registerDOMElement(key, makeTweakable(makers.makeView(val)))
const aliasTagName = (nameHandler) => {
	for (let key of Object.keys(nativeViews)) scope[nameHandler(key)] = scope[key]
	for (let key of Object.keys(pseudoElements)) scope[nameHandler(key)] = scope[key]
}

for (let [key, val] of Object.entries(nativeViews)) {
	registerDOMElement(key, makeTweakable(val))
}

for (let [key, val] of Object.entries(pseudoElements)) {
	registerDOMElement(key, makeTweakable(val))
}

const document = createDocument()

const domImpl = {
	Node: scope.Node,
	document,
	isNode
}

// eslint-disable-next-line no-undef
const register = (_global = globalThis) => {
	if (!_global.window) _global.window = _global
	if (!_global.document) _global.document = document
	Object.assign(_global, scope)
}

export { domImpl, document, createDocument, nativeViews, pseudoElements, makers, registerElement, aliasTagName, registerDOMElement, scope, register }
