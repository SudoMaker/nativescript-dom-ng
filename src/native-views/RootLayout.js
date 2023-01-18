import { RootLayout } from '@nativescript/core'
import { named } from './mixin.js'
import { makeGridLayout } from './GridLayout.js'

export const makeRootLayout = /*#__PURE__*/named(
	'RootLayout', 'RootLayout', RootLayout,
	(_, options) => class RootLayoutElement extends /*#__PURE__*/makeGridLayout(_, options) {}
)

export default /*#__PURE__*/makeRootLayout.master()
