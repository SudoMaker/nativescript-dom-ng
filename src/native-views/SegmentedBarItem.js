import { SegmentedBarItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSegmentedBarItem = /*#__PURE__*/named(
	'SegmentedBarItem', 'SegmentedBarItem', SegmentedBarItem,
	_ => class SegmentedBarItemElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeSegmentedBarItem.master()
