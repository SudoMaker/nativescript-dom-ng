import { TabViewItem } from '@nativescript/core'
import { isNode } from '@utls/undom-ef'
import { named, makeView } from './mixin.js'
import * as symbol from '../symbols.js'

export const makeTabViewItem = named(
	'TabViewItem', 'TabViewItem', TabViewItem,
	_ => class TabViewItemElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative]) return super[symbol.onInsertChild](child, ref)
			if (this.view && isNode(this.view)) this.view.remove()
			this.view = child
			super[symbol.onInsertChild](child, ref)
		}
	}
)

export default makeTabViewItem()
