import { ObservableArray } from '@nativescript/core'
import { PseudoBase } from './base.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'
import * as symbol from '../symbols.js'

export class PropBase extends PseudoBase {
	constructor(key, type) {
		super()
		if (key) this.key = key
		if (type) this.type = type
		this[symbol.role] = 'Prop'
	}

	get key() {
		return this.__key
	}
	set key(val) {
		if (this.__key === val) return
		const oldKey = this.__key
		if (this.parent && oldKey) this.parent[oldKey] = null
		this.__key = val
		this[symbol.setPropOnParent](this.parent)
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
			if (this.__value) this.__value = [this.__value]
			else this.__value = []
		}

		this[symbol.setPropOnParent](this.parent)
	}

	get value() {
		if (this.parent && this.key) this.__value = this.parent[this.key]
		return this.__value
	}
	set value(val) {
		this.__value = val
		this[symbol.setPropOnParent](this.parent)
	}

	get parent() {
		return this.__parent
	}

	[symbol.onBeingInserted](parent) {
		this.__parent = parent
		this[symbol.setPropOnParent](parent)
	}
	[symbol.onBeingRemoved](parent) {
		this.__parent = null
		this[symbol.setPropOnParent](parent)
	}

	[symbol.setPropOnParent](parent) {
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
	[symbol.onInsertChild](child, ref) {
		if (!(child[symbol.isPseudoElement] && child[symbol.role] === 'Template') && (!child[symbol.isNative] || (ref && !ref[symbol.isNative]))) return super[symbol.onInsertChild](child, ref)

		if (Array.isArray(this.__value)) {
			addToArrayProp(this, '__value', child, ref)
			if (this.key && this.parent) addToArrayProp(this.parent, this.key, child, ref)
		} else {
			this.value = child
		}

		super[symbol.onInsertChild](child, ref)
	}

	[symbol.onRemoveChild](child) {
		if (!(child instanceof PropBase) && !child[symbol.isNative]) return super[symbol.onRemoveChild](child)

		if (this.type === 'array') {
			removeFromArrayProp(this, '__value', child)
			if (this.key && this.parent) removeFromArrayProp(this.parent, this.key, child)
		} else if (this.value === child) this.value = null

		super[symbol.onRemoveChild](child)
	}
}
