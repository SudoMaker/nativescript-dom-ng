import { ProxyViewContainer } from '@nativescript/core'
import { named, makeLayout } from "./mixin.js"

export const makeProxyViewContainer = /*#__PURE__*/named(
	'ProxyViewContainer', 'ProxyViewContainer', ProxyViewContainer,
	_ => class ProxyViewContainerElement extends /*#__PURE__*/makeLayout(_) {}
)

export default /*#__PURE__*/makeProxyViewContainer.master()
