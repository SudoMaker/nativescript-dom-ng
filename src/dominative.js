import * as nativeViews from './native-views/index.js'
import * as makers from './native-views/makers.js'
import * as pseudoElements from './pseudo-elements/index.js'
import * as symbol from './symbols.js'
import {createEnvironment, isNode} from '@utls/undom-ef'

/*
const NODE_TYPES = {
	ELEMENT_NODE: 1,
	ATTRIBUTE_NODE: 2,
	TEXT_NODE: 3,
	CDATA_SECTION_NODE: 4,
	ENTITY_REFERENCE_NODE: 5,
	PROCESSING_INSTRUCTION_NODE: 7,
	COMMENT_NODE: 8,
	DOCUMENT_NODE: 9
}
*/

const silent = false

const {scope, createDocument, registerElement} = createEnvironment({
	silent,
	createBasicElements: false,
	preserveClassNameOnRegister: true,
	onSetData(data) {
		if (this.nodeType === 8) {
			if (!silent) console.log('[DOM COMMENT]', data)
		} else if (this.nodeType === 3 && this.parentNode && this.parentNode[symbol.isNative] && this.parentNode.__dominative_isText) {
			this.parentNode[symbol.updateText]()
		}
	},
	onCreateNode() {
		if (this.nodeType === 1 && this[symbol.isNative]) {
			// eslint-disable-next-line camelcase
			this[symbol.eventHandlers] = {}
		}
	},
	onInsertBefore(child, ref) {
		if (!this[symbol.isNative] && !this[symbol.isPseudoElement]) return
		if (ref) {
			const childNodes = ref.parentNode.childNodes
			let refIndex = childNodes.indexOf(ref)
			while (ref && !ref[symbol.isNative]) {
				refIndex += 1
				ref = childNodes[refIndex]
			}
			if (!ref) ref = null
		}
		this[symbol.onInsertChild](child, ref)
		if (child[symbol.isPseudoElement]) child[symbol.onBeingInserted](this)
	},
	onRemoveChild(child) {
		if (!this[symbol.isNative] && !this[symbol.isPseudoElement]) return
		this[symbol.onRemoveChild](child)
		if (child[symbol.isPseudoElement]) child[symbol.onBeingRemoved](this)
	},
	onSetAttributeNS(ns, name, value) {
		if (!this[symbol.isNative] && !this[symbol.isPseudoElement]) return
		this[symbol.onSetAttributeNS](ns, name, value)
	},
	onGetAttributeNS(ns, name, updateValue) {
		if (!this[symbol.isNative] && !this[symbol.isPseudoElement]) return
		this[symbol.onGetAttributeNS](ns, name, updateValue)
	},
	onRemoveAttributeNS(ns, name) {
		if (!this[symbol.isNative] && !this[symbol.isPseudoElement]) return
		this[symbol.onRemoveAttributeNS](ns, name)
	},
	onAddEventListener(type, handler, options) {
		if (!this[symbol.isNative]) return
		if (options && options.mode === 'DOM' && !this[symbol.eventHandlers][type]) {
			this[symbol.eventHandlers][type] = function(data) {
				let target = data.object
				while (target && !target.__undom_isNode) target = target.parent
				if (!target) return
				const event = new scope.Event(type)
				event.data = data
				target.dispatchEvent(event)
			}
			this[symbol.onAddEventListener](type, this[symbol.eventHandlers][type])
			return
		}
		this[symbol.onAddEventListener](type, handler, options)
		return true
	},
	onRemoveEventListener(type, handler, options) {
		if (!this[symbol.isNative]) return
		if (options && options.mode === 'DOM' && this[symbol.eventHandlers][type]) {
			if (this.__undom_eventHandlers[type] && !this.__undom_eventHandlers[type].length) {
				handler = this[symbol.eventHandlers][type]
				delete this[symbol.eventHandlers][type]
			}
		}
		this[symbol.onRemoveEventListener](type, handler, options)
	}
})

for (let [key, val] of Object.entries(nativeViews)) {
	registerElement(key, val)
}

for (let [key, val] of Object.entries(pseudoElements)) {
	registerElement(key, val)
}

const document = createDocument()

const domImpl = {
	Node: scope.Node,
	document,
	isNode
}

export { document, domImpl, nativeViews, pseudoElements, makers, registerElement, symbol }
