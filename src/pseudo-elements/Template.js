import { ContentView } from '@nativescript/core'
import { PropBase } from './Prop.js'
import { document } from '../dom.js'
import * as symbol from '../symbols.js'

export class TemplateWrapperView extends ContentView {
	constructor(template) {
		super()
		this.style.padding = '0, 0, 0, 0'
		this.style.margin = '0, 0, 0, 0'
		this[symbol.template] = template
	}
}

const cloneNode = (node) => {
	if (!node.__undom_isNode) return
	const clonedNode = new node.constructor()
	return clonedNode
}

const hydrate = (source, target) => {
	if (process.env.NODE_ENV !== 'production') {
		if (!source.__undom_isNode || !target.__undom_isNode) throw new TypeError('[DOMiNATIVE] Can only patch undom nodes!')
		if (target && (source.constructor !== target.constructor)) throw new TypeError('[DOMiNATIVE] Cannot patch different type of nodes!')
	}

	const newChildNodes = []
	for (let i in source.childNodes) {
		const targetNode = target.childNodes[i]
		const sourceNode = source.childNodes[i]
		if (!targetNode || targetNode.constructor !== sourceNode.constructor) newChildNodes.push(hydrate(sourceNode, cloneNode(sourceNode)))
		else newChildNodes.push(hydrate(sourceNode, targetNode))
	}

	if (source.nodeType === 1) {
		const sourceAttrs = source.attributes
		for (let {ns, name, value} of sourceAttrs) {
			target.setAttributeNS(ns, name, value)
		}
	} else if (source.nodeType === 3 || source.nodeType === 8) {
		target.nodeValue = source.nodeValue
	}

	if (source[symbol.eventHandlers]) {
		const targetHandlers = target[symbol.eventHandlers]
		for (let [type, targetHandler] of Object.entries(targetHandlers)) {
			target.removeEventListener(type, targetHandler)
		}
		for (let [type, sourceHandler] of Object.entries(source[symbol.eventHandlers])) {
			target.addEventListener(type, sourceHandler)
		}
		/* eslint-disable camelcase */
		target[symbol.eventHandlers] = Object.assign({}, source[symbol.eventHandlers])
	}

	target.__undom_eventHandlers = Object.assign({}, source.__undom_eventHandlers)

	const targetChildren = target.childNodes.slice()
	for (let i of targetChildren) i.remove()
	for (let i of newChildNodes) target.appendChild(i)

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
		this[symbol.role] = 'Template'
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
		if (!val[symbol.isNative]) return
		this.__content = val
	}

	patch({view, index, item, data}) {
		if (!view.__undom_isNode) return
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
		if (!this.__undom_isNode) return
		const wrapper = new TemplateWrapperView(this)
		const event = document.createEvent('createView')
		this.dispatchEvent(event)
		if (event.view) wrapper.content = event.view
		else wrapper.content = defaultCreateView(this)
		return wrapper
	}

	[symbol.onInsertChild](child, ref) {
		if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)
		if (this.content) {
			if (process.env.NODE_ENV !== 'production') console.warn('[DOMiNATIVE] Template can have only one child.')
			return super[symbol.onInsertChild](child, ref)
		}

		this.content = child

		super[symbol.onInsertChild](child, ref)
	}

	[symbol.onRemoveChild](child) {
		if (!child[symbol.isNative]) return super[symbol.onRemoveChild](child)
		if (child === this.content) this.content = null

		super[symbol.onRemoveChild](child)
	}

	[symbol.setPropOnParent](parent) {
		if (!(parent instanceof PropBase)) return super[symbol.setPropOnParent](parent)
	}
}
