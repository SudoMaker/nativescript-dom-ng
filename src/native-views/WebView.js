import { WebView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeWebView = /*#__PURE__*/named(
	'WebView', 'WebView', WebView,
	(_, options) => class WebViewElement extends /*#__PURE__*/makeView(_, options) {}
)

export default /*#__PURE__*/makeWebView.master()
