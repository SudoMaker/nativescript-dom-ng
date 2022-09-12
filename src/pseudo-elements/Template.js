import { ContentView } from '@nativescript/core'
import { isNode, isElement } from '@utls/undom-ef'
import { PropBase } from './Prop.js'
import { document } from '../dom.js'
import { reAssignObject } from '../utils.js'

export class TemplateWrapperView extends ContentView {
	constructor(template) {
		super()
		this.style.padding = '0, 0, 0, 0'
		this.style.margin = '0, 0, 0, 0'
		this.__dominative_template = template
	}
}

const cloneNode = (node) => {
	if (!isNode(node)) return
	return new node.constructor()
}

const hydrate = (source, target) => {
	if (process.env.NODE_ENV !== 'production') {
		if (!isNode(source) || !isNode(target)) throw new TypeError('[DOMiNATIVE] Can only patch undom nodes!')
		if (target && (source.constructor !== target.constructor)) throw new TypeError('[DOMiNATIVE] Cannot patch different type of nodes!')
	}

	if (isElement(source)) {
		const newChildNodes = []
		const targetChildren = target.childNodes.slice()
		const sourceChildren = source.childNodes.slice()
		for (let i in sourceChildren) {
			const targetNode = targetChildren[i]
			const sourceNode = sourceChildren[i]
			if (!targetNode || targetNode.constructor !== sourceNode.constructor) newChildNodes.push(hydrate(sourceNode, cloneNode(sourceNode)))
			else newChildNodes.push(hydrate(sourceNode, targetNode))
		}

		const sourceAttrs = source.attributes
		for (let {ns, name, value} of sourceAttrs) {
			target.setAttributeNS(ns, name, value)
		}

		for (let i of targetChildren) i.remove()
		for (let i of newChildNodes) target.appendChild(i)
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
	return hydrate(self.__content, cloneNode(self.__content))
}

export default class Template extends PropBase {
	/* eslint-disable class-methods-use-this */
	constructor(key) {
		super(key)
		this.__dominative_role = 'Template'
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
		const event = document.createEvent('itemLoading')
		event.view = view
		event.index = index
		event.item = item
		event.data = data
		this.dispatchEvent(event)
		if (event.patched) return event.view
		else return hydrate(this.content, view)
	}

	createView() {
		if (!isNode(this)) return
		const wrapper = new TemplateWrapperView(this)
		const event = document.createEvent('createView')
		this.dispatchEvent(event)
		if (event.view) wrapper.content = event.view
		else wrapper.content = defaultCreateView(this)
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
