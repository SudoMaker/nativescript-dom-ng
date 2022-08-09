import { resolvePath } from '../utils.js'

export class PseudoBase {
	/* eslint-disable class-methods-use-this, no-empty-function */
	constructor() {
		this.__isPesudoElement = true
	}

	onInsertChild() {}
	onRemoveChild() {}

	onBeingInserted() {}
	onBeingRemoved() {}

	onSetAttributeNS(ns, name, value) {
		if (ns) return
		const [base, key] = resolvePath(name, this)
		base[key] = value
	}

	onGetAttributeNS(ns, name, updateValue) {
		if (ns) return
		const [base, key] = resolvePath(name, this)
		updateValue(base[key])
	}

	onRemoveAttributeNS(ns, name) {
		// eslint-disable-next-line no-void
		this.setAttributeNS(ns, name, void(0))
	}
}
