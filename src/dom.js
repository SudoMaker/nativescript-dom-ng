import { createEnvironment, isNode } from '@utls/undom-ef'

/*
const NODE_TYPES = {
	ELEMENT_NODE: 1,
	ATTRIBUTE_NODE: 2,
	TEXT_NODE: 3,
	CDATA_SECTION_NODE: 4,
	ENTITY_REFERENCE_NODE: 5,
	PROCESSING_INSTRUCTION_NODE: 7,
	COMMENT_NODE: 8,
	DOCUMENT_NODE: 9,
	DOCUMENT_FRAGMENT: 11
}
*/

const silent = process.env.NODE_ENV === 'production'

const {scope, createDocument, registerElement: registerDOMElement} = createEnvironment({
	silent,
	createBasicElements: false,
	preserveClassNameOnRegister: true,
	onSetData(data) {
		if (this.nodeType === 8) {
			if (!silent) console.log('[DOMiNATIVE][DOM COMMENT]', data)
		} else if (this.nodeType === 3 && this.parentNode && this.parentNode.__dominative_isNative && this.parentNode.__dominative_is_Text) {
			this.parentNode.__dominative_updateText()
		}
	},
	onCreateNode() {
		if (this.nodeType === 1 && this.__dominative_isNative) {
			Object.defineProperty(this, '__dominative_eventHandlers', { value: {} })
		}
	},
	onInsertBefore(child, ref) {
		if (child.nodeType === 11 || child.nodeType === 8) return
		if (!(this.__dominative_isNative || this.__dominative_isPseudoElement)) return

		while (ref && !ref.__dominative_isNative) {
			ref = ref.nextElementSibling
		}
		if (!ref) ref = null

		this.__dominative_onInsertChild(child, ref)
		if (child.__dominative_isPseudoElement) child.__dominative_onBeingInserted(this)
	},
	onRemoveChild(child) {
		if (child.nodeType === 11 || child.nodeType === 8) return
		if (!(this.__dominative_isNative || this.__dominative_isPseudoElement)) return
		this.__dominative_onRemoveChild(child)
		if (child.__dominative_isPseudoElement) child.__dominative_onBeingRemoved(this)
	},
	onSetTextContent(val) {
		if (!this.__dominative_isNative) return
		this.__dominative_onSetTextContent(val)
	},
	onGetTextContent() {
		if (!this.__dominative_isNative) return
		return this.__dominative_onGetTextContent()
	},
	onSetAttributeNS(ns, name, value) {
		if (!(this.__dominative_isNative || this.__dominative_isPseudoElement)) return
		this.__dominative_onSetAttributeNS(ns, name, value)
	},
	onGetAttributeNS(ns, name, updateValue) {
		if (!(this.__dominative_isNative || this.__dominative_isPseudoElement)) return
		this.__dominative_onGetAttributeNS(ns, name, updateValue)
	},
	onRemoveAttributeNS(ns, name) {
		if (!(this.__dominative_isNative || this.__dominative_isPseudoElement)) return
		this.__dominative_onRemoveAttributeNS(ns, name)
	},
	onAddEventListener(type, handler, options) {
		if (!this.__dominative_isNative) return
		if (options && options.mode === 'DOM' && !this.__dominative_eventHandlers[type]) {
			this.__dominative_eventHandlers[type] = function(data) {
				let target = data.object
				while (target && !isNode(target)) target = target.parent
				if (!target) return
				const event = new scope.Event(type)
				event.data = data
				target.dispatchEvent(event)
			}
			this.__dominative_onAddEventListener(type, this.__dominative_eventHandlers[type])
			return false
		}
		this.__dominative_onAddEventListener(type, handler, options)
		return true
	},
	onRemoveEventListener(type, handler, options) {
		if (!this.__dominative_isNative) return
		if (options && options.mode === 'DOM' && this.__dominative_eventHandlers[type]) {
			if (this.__undom_eventHandlers[type] && !this.__undom_eventHandlers[type].length) {
				handler = this.__dominative_eventHandlers[type]
				delete this.__dominative_eventHandlers[type]
			}
			this.__dominative_onRemoveEventListener(type, handler, options)
			return false
		}
		this.__dominative_onRemoveEventListener(type, handler, options)
		return true
	}
})

const document = createDocument()

const domImpl = {
	Node: scope.Node,
	document,
	isNode
}

export { registerDOMElement, domImpl, document, scope }
