import { GridLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeGridLayout = named(
	'GridLayout', 'GridLayout', GridLayout,
	_ => class GridLayoutElement extends makeLayout(_) {}
)

export default makeGridLayout()
