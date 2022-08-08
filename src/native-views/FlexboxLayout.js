import { FlexboxLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeFlexboxLayout = named(
	'FlexboxLayout', 'FlexboxLayout', FlexboxLayout,
	_ => class FlexboxLayoutElement extends makeLayout(_) {}
)

export default makeFlexboxLayout()
