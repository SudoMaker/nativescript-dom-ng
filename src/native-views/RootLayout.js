import { RootLayout } from '@nativescript/core'
import { named } from './mixin.js'
import { makeGridLayout } from './GridLayout.js'

export const makeRootLayout = named(
	'RootLayout', 'RootLayout', RootLayout,
	_ => class RootLayoutElement extends makeGridLayout(_) {}
)

export default makeRootLayout.master()
