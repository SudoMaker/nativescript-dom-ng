import { TabViewItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import * as symbol from '../symbols.js'

export const makeTabViewItem = named(
	'TabViewItem', 'TabViewItem', TabViewItem,
	_ => class TabViewItemElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative]) return super[symbol.onInsertChild](child, ref)
			if (this.view && this.view.__undom_isNode) this.view.remove()
			this.view = child
			super[symbol.onInsertChild](child, ref)
		}
	}
)

export default makeTabViewItem()
