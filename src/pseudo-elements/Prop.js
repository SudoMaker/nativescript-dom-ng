import { ObservableArray } from '@nativescript/core'
import { PseudoBase } from './base.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

export class PropBase extends PseudoBase {
	constructor(key, type) {
		super()
		if (key) this.key = key
		if (type) this.type = type
		this.__dominative_role = 'Prop'
	}

	get key() {
		return this.__key
	}
	set key(val) {
		if (this.__key === val) return
		const oldKey = this.__key
		if (this.parent && oldKey) this.parent[oldKey] = null
		this.__key = val
		this.__dominative_setPropOnParent(this.parent)
	}

	get class() {
		return `${this.key}:${this.type}`
	}
	set class(val) {
		const [key, type] = val.split(':')
		if (key) this.key = key
		if (type) this.type = type
	}

	get type() {
		return this.__type || 'single'
	}
	set type(val) {
		if (this.__type) return
		if (val !== 'array') return
		this.__type = val

		if (val === 'array') {
			this.__value = []

			const children = this.childNodes.slice()
			for (let i of children) this.appendChild(i)
		}

		this.__dominative_setPropOnParent(this.parent)
	}

	get value() {
		if (this.parent && this.key) this.__value = this.parent[this.key]
		return this.__value
	}
	set value(val) {
		this.__value = val
		this.__dominative_setPropOnParent(this.parent)
	}

	get parent() {
		return this.__parent
	}

	__dominative_onBeingInserted(parent) {
		this.__parent = parent
		this.__dominative_setPropOnParent(parent)
	}
	__dominative_onBeingRemoved(parent) {
		this.__parent = null
		this.__dominative_setPropOnParent(parent)
	}

	__dominative_setPropOnParent(parent) {
		if (!this.key) return
		if (!this.parent) return
		if (parent !== this.parent) {
			if (Array.isArray(this.__value) && parent[this.key] instanceof ObservableArray) parent[this.key].length = 0
			else parent[this.key] = null
			return
		}

		if (Array.isArray(this.__value) && parent[this.key] instanceof ObservableArray) {
			parent[this.key].length = 0
			parent[this.key].push(...this.__value)
		} else parent[this.key] = this.__value
	}
}

export default class Prop extends PropBase {
	__dominative_onInsertChild(child, ref) {
		if (!(child.__dominative_isPseudoElement && child.__dominative_role === 'Template') &&
			(!child.__dominative_isNative || (ref && !ref.__dominative_isNative))
		) return super.__dominative_onInsertChild(child, ref)

		if (Array.isArray(this.__value)) {
			addToArrayProp(this, '__value', child, ref)
			if (this.key && this.parent && this.__value !== this.parent[this.key]) addToArrayProp(this.parent, this.key, child, ref)
		} else {
			this.value = child
		}

		super.__dominative_onInsertChild(child, ref)
	}

	__dominative_onRemoveChild(child) {
		if (!(child instanceof PropBase) && !child.__dominative_isNative) return super.__dominative_onRemoveChild(child)

		if (this.type === 'array') {
			removeFromArrayProp(this, '__value', child)
			if (this.key && this.parent) removeFromArrayProp(this.parent, this.key, child)
		} else if (this.value === child) this.value = null

		super.__dominative_onRemoveChild(child)
	}
}
