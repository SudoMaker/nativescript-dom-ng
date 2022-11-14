import { FlexboxLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeFlexboxLayout = /*#__PURE__*/named(
	'FlexboxLayout', 'FlexboxLayout', FlexboxLayout,
	_ => class FlexboxLayoutElement extends /*#__PURE__*/makeLayout(_) {}
)

export default /*#__PURE__*/makeFlexboxLayout.master()
