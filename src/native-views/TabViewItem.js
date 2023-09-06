import { TabView, TabViewItem } from '@nativescript/core'
import { isNode } from 'undom-ng'
import { named, makeView } from './mixin.js'

export const makeTabViewItem = /*#__PURE__*/named(
	'TabViewItem', 'TabViewItem', TabViewItem,
	(_, options) => class TabViewItemElement extends /*#__PURE__*/makeView(_, options) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative) return super.__dominative_onInsertChild(child, ref)

			const oldView = this.view

			if (oldView && isNode(oldView)) oldView.remove()
			this.view = child

			if (!oldView) {
				if (this.parentNode && this.parentNode instanceof TabView) {
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
