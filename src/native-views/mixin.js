import { ViewBase, LayoutBase, TextBase, EditableTextBase, FormattedString } from '@nativescript/core'
import { isAndroid, isIOS } from '@nativescript/core/platform'
import { named, resolvePath } from '../utils.js'

const makeView = named(
	'View', 'ViewBase', ViewBase,
	_ => class SubView extends _ {
		/* eslint-disable class-methods-use-this, no-empty-function */
		constructor(...args) {
			super(...args)
			this.__dominative_isNative = true
			this.__dominative_role = 'View'
		}

		__dominative_onInsertChild() {}
		__dominative_onRemoveChild() {}

		__dominative_onSetTextContent() {}
		__dominative_onGetTextContent() {}

		__dominative_onAddEventListener(type, handler, options) {
			super.addEventListener(type, handler, options)
		}
		__dominative_onRemoveEventListener(type, handler, options) {
			super.removeEventListener(type, handler, options)
		}

		__dominative_onSetAttributeNS(ns, name, value) {
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

		__dominative_onGetAttributeNS(ns, name, updateValue) {
			if (ns) return
			if (name === 'class') {
				updateValue(super.className)
				return
			}
			const [base, key] = resolvePath(name, this)
			updateValue(base[key])
		}

		__dominative_onRemoveAttributeNS(ns, name) {
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
			this.__dominative_role = 'Layout'
		}

		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return

			if (ref) {
				const refIndex = this.getChildIndex(ref)
				super.insertChild(child, refIndex)
			} else {
				super.addChild(child)
			}

			super.__dominative_onInsertChild(child, ref)
		}

		__dominative_onRemoveChild(child) {
			if (!child.__dominative_isNative) return

			super.removeChild(child)

			super.__dominative_onRemoveChild(child)
		}
	}
)

const makeText = named(
	'Text', 'TextBase', TextBase,
	_ => class SubText extends makeView(_) {
		constructor(...args) {
			super(...args)
			this.__dominative_role = 'Text'

			let textUpdating = false
			// eslint-disable-next-line camelcase
			this.__dominative_updateText = () => {
				if (textUpdating) return
				textUpdating = true
				// to workaround iOS rendering bug
				if (!this.parent && !super.text) super.text = ' '
				setTimeout(() => {
					super.text = this.textContent
					textUpdating = false
				}, 0)
			}
		}

		__dominative_onSetTextContent(val) {
			super.text = val
		}
		__dominative_onGetTextContent() {
			if (this.firstChild) return
			return super.text
		}

		__dominative_onInsertChild(child, ref) {
			super.__dominative_onInsertChild(child, ref)
			if (child instanceof FormattedString) this.formattedText = child
			if (child.nodeType === 3) this.__dominative_updateText()
		}
		__dominative_onRemoveChild(child) {
			super.__dominative_onRemoveChild(child)
			if (child instanceof FormattedString) this.formattedText = null
			if (child.nodeType === 3) this.__dominative_updateText()
		}
	}
)

const makeEditableText = named(
	'EditableText', 'EditableTextBase', EditableTextBase,
	_ => class SubEditableText extends makeText(_) {
		constructor(...args) {
			super(...args)
			this.__dominative_role = 'EditableText'
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
