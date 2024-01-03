import * as nativeViews from './native-views'
import * as virtualElements from './virtual-elements/index.js'
import { makeTweakable, ignoreOwnerDocument } from './utils.js'

import { scope, registerDOMElement } from './dom.js'

for (let [key, val] of Object.entries(virtualElements)) {
	registerDOMElement(key, makeTweakable(ignoreOwnerDocument(val)))
}

const registerAllElements = () => {
	for (let [key, val] of Object.entries(nativeViews)) {
		if (!scope[key]) registerDOMElement(key, makeTweakable(val))
	}
}

export default registerAllElements
