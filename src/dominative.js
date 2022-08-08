import * as nativeViews from './native-views/index.js'
import * as makers from './native-views/makers.js'
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
	onCreateNode(nodeType) {
		if (nodeType === 1) {
			// eslint-disable-next-line camelcase
			this.__dominative_eventHandlers = {}
		}
	},
	onInsertBefore(child, ref) {
		if (!this.__isNative) return
		while (ref && !ref.__isNative) ref = ref.nextSibling
		this.onInsertChild(child, ref)
	},
	onRemoveChild(child) {
		if (!this.__isNative) return
		this.onRemoveChild(child)
	},
	onSetAttributeNS(ns, name, value) {
		if (!this.__isNative) return
		this.onSetAttributeNS(ns, name, value)
	},
	onGetAttributeNS(ns, name, updateValue) {
		if (!this.__isNative) return
		this.onGetAttributeNS(ns, name, updateValue)
	},
	onRemoveAttributeNS(ns, name) {
		if (!this.__isNative) return
		this.onRemoveAttributeNS(ns, name)
	},
	onAddEventListener(type, handler, options) {
		if (!this.__isNative) return
		if (options && options.efInternal && !this.__dominative_eventHandlers[type]) {
			this.__dominative_eventHandlers[type] = () => this.dispatchEvent(new scope.Event(type))
			this.onAddEventListener(type, this.__dominative_eventHandlers[type])
			return
		}
		this.onAddEventListener(type, handler)
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
		this.onRemoveEventListener(type, handler)
	}
})

for (let [key, val] of Object.entries(nativeViews)) {
	registerElement(key, val)
}

const document = createDocument()

const domImpl = {
	Node: scope.Node,
	document,
	isNode
}

export { document, domImpl, nativeViews, makers }
