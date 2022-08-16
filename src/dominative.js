import * as nativeViews from './native-views/index.js'
import * as makers from './native-views/makers.js'
import * as pseudoElements from './pseudo-elements/index.js'
import * as symbol from './symbols.js'
import { registerDOMElement, domImpl, document, scope } from './dom.js'

const registerElement = (key, val) => registerDOMElement(key, makers.makeView(val))
const aliasTagName = (nameHandler) => {
	for (let key of Object.keys(nativeViews)) scope[nameHandler(key)] = scope[key]
	for (let key of Object.keys(pseudoElements)) scope[nameHandler(key)] = scope[key]
}

for (let [key, val] of Object.entries(nativeViews)) {
	registerDOMElement(key, val)
}

for (let [key, val] of Object.entries(pseudoElements)) {
	registerDOMElement(key, val)
}

export { document, domImpl, nativeViews, pseudoElements, makers, registerElement, aliasTagName, symbol }
