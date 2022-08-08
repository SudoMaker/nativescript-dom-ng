import { SegmentedBar, SegmentedBarItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from './helper.js'

export const makeSegmentedBar = named(
	'SegmentedBar', 'SegmentedBar', SegmentedBar,
	_ => class SegmentedBarElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return
			if (!(child instanceof SegmentedBarItem)) return

			if (ref && !(ref instanceof SegmentedBarItem)) ref = null

			addToArrayProp(this, 'items', child, ref)

			super.onInsertChild(child, ref)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return
			if (!(child instanceof SegmentedBarItem)) return

			removeFromArrayProp(this, 'items', child)

			super.onRemoveChild(child)
		}
	}
)

export default makeSegmentedBar()
