import { GridLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeGridLayout = /*#__PURE__*/named(
	'GridLayout', 'GridLayout', GridLayout,
	_ => class GridLayoutElement extends /*#__PURE__*/makeLayout(_) {}
)

export default /*#__PURE__*/makeGridLayout.master()
