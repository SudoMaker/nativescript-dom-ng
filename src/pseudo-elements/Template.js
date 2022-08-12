import { PropBase } from './Prop.js'

const cloneNode = (node) => {
	if (!node.__undom_isNode) return
	const clonedNode = new node.constructor()
	return clonedNode
}

const hydrateNode = (source, target) => {
	if (!source.__undom_isNode || !target.__undom_isNode) throw new TypeError('[DOMiNATIVE] Can only hydrate undom nodes!')
	if (target && (source.constructor !== target.constructor)) throw new TypeError('[DOMiNATIVE] Cannot hydrate different type of nodes!')

	const newChildNodes = []
	for (let i in source.childNodes) {
		const targetNode = target.childNodes[i]
		const sourceNode = source.childNodes[i]
		if (!targetNode || targetNode.constructor !== sourceNode.constructor) newChildNodes.push(hydrateNode(sourceNode, cloneNode(sourceNode)))
		else newChildNodes.push(hydrateNode(sourceNode, targetNode))
	}

	if (source.nodeType === 1) {
		const sourceAttrs = source.attributes
		for (let {ns, name, value} of sourceAttrs) {
			target.setAttributeNS(ns, name, value)
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
		/* eslint-disable camelcase */
		target.__dominative_eventHandlers = Object.assign({}, source.__dominative_eventHandlers)
	}

	target.__undom_eventHandlers = Object.assign({}, source.__undom_eventHandlers)

	const targetChildren = target.childNodes.slice()
	for (let i of targetChildren) i.remove()
	for (let i of newChildNodes) target.appendChild(i)

	return target
}

export default class Template extends PropBase {
	/* eslint-disable class-methods-use-this */
	constructor(key) {
		super(key)
		this.__role = 'Template'
		this.__value = () => this.createView()
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
		if (!val.__isNative) return
		this.__content = val
	}

	hydrate(clonedNode) {
		if (!this.__content) return
		return hydrateNode(this.__content, clonedNode)
	}

	createView() {
		if (!this.__content) return null
		return this.hydrate(cloneNode(this.__content))
	}

	onInsertChild(child, ref) {
		if (!child.__isNative || (ref && !ref.__isNative)) return super.onInsertChild(child, ref)
		this.content = child

		super.onInsertChild(child, ref)
	}

	onRemoveChild(child) {
		if (!child.__isNative) return super.onRemoveChild(child)
		if (child === this.content) this.content = null

		super.onRemoveChild(child)
	}

	setPropOnParent(parent) {
		if (!(parent instanceof PropBase)) return super.setPropOnParent(parent)
	}
}
