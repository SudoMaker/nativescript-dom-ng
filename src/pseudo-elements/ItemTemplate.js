import { ContentView } from '@nativescript/core'
import { isNode, isElement } from 'undom-ng'
import { PropBase } from './Prop.js'
import { createEvent } from '../dom.js'
import { reAssignObject } from '../utils.js'

export class TemplateWrapperView extends ContentView {
	constructor(template) {
		super()
		this.style.padding = '0, 0, 0, 0'
		this.style.margin = '0, 0, 0, 0'
		this.__dominative_template = template
	}
}

const hydrate = (source, target) => {
	if (process.env.NODE_ENV !== 'production') {
		if (!isNode(source) || !isNode(target)) throw new TypeError('[DOMiNATIVE] Can only patch undom nodes!')
		if (target && (source.constructor !== target.constructor)) throw new TypeError('[DOMiNATIVE] Cannot patch different type of nodes!')
	}

	if (isElement(source)) {
		let sourceNode = source.firstChild
		let targetNode = target.firstChild
		while (sourceNode) {
			if (!targetNode || targetNode.constructor !== sourceNode.constructor) {
				const newChild = hydrate(sourceNode, sourceNode.cloneNode())
				if (targetNode) targetNode.replaceWith(newChild)
				else target.appendChild(newChild)
			} else {
				hydrate(sourceNode, targetNode)
			}

			sourceNode = sourceNode.nextSibling
			if (targetNode) targetNode = targetNode.nextSibling
		}

		while (targetNode) {
			targetNode.remove()
			targetNode = targetNode.nextSibling
		}
	} else if (source.nodeType === 3 || source.nodeType === 8) {
		target.nodeValue = source.nodeValue
	}

	if (source.__dominative_eventHandlers) {
		const targetHandlers = target.__dominative_eventHandlers
		for (let [type, targetHandler] of Object.entries(targetHandlers)) {
			target.removeEventListener(type, targetHandler)
		}
		for (let [type, sourceHandler] of Object.entries(source.__dominative_eventHandlers)) {
			target.addEventListener(type, sourceHandler)
		}
		reAssignObject(target.__dominative_eventHandlers, source.__dominative_eventHandlers)
	}

	reAssignObject(target.__undom_eventHandlers, source.__undom_eventHandlers)

	return target
}

const defaultCreateView = (self) => {
	if (!self.__content) return null
	return hydrate(self.__content, self.__content.cloneNode())
}

export default class ItemTemplate extends PropBase {
	/* eslint-disable class-methods-use-this */
	constructor(key = 'itemTemplate') {
		super(key)
		this.__type = 'key'
		this.__dominative_role = 'ItemTemplate'
		this.__value = () => this.createView()
	}

	set type(val) {
		if (process.env.NODE_ENV !== 'production') console.warn('[DOMiNATIVE] Cannot set type of a Template.')
		return
	}

	set value(val) {
		if (process.env.NODE_ENV !== 'production') console.warn('[DOMiNATIVE] Cannot set value of a Template.')
		return
	}

	get content() {
		return this.__content
	}
	set content(val) {
		if (!val.__dominative_isNative) return
		this.__content = val
	}

	patch({view, index, item, data}) {
		if (!isNode(view)) return
		if (this.__content) return hydrate(this.__content, view)

		const event = createEvent('itemLoading')
		event.view = view
		event.index = index
		event.item = item
		event.data = data
		this.dispatchEvent(event)

		return event.view || null
	}

	createView() {
		const wrapper = new TemplateWrapperView(this)

		if (this.__content) wrapper.content = defaultCreateView(this)
		else {
			const event = createEvent('createView')
			this.dispatchEvent(event)
			wrapper.content = event.view || null
		}

		return wrapper
	}

	__dominative_onInsertChild(child, ref) {
		if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)
		if (this.content) {
			if (process.env.NODE_ENV !== 'production') console.warn('[DOMiNATIVE] Template can have only one child.')
			return super.__dominative_onInsertChild(child, ref)
		}

		this.content = child

		super.__dominative_onInsertChild(child, ref)
	}

	__dominative_onRemoveChild(child) {
		if (!child.__dominative_isNative) return super.__dominative_onRemoveChild(child)
		if (child === this.content) this.content = null

		super.__dominative_onRemoveChild(child)
	}

	__dominative_setPropOnParent(parent) {
		if (!(parent instanceof PropBase)) return super.__dominative_setPropOnParent(parent)
	}
}
