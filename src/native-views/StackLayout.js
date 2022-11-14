import { StackLayout } from '@nativescript/core'
import { named, makeLayout } from './mixin.js'

export const makeStackLayout = /*#__PURE__*/named(
	'StackLayout', 'StackLayout', StackLayout,
	_ => class StackLayoutElement extends /*#__PURE__*/makeLayout(_) {}
)

export default /*#__PURE__*/makeStackLayout.master()
