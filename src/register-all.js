import * as nativeViews from './native-views'
import * as pseudoElements from './pseudo-elements/index.js'
import { makeTweakable } from './utils.js'

import { scope, registerDOMElement } from './dom.js'

for (let [key, val] of Object.entries(pseudoElements)) {
	registerDOMElement(key, makeTweakable(val))
}

const registerAllElements = () => {
	for (let [key, val] of Object.entries(nativeViews)) {
		if (!scope[key]) registerDOMElement(key, makeTweakable(val))
	}
}

export default registerAllElements
