import { TabView, TabViewItem } from '@nativescript/core'
import { isNode } from 'undom-ng'
import { named, makeView } from './mixin.js'

export const makeTabViewItem = /*#__PURE__*/named(
	'TabViewItem', 'TabViewItem', TabViewItem,
	(_, {parentView = TabView, contentProp = 'view', ...options}) => class TabViewItemElement extends /*#__PURE__*/makeView(_, options) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative) return super.__dominative_onInsertChild(child, ref)

			const oldView = this[contentProp]

			if (oldView && isNode(oldView)) oldView.remove()
			this[contentProp] = child

			if (!oldView) {
				if (this.parentNode && this.parentNode instanceof parentView) {
					const parent = this.parentNode
					const ref = this.nextSibling
					this.remove()
					parent.insertBefore(this, ref)
				}
			}

			super.__dominative_onInsertChild(child, ref)
		}
	}
)

export default /*#__PURE__*/makeTabViewItem.master()
