import { ActionItem, ViewBase } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeActionItem = named(
	'ActionItem', 'ActionItem', ActionItem,
	_ => class ActionItemElement extends makeView(_) {
		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return super.onInsertChild(child, ref)

			if (child instanceof ViewBase) {
				this.actionView = child
			}

			super.onInsertChild(child, ref)
		}

		onRemoveChild(child) {
			if (!child.__isNative) return super.onRemoveChild(child)

			if (child === this.actionView) this.actionView = null

			super.onRemoveChild(child)
		}
	}
)

export default makeActionItem()
