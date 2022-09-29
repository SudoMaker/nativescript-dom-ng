import { HtmlView } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeHtmlView = named(
	'HtmlView', 'HtmlView', HtmlView,
	_ => class HtmlViewElement extends makeView(_) {}
)

export default makeHtmlView.master()
