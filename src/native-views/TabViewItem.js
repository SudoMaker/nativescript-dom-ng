import { TabViewItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeTabViewItem = named(
	'TabViewItem', 'TabViewItem', TabViewItem,
	_ => class TabViewItemElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative) return
			if (this.view && this.view.__undom_isNode) this.view.remove()
			this.view = child
			super.onInsertChild(child, ref)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return
			if (this.view === child) this.view = null
			super.onRemoveChild(child)
		}
	}
)

export default makeTabViewItem()
