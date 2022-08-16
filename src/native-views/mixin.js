import { ViewBase, LayoutBase, TextBase, EditableTextBase, FormattedString } from '@nativescript/core'
import { isAndroid, isIOS } from '@nativescript/core/platform'
import { named, resolvePath } from '../utils.js'
import * as symbol from '../symbols.js'

const makeView = named(
	'View', 'ViewBase', ViewBase,
	_ => class SubView extends _ {
		/* eslint-disable class-methods-use-this, no-empty-function */
		constructor(...args) {
			super(...args)
			this[symbol.isNative] = true
			this[symbol.role] = 'View'
		}

		[symbol.onInsertChild]() {}
		[symbol.onRemoveChild]() {}

		[symbol.onAddEventListener](type, handler, options) {
			super.addEventListener(type, handler, options)
		}
		[symbol.onRemoveEventListener](type, handler, options) {
			super.removeEventListener(type, handler, options)
		}

		[symbol.onSetAttributeNS](ns, name, value) {
			if (ns) return
			if (isAndroid && name.startsWith('ios.')) return
			if (isIOS && name.startsWith('android.')) return

			if (name === 'class') {
				super.className = value
				return
			}
			const [base, key] = resolvePath(name, this)
			base[key] = value
		}

		[symbol.onGetAttributeNS](ns, name, updateValue) {
			if (ns) return
			if (name === 'class') {
				updateValue(super.className)
				return
			}
			const [base, key] = resolvePath(name, this)
			updateValue(base[key])
		}

		[symbol.onRemoveAttributeNS](ns, name) {
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
			this[symbol.role] = 'Layout'
		}

		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return

			if (ref) {
				const refIndex = this.getChildIndex(ref)
				super.insertChild(child, refIndex)
			} else {
				super.addChild(child)
			}

			super[symbol.onInsertChild](child, ref)
		}

		[symbol.onRemoveChild](child) {
			if (!child[symbol.isNative]) return

			super.removeChild(child)

			super[symbol.onRemoveChild](child)
		}
	}
)

const makeText = named(
	'Text', 'TextBase', TextBase,
	_ => class SubText extends makeView(_) {
		constructor(...args) {
			super(...args)
			this[symbol.role] = 'Text'

			let textUpdating = false
			// eslint-disable-next-line camelcase
			this[symbol.updateText] = () => {
				if (textUpdating) return
				textUpdating = true
				setTimeout(() => {
					super.text = this.childNodes
						.filter(i => i.nodeType === 3)
						.map(i => i.textContent)
						.join('')
					textUpdating = false
				})
			}
		}

		[symbol.onInsertChild](child, ref) {
			super[symbol.onInsertChild](child, ref)
			if (child instanceof FormattedString) this.formattedText = child
			if (child.nodeType === 3) this[symbol.updateText]()
		}
		[symbol.onRemoveChild](child) {
			super[symbol.onRemoveChild](child)
			if (child instanceof FormattedString) this.formattedText = null
			if (child.nodeType === 3) this[symbol.updateText]()
		}
	}
)

const makeEditableText = named(
	'EditableText', 'EditableTextBase', EditableTextBase,
	_ => class SubEditableText extends makeText(_) {
		constructor(...args) {
			super(...args)
			this[symbol.role] = 'EditableText'
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
