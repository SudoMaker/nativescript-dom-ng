import { RootLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeRootLayout = named(
	'RootLayout', 'RootLayout', RootLayout,
	_ => class RootLayoutElement extends makeLayout(_) {}
)

export default makeRootLayout()
