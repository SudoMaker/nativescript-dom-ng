import { StackLayout } from '@nativescript/core'
import { named, makeLayout } from './mixin.js'

export const makeStackLayout = named(
	'StackLayout', 'StackLayout', StackLayout,
	_ => class StackLayoutElement extends makeLayout(_) {}
)

export default makeStackLayout.master()
