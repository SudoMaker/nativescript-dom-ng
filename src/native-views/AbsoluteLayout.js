import { AbsoluteLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeAbsoluteLayout = /*#__PURE__*/named(
	'AbsoluteLayout', 'AbsoluteLayout', AbsoluteLayout,
	_ => class AbsoluteLayoutElement extends /*#__PURE__*/makeLayout(_) {}
)

export default /*#__PURE__*/makeAbsoluteLayout.master()
