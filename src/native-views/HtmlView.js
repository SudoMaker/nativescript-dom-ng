import { HtmlView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeHtmlView = /*#__PURE__*/named(
	'HtmlView', 'HtmlView', HtmlView,
	(_, options) => class HtmlViewElement extends /*#__PURE__*/makeView(_, options) {}
)

export default /*#__PURE__*/makeHtmlView.master()
