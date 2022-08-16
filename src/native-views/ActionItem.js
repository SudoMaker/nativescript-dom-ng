import { ActionItem, ViewBase } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import * as symbol from '../symbols.js'

export const makeActionItem = named(
	'ActionItem', 'ActionItem', ActionItem,
	_ => class ActionItemElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)

			if (child instanceof ViewBase) {
				this.actionView = child
			}

			super[symbol.onInsertChild](child, ref)
		}

		[symbol.onRemoveChild](child) {
			if (!child[symbol.isNative]) return super[symbol.onRemoveChild](child)

			if (child === this.actionView) this.actionView = null

			super[symbol.onRemoveChild](child)
		}
	}
)

export default makeActionItem()
