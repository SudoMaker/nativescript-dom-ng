import { ActionBar, ActionItem, NavigationButton } from '@nativescript/core'
import { isNode } from '@utls/undom-ef'
import { named, makeView } from './mixin.js'
import * as symbol from '../symbols.js'

export const makeActionBar = named(
	'ActionBar', 'ActionBar', ActionBar,
	_ => class ActionBarElement extends makeView(_) {
		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)

			if (child instanceof NavigationButton) {
				if (this.navigationButton && isNode(this.navigationButton)) this.navigationButton.remove()
				this.navigationButton = child
			} else if (child instanceof ActionItem) {
				if (ref instanceof ActionItem) {
					const items = this.actionItems.getItems()
					const refIndex = items.indexOf(items)
					if (refIndex < 0) throw new Error('Reference item could not be found on the parent node.')
					const restItems = []
					while (items.length > refIndex) {
						const popedItem = items.pop()
						this.actionItems.removeItem(popedItem)
						restItems.push(popedItem)
					}
					this.actionItems.addItem(child)
					while (restItems.length > 0) {
						this.actionItems.addItem(restItems.pop())
					}
				} else this.actionItems.addItem(child)
			}

			super[symbol.onInsertChild](child, ref)
		}

		[symbol.onRemoveChild](child) {
			if (!child[symbol.isNative]) return super[symbol.onRemoveChild](child)

			if (child instanceof NavigationButton && child === this.navigationButton) {
				this.navigationButton = null
			} else if (child instanceof ActionItem) {
				this.actionItems.removeItem(child)
			}

			super[symbol.onRemoveChild](child)
		}
	}
)

export default makeActionBar()
