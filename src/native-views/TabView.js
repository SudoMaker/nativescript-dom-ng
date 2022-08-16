import { TabView, TabViewItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'
import * as symbol from '../symbols.js'

export const makeTabView = named(
	'TabView', 'TabView', TabView,
	_ => class TabViewElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)
			if (!(child instanceof TabViewItem)) return

			if (ref && !(ref instanceof TabViewItem)) ref = null

			addToArrayProp(this, 'items', child, ref)

			super[symbol.onInsertChild](child, ref)
		}

		[symbol.onRemoveChild](child) {
			if (!child[symbol.isNative]) return
			if (!(child instanceof TabViewItem)) return super[symbol.onRemoveChild](child)

			removeFromArrayProp(this, 'items', child)

			super[symbol.onRemoveChild](child)
		}
	}
)

export default makeTabView()
