import { Page, ActionBar } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import * as symbol from '../symbols.js'

export const makePage = named(
	'Page', 'Page', Page,
	_ => class PageElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)

			if (child instanceof ActionBar) {
				this.actionBar = child
			} else {
				this.content = child
			}

			super[symbol.onInsertChild](child, ref)
		}
	}
)

export default makePage()
