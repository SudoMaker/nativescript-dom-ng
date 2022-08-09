import * as nativeViews from './native-views/index.js'
import * as makers from './native-views/makers.js'
import * as pseudoElements from './pseudo-elements/index.js'
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
		} else if (this.nodeType === 3 && this.parentNode && this.parentNode.__isNative && this.parentNode.__dominative_isText) {
			this.parentNode.updateText()
		}
	},
	onCreateNode() {
		if (this.nodeType === 1 && this.__isNative) {
			// eslint-disable-next-line camelcase
			this.__dominative_eventHandlers = {}
		}
	},
	onInsertBefore(child, ref) {
		if (!this.__isNative && !this.__isPesudoElement) return
		while (ref && !ref.__isNative) ref = ref.nextSibling
		this.onInsertChild(child, ref)
		if (child.__isPesudoElement) child.onBeingInserted(this)
	},
	onRemoveChild(child) {
		if (!this.__isNative && !this.__isPesudoElement) return
		this.onRemoveChild(child)
		if (child.__isPesudoElement) child.onBeingRemoved(this)
	},
	onSetAttributeNS(ns, name, value) {
		if (!this.__isNative && !this.__isPesudoElement) return
		this.onSetAttributeNS(ns, name, value)
	},
	onGetAttributeNS(ns, name, updateValue) {
		if (!this.__isNative && !this.__isPesudoElement) return
		this.onGetAttributeNS(ns, name, updateValue)
	},
	onRemoveAttributeNS(ns, name) {
		if (!this.__isNative && !this.__isPesudoElement) return
		this.onRemoveAttributeNS(ns, name)
	},
	onAddEventListener(type, handler, options) {
		if (!this.__isNative) return
		if (options && options.efInternal && !this.__dominative_eventHandlers[type]) {
			this.__dominative_eventHandlers[type] = (data) => {
				const event = new scope.Event(type)
				event.data = data
				this.dispatchEvent(event)
			}
			this.onAddEventListener(type, this.__dominative_eventHandlers[type])
			return
		}
		this.onAddEventListener(type, handler, options)
		return true
	},
	onRemoveEventListener(type, handler, options) {
		if (!this.__isNative) return
		if (options && options.efInternal && this.__dominative_eventHandlers[type]) {
			if (this.__undom_eventHandlers[type] && !this.__undom_eventHandlers[type].length) {
				handler = this.__dominative_eventHandlers[type]
				delete this.__dominative_eventHandlers[type]
			}
		}
		this.onRemoveEventListener(type, handler, options)
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

export { document, domImpl, nativeViews, pseudoElements, makers, registerElement }
