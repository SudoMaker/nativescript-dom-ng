import { ProxyViewContainer } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeProxyViewContainer = named(
	'ProxyViewContainer', 'ProxyViewContainer', ProxyViewContainer,
	_ => class ProxyViewContainerElement extends makeLayout(_) {}
)

export default makeProxyViewContainer.master()
