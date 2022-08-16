import { resolvePath } from '../utils.js'
import * as symbol from '../symbols.js'

export class PseudoBase {
	/* eslint-disable class-methods-use-this, no-empty-function */
	constructor() {
		this[symbol.isPseudoElement] = true
	}

	[symbol.onInsertChild]() {}
	[symbol.onRemoveChild]() {}

	[symbol.onBeingInserted]() {}
	[symbol.onBeingRemoved]() {}

	[symbol.onSetAttributeNS](ns, name, value) {
		if (ns) return
		const [base, key] = resolvePath(name, this)
		base[key] = value
	}

	[symbol.onGetAttributeNS](ns, name, updateValue) {
		if (ns) return
		const [base, key] = resolvePath(name, this)
		updateValue(base[key])
	}

	[symbol.onRemoveAttributeNS](ns, name) {
		// eslint-disable-next-line no-void
		this.setAttributeNS(ns, name, void(0))
	}
}
