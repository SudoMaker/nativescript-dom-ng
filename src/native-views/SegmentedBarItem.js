import { SegmentedBarItem } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSegmentedBarItem = named(
	'SegmentedBarItem', 'SegmentedBarItem', SegmentedBarItem,
	_ => class SegmentedBarItemElement extends makeView(_) {}
)

export default makeSegmentedBarItem()
