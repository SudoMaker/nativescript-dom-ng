import { WrapLayout } from '@nativescript/core'
import { named, makeLayout } from './mixin.js'

export const makeWrapLayout = named(
	'WrapLayout', 'WrapLayout', WrapLayout,
	_ => class WrapLayoutElement extends makeLayout(_) {}
)

export default makeWrapLayout.master()
