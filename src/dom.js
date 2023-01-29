import { createEnvironment, createEvent } from 'undom-ng'
import { makeView } from './native-views/mixin.js'
import { makeTweakable } from './utils.js'

import ContentView from './native-views/ContentView.js'
import Frame from './native-views/Frame.js'
import Page from './native-views/Page.js'

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
	DOCUMENT_FRAGMENT_NODE: 11
}
*/

const silent = process.env.NODE_ENV === 'production'

class Document extends makeTweakable(ContentView) {
	get documentElement() {
		return this.content
	}
}

const initDocument = (document) => {
	const documentElement = document.createElement('Frame')
	const body = document.createElement('Page')

	body.actionBarHidden = true
	documentElement.appendChild(body)

	document.appendChild(documentElement)
	document.body = body
}

const {scope, createDocument, createElement, registerElement: registerDOMElement} = createEnvironment({
	silent,
	initDocument,
	preserveClassNameOnRegister: true,
	commonAncestors: {
		Document
	},
	onSetData(data) {
		if (this.nodeType === 8) {
			if (!silent) console.log('[DOMiNATIVE][DOM COMMENT]', data)
		} else if (this.nodeType === 3 && this.parentNode && this.parentNode.__dominative_isNative && this.parentNode.__dominative_is_Text) {
			this.parentNode.__dominative_updateText()
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
	onAddEventListener(...args) {
		const [,, thisArg] = args

		if (!thisArg) return false
		if (thisArg === true) return false

		const proto = Object.getPrototypeOf(thisArg)
		if (proto === Object.prototype || !proto) return false

		this.__dominative_onAddEventListener(...args)
		return true
	},
	onAddedEventListener(...args) {
		if (!this.__dominative_isNative) return

		let [type] = args

		if (!silent) {
			const nativeEventType = this.constructor.getEventMap(type)
			if (type !== nativeEventType) console.warn(`[DOMiNATIVE] Event '${type}' is being registered as '${nativeEventType}' on '${this.localName}'. See https://github.com/SudoMaker/DOMiNATIVE#hardcoding-in-frameworks for details.`)
		}

		if (!this.__dominative_eventHandlers[type]) {
			const nativeHandler =	(data) => {
				const eventOption = this.constructor.getEventOption(type)
				data.type = type
				Object.assign(data, eventOption, scope.Event.prototype)
				this.dispatchEvent(data)
			}

			const nativeEventType = this.constructor.getEventMap(type)

			this.__dominative_eventHandlers[type] = nativeHandler

			// Add delegate handler, only once
			this.__dominative_onAddedEventListener(nativeEventType, nativeHandler)
		}
	},
	onRemoveEventListener(...args) {
		const [,, thisArg] = args

		if (!thisArg) return false
		if (thisArg === true) return false

		const proto = Object.getPrototypeOf(thisArg)
		if (proto === Object.prototype || !proto) return false

		this.__dominative_onRemoveEventListener(...args)
		return true
	},
	onRemovedEventListener(...args) {
		if (!this.__dominative_isNative) return

		let [type] = args

		if (!silent) {
			const nativeEventType = this.constructor.getEventMap(type)
			if (type !== nativeEventType) console.warn(`[DOMiNATIVE] Event '${type}' is being removed as '${nativeEventType}' on '${this.localName}'. See https://github.com/SudoMaker/DOMiNATIVE#hardcoding-in-frameworks for details.`)
		}

		const handler = this.__dominative_eventHandlers[type]

		if (handler) {
			let proceed = true

			if (this.__undom_eventHandlers.capturePhase[type]) proceed = false
			if (this.__undom_eventHandlers.bubblePhase[type]) proceed = false

			if (proceed) {
				const nativeEventType = this.constructor.getEventMap(type)

				delete this.__dominative_eventHandlers[type]

				// Remove delegate handler when no handler presents
				this.__dominative_onRemovedEventListener(nativeEventType, handler)
			}
		}
	}
})

registerDOMElement('Frame', makeTweakable(Frame))
registerDOMElement('Page', makeTweakable(Page))
registerDOMElement('ContentView', makeTweakable(ContentView))

const registerElement = (key, val) => {
	if (scope[key]) {
		if (!process.env.NODE_ENV !== 'production') console.warn(`[DOMiNATIVE] '${key}'' is already registered, skipping!`)
		return scope[key]
	}
	return registerDOMElement(key, makeTweakable(makeView(val)))
}
const aliasTagName = (nameHandler) => {
	for (let key of Object.keys(scope)) scope[nameHandler(key)] = scope[key]
}

export { registerElement, registerDOMElement, aliasTagName, createDocument, createElement, createEvent, scope }
