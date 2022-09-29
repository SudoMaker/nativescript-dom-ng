import { DockLayout } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeDockLayout = named(
	'DockLayout', 'DockLayout', DockLayout,
	_ => class DockLayoutElement extends makeLayout(_) {}
)

export default makeDockLayout.master()
