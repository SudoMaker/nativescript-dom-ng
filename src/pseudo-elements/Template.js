import { PropBase } from './Prop.js'
import * as symbol from '../symbols.js'

const cloneNode = (node) => {
	if (!node.__undom_isNode) return
	const clonedNode = new node.constructor()
	return clonedNode
}

const hydrate = (source, target) => {
	if (!source.__undom_isNode || !target.__undom_isNode) throw new TypeError('[DOMiNATIVE] Can only patch undom nodes!')
	if (target && (source.constructor !== target.constructor)) throw new TypeError('[DOMiNATIVE] Cannot patch different type of nodes!')

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

function defaultPatch(clonedNode) {
	if (!this.__content) return
	return hydrate(this.__content, clonedNode)
}

function defaultCreateView() {
	if (!this.__content) return null
	return hydrate(this.__content, cloneNode(this.__content))
}

export default class Template extends PropBase {
	/* eslint-disable class-methods-use-this */
	constructor(key) {
		super(key)
		this[symbol.role] = 'Template'
		this.__value = () => this.createView()
		this.__patch = defaultPatch
		this.__createView = defaultCreateView
		this.__createViewInternal = () => {
			const createdView = this.__createView()
			createdView.__dominative_fromTemplate = this
			createdView.__dominative_patchView = (index, item) => {
				if (this.patch) this.patch(createdView, index, item)
			}
			return createdView
		}
	}

	set type(val) {
		return
	}

	set value(val) {
		return
	}

	get content() {
		return this.__content
	}
	set content(val) {
		if (!val[symbol.isNative]) return
		this.__content = val
	}

	get patch() {
		return this.__patch
	}
	set patch(val) {
		if (typeof val !== 'function') return
		this.__patch = val
	}

	get createView() {
		return this.__createViewInternal
	}
	set createView(val) {
		if (typeof val !== 'function') return
		this.__createView = val
	}

	[symbol.onInsertChild](child, ref) {
		if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)
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
