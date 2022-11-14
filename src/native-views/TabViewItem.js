import { TabViewItem } from '@nativescript/core'
import { isNode } from 'undom-ng'
import { named, makeView } from './mixin.js'

export const makeTabViewItem = /*#__PURE__*/named(
	'TabViewItem', 'TabViewItem', TabViewItem,
	_ => class TabViewItemElement extends /*#__PURE__*/makeView(_) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative) return super.__dominative_onInsertChild(child, ref)
			if (this.view && isNode(this.view)) this.view.remove()
			this.view = child
			super.__dominative_onInsertChild(child, ref)
		}
	}
)

export default /*#__PURE__*/makeTabViewItem.master()
