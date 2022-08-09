import { ViewBase, LayoutBase, TextBase, EditableTextBase, FormattedString } from '@nativescript/core'
import { isAndroid, isIOS } from '@nativescript/core/platform'
import { named, resolvePath } from '../utils.js'

const makeView = named(
	'View', 'ViewBase', ViewBase,
	_ => class SubView extends _ {
		/* eslint-disable class-methods-use-this, no-empty-function */
		constructor(...args) {
			super(...args)
			this.__isNative = true
			this.__role = 'View'
		}

		get _nsClassName() {
			return super.className
		}

		set _nsClassName(val) {
			super.className = val
		}

		get _nsParentNode() {
			return super.parentNode
		}

		onInsertChild() {}
		onRemoveChild() {}

		onAddEventListener(type, handler, options) {
			super.addEventListener(type, handler, options)
		}
		onRemoveEventListener(type, handler, options) {
			super.removeEventListener(type, handler, options)
		}

		onSetAttributeNS(ns, name, value) {
			if (ns) return
			if (isAndroid && name.startsWith('ios.')) return
			if (isIOS && name.startsWith('android.')) return

			if (name === 'class') {
				this._nsClassName = value
				return
			}
			const [base, key] = resolvePath(name, this)
			base[key] = value
		}

		onGetAttributeNS(ns, name, updateValue) {
			if (ns) return
			if (name === 'class') {
				updateValue(this._nsClassName)
				return
			}
			const [base, key] = resolvePath(name, this)
			updateValue(base[key])
		}

		onRemoveAttributeNS(ns, name) {
			// eslint-disable-next-line no-void
			this.setAttributeNS(ns, name, void(0))
		}
	}
)

const makeLayout = named(
	'Layout', 'LayoutBase', LayoutBase,
	_ => class SubLayout extends makeView(_) {
		constructor(...args) {
			super(...args)
			this.__role = 'Layout'
		}

		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return

			if (ref) {
				const refIndex = this.getChildIndex(ref)
				super.insertChild(child, refIndex)
			} else {
				super.addChild(child)
			}

			super.onInsertChild(child, ref)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return

			super.removeChild(child)

			super.onRemoveChild(child)
		}
	}
)

const makeText = named(
	'Text', 'TextBase', TextBase,
	_ => class extends makeView(_) {
		constructor(...args) {
			super(...args)
			this.__role = 'Text'

			let textUpdating = false
			// eslint-disable-next-line camelcase
			this.__dominative_updateText = () => {
				if (textUpdating) return
				setTimeout(() => {
					super.text = this.childNodes
						.filter(i => i.nodeType === 3)
						.map(i => i.textContent)
						.join('')
					textUpdating = false
				})
			}
		}

		updateText() {
			return this.__dominative_updateText()
		}

		onInsertChild(child, ref) {
			super.onInsertChild(child, ref)
			if (child instanceof FormattedString) this.formattedText = child
			if (child.nodeType === 3) this.updateText()
		}
		onRemoveChild(child) {
			super.onRemoveChild(child)
			if (child instanceof FormattedString) this.formattedText = null
			if (child.nodeType === 3) this.updateText()
		}
	}
)

const makeEditableText = named(
	'EditableText', 'EditableTextBase', EditableTextBase,
	_ => class extends makeText(_) {
		constructor(...args) {
			super(...args)
			this.__role = 'EditableText'
		}
	}
)

export {
	named,
	makeView,
	makeLayout,
	makeText,
	makeEditableText
}
