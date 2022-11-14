import { HtmlView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeHtmlView = /*#__PURE__*/named(
	'HtmlView', 'HtmlView', HtmlView,
	_ => class HtmlViewElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeHtmlView.master()
