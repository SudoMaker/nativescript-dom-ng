import { DockLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeDockLayout = /*#__PURE__*/named(
	'DockLayout', 'DockLayout', DockLayout,
	(_, options) => class DockLayoutElement extends /*#__PURE__*/makeLayout(_, options) {}
)

export default /*#__PURE__*/makeDockLayout.master()
