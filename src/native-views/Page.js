import { Page, ActionBar } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makePage = named(
	'Page', 'Page', Page,
	_ => class PageElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return

			if (child instanceof ActionBar) {
				this.actionBar = child
			} else {
				this.content = child
			}

			super.onInsertChild(child, ref)
		}
	}
)

export default makePage()
