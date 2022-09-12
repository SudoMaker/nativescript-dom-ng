import { SegmentedBar, SegmentedBarItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

export const makeSegmentedBar = named(
	'SegmentedBar', 'SegmentedBar', SegmentedBar,
	_ => class SegmentedBarElement extends makeView(_) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)
			if (!(child instanceof SegmentedBarItem)) return

			if (ref && !(ref instanceof SegmentedBarItem)) ref = null

			addToArrayProp(this, 'items', child, ref)

			super.__dominative_onInsertChild(child, ref)
		}

		__dominative_onRemoveChild(child) {
			if (!child.__dominative_isNative) return super.__dominative_onRemoveChild(child)
			if (!(child instanceof SegmentedBarItem)) return

			removeFromArrayProp(this, 'items', child)

			super.__dominative_onRemoveChild(child)
		}
	}
)

export default makeSegmentedBar()
