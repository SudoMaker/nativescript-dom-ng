import { PropBase } from './Prop.js'

const cloneNode = (node) => {
	if (!node.__undom_isNode) return
	const clonedNode = new node.constructor()
	return clonedNode
}

const hydrateNode = (source, target) => {
	if (!source.__undom_isNode || !target.__undom_isNode) return
	if (target && (source.constructor !== target.constructor)) throw new TypeError('[DOMiNATIVE] Cannot hydrate different nodes!')

	const targetChildren = target.childNodes.slice()
	for (let i of targetChildren) i.remove()

	const newChildNodeSet = []
	for (let i in source.childNodes) {
		let targetNode = targetChildren[i]
		const sourceNode = source.childNodes[i]
		if (!targetNode || targetNode.constructor !== sourceNode.constructor) newChildNodeSet.push(hydrateNode(sourceNode, cloneNode(sourceNode)))
		else newChildNodeSet.push(hydrateNode(sourceNode, targetNode))
	}

	if (source.nodeType === 1) {
		const sourceAttrs = source.attributes
		for (let {ns, name, value} of sourceAttrs) {
			target.setAttributeNS(ns, name, value)
		}

		if (source.__dominative_eventHandlers) {
			for (let [type, sourceHandler] of Object.entries(source.__dominative_eventHandlers)) {
				const targetHandler = target.__dominative_eventHandlers[type]
				if (targetHandler) {
					// eslint-disable-next-line max-depth, no-continue
					if (targetHandler === sourceHandler) continue
					else target.removeEventListener(type, targetHandler)
				}

				target.addEventListener(type, sourceHandler)
			}

			// eslint-disable-next-line camelcase
			target.__dominative_eventHandlers = Object.assign({}, source.__dominative_eventHandlers)
		}
	} else if (source.nodeType === 3 || source.nodeType === 8) {
		target.nodeValue = source.nodeValue
	}

	for (let i of newChildNodeSet) target.appendChild(i)

	return target
}

export default class Template extends PropBase {
	/* eslint-disable class-methods-use-this */
	constructor(key) {
		super(key)
		this.__role = 'Template'
		this.__value = () => this.clone()
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

	clone() {
		if (!this.__content) return null
		return this.hydrate(cloneNode(this.__content))
	}

	onInsertChild(child, ref) {
		if (!child.__isNative || (ref && !ref.__isNative)) return super.onInsertChild(child, ref)
		this.content = child
	}

	onRemoveChild(child) {
		if (!child.__isNative) return super.onRemoveChild(child)
		if (child === this.content) this.content = null
	}
}
