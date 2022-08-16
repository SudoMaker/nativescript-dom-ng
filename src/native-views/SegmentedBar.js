import { SegmentedBar, SegmentedBarItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'
import * as symbol from '../symbols.js'

export const makeSegmentedBar = named(
	'SegmentedBar', 'SegmentedBar', SegmentedBar,
	_ => class SegmentedBarElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)
			if (!(child instanceof SegmentedBarItem)) return

			if (ref && !(ref instanceof SegmentedBarItem)) ref = null

			addToArrayProp(this, 'items', child, ref)

			super[symbol.onInsertChild](child, ref)
		}

		[symbol.onRemoveChild](child) {
			if (!child[symbol.isNative]) return super[symbol.onRemoveChild](child)
			if (!(child instanceof SegmentedBarItem)) return

			removeFromArrayProp(this, 'items', child)

			super[symbol.onRemoveChild](child)
		}
	}
)

export default makeSegmentedBar()
