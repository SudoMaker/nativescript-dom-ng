import { FlexboxLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeFlexboxLayout = /*#__PURE__*/named(
	'FlexboxLayout', 'FlexboxLayout', FlexboxLayout,
	(_, options) => class FlexboxLayoutElement extends /*#__PURE__*/makeLayout(_, options) {}
)

export default /*#__PURE__*/makeFlexboxLayout.master()
