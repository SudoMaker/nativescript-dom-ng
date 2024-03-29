import { Page, ActionBar } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makePage = /*#__PURE__*/named(
	'Page', 'Page', Page,
	(_, options) => class PageElement extends /*#__PURE__*/makeView(_, options) {
		__dominative_onInsertChild(child, ref) {
			if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return super.__dominative_onInsertChild(child, ref)

			if (child instanceof ActionBar) {
				this.actionBar = child
			} else {
				this.content = child
			}

			super.__dominative_onInsertChild(child, ref)
		}
	}
)

export default /*#__PURE__*/makePage.master()
