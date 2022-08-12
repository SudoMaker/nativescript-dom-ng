import { ObservableArray } from '@nativescript/core'
import { PseudoBase } from './base.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

export class PropBase extends PseudoBase {
	constructor(key, type) {
		super()
		this.key = key
		this.type = type
		this.__role = 'Prop'
	}

	get key() {
		return this.__key
	}
	set key(val) {
		if (this.__key === val) return
		const oldKey = this.__key
		if (this.parent && oldKey) this.parent[oldKey] = null
		this.__key = val
		this.setPropOnParent(this.parent)
	}

	get class() {
		return `${this.key}:${this.type}`
	}
	set class(val) {
		const [key, type] = val.split(':')
		this.key = key
		this.type = type
	}

	get type() {
		return this.__type || 'single'
	}
	set type(val) {
		if (this.__type) return
		if (val !== 'array') return
		this.__type = val

		if (val === 'array') {
			if (this.__value) this.__value = [this.__value]
			else this.__value = []
		}

		this.setPropOnParent(this.parent)
	}

	get value() {
		if (this.parent && this.key) this.__value = this.parent[this.key]
		return this.__value
	}
	set value(val) {
		this.__value = val
		this.setPropOnParent(this.parent)
	}

	get parent() {
		return this.__parent
	}

	onBeingInserted(parent) {
		this.__parent = parent
		this.setPropOnParent(parent)
	}
	onBeingRemoved(parent) {
		this.__parent = null
		this.setPropOnParent(parent)
	}

	setPropOnParent(parent) {
		if (!this.key) return
		if (!this.parent) return
		if (parent !== this.parent) {
			if (this.type === 'array' && parent[this.key] instanceof ObservableArray) parent[this.key].length = 0
			else parent[this.key] = null
			return
		}

		if (this.type === 'array' && parent[this.key] instanceof ObservableArray) {
			parent[this.key].length = 0
			parent[this.key].push(...this.__value)
		} else parent[this.key] = this.__value
	}
}

export default class Prop extends PropBase {
	onInsertChild(child, ref) {
		if (!child.__isNative || (ref && !ref.__isNative)) return super.onInsertChild(child, ref)

		if (this.type === 'array') {
			addToArrayProp(this, '__value', child, ref)
			if (this.key && this.parent) addToArrayProp(this.parent, this.key, child, ref)
		} else {
			this.value = child
		}

		super.onInsertChild(child, ref)
	}
	onRemoveChild(child) {
		if (!child.__isNative) return super.onRemoveChild(child)

		if (this.type === 'array') {
			removeFromArrayProp(this, '__value', child)
			if (this.key && this.parent) removeFromArrayProp(this.parent, this.key, child)
		} else if (this.value === child) this.value = null

		super.onRemoveChild(child)
	}
}
