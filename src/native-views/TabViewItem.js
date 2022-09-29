import { TabViewItem } from '@nativescript/core'
import { isNode } from '@utls/undom-ef'
import { named, makeView } from './mixin.js'

export const makeTabViewItem = named(
	'TabViewItem', 'TabViewItem', TabViewItem,
	_ => class TabViewItemElement extends makeView(_) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative) return super.__dominative_onInsertChild(child, ref)
			if (this.view && isNode(this.view)) this.view.remove()
			this.view = child
			super.__dominative_onInsertChild(child, ref)
		}
	}
)

export default makeTabViewItem.master()
