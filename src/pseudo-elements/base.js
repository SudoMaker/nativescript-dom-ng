import { resolvePath } from '../utils.js'

export class PseudoBase {
	/* eslint-disable class-methods-use-this, no-empty-function */
	constructor() {
		this.__dominative_isPseudoElement = true
	}

	__dominative_onInsertChild() {}
	__dominative_onRemoveChild() {}

	__dominative_onBeingInserted() {}
	__dominative_onBeingRemoved() {}

	__dominative_onSetAttributeNS(ns, name, value) {
		if (ns) return
		const [base, key] = resolvePath(name, this)
		base[key] = value
	}

	__dominative_onGetAttributeNS(ns, name, updateValue) {
		if (ns) return
		const [base, key] = resolvePath(name, this)
		updateValue(base[key])
	}

	__dominative_onRemoveAttributeNS(ns, name) {
		// eslint-disable-next-line no-void
		this.setAttributeNS(ns, name, void(0))
	}
}
