import { PropBase } from './Prop.js'

const cloneElement = (element) => {
	if (!element.__undom_isNode) return
	const children = element.childNodes.map(cloneElement)
	const clonedElement = new element.constructor()
	if (element.nodeType === 1) {
		const attrs = element.attributes
		for (let {ns, name, value} of attrs) {
			clonedElement.setAttributeNS(ns, name, value)
		}

		if (element.__dominative_eventHandlers) {
			for (let [type, handler] of Object.entries(element.__dominative_eventHandlers)) {
				clonedElement.addEventListener(type, handler)
			}
		}
	} else if (element.nodeType === 3 || element.nodeType === 8) {
		clonedElement.nodeValue = element.nodeValue
	}

	for (let i of children) clonedElement.appendChild(i)

	return clonedElement
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

	clone() {
		if (!this.__content) return null
		return cloneElement(this.__content)
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
