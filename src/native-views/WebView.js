import { WebView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeWebView = named(
	'WebView', 'WebView', WebView,
	_ => class WebViewElement extends makeView(_) {}
)

export default makeWebView.master()
