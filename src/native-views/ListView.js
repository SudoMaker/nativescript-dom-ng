import { ListView, ObservableArray } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { defaultItemTemplate, makeTemplateReceiver } from './TemplateReceiver.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'
import * as symbol from '../symbols.js'

export const makeListView = named(
	'ListView', 'ListView', ListView,
	_ => class ListViewElement extends makeTemplateReceiver(makeView(_), {
		templateProps: ['itemTemplate'],
		loadingEvents: [ListView.itemLoadingEvent]
	}) {
		constructor(...args) {
			super(...args)
			this.items = new ObservableArray()
		}

		[symbol.onInsertChild](child, ref) {
			if (
				this.itemTemplate !== defaultItemTemplate ||
				!child[symbol.isNative] ||
				(ref && !ref[symbol.isNative])
			) return super[symbol.onInsertChild](child, ref)

			addToArrayProp(this, 'items', child, ref)

			super[symbol.onInsertChild](child, ref)
		}

		[symbol.onRemoveChild](child) {
			if (
				this.itemTemplate !== defaultItemTemplate ||
				!child[symbol.isNative]
			) return super[symbol.onRemoveChild](child)

			removeFromArrayProp(this, 'items', child)

			super[symbol.onRemoveChild](child)
		}
	}
)

export default makeListView()
