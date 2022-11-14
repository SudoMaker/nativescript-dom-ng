import * as nativeViews from './native-views'
import { makeTweakable } from './utils.js'

import { scope, registerDOMElement } from './dom.js'

const registerAllElements = () => {
	for (let i in nativeViews) {
		if (!scope[i]) registerDOMElement(i, makeTweakable(nativeViews[i]))
	}
}

export default registerAllElements
