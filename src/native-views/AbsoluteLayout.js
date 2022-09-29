import { AbsoluteLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeAbsoluteLayout = named(
	'AbsoluteLayout', 'AbsoluteLayout', AbsoluteLayout,
	_ => class AbsoluteLayoutElement extends makeLayout(_) {}
)

export default makeAbsoluteLayout.master()
