import { ContentView } from '@nativescript/core'
import { isNode, isElement, symbol as undomSymbol } from '@utls/undom-ef'
import { PropBase } from './Prop.js'
import { document } from '../dom.js'
import { reAssignObject } from '../utils.js'
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

	if (source[symbol.eventHandlers]) {
		const targetHandlers = target[symbol.eventHandlers]
		for (let [type, targetHandler] of Object.entries(targetHandlers)) {
			target.removeEventListener(type, targetHandler)
		}
		for (let [type, sourceHandler] of Object.entries(source[symbol.eventHandlers])) {
			target.addEventListener(type, sourceHandler)
		}
		reAssignObject(target[symbol.eventHandlers], source[symbol.eventHandlers])
	}

	reAssignObject(target[undomSymbol.eventHandlers], source[undomSymbol.eventHandlers])

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
