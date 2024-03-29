import { WrapLayout } from '@nativescript/core'
import { named, makeLayout } from './mixin.js'

export const makeWrapLayout = /*#__PURE__*/named(
	'WrapLayout', 'WrapLayout', WrapLayout,
	(_, options) => class WrapLayoutElement extends /*#__PURE__*/makeLayout(_, options) {}
)

export default /*#__PURE__*/makeWrapLayout.master()
