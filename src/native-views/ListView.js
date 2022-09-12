import { ListView, ObservableArray } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { defaultItemTemplate, makeTemplateReceiver } from './TemplateReceiver.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

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

		__dominative_onInsertChild(child, ref) {
			if (
				this.itemTemplate !== defaultItemTemplate ||
				!child.__dominative_isNative ||
				(ref && !ref.__dominative_isNative)
			) return super.__dominative_onInsertChild(child, ref)

			addToArrayProp(this, 'items', child, ref)


			super.__dominative_onInsertChild(child, ref)
		}

		__dominative_onRemoveChild(child) {
			if (
				this.itemTemplate !== defaultItemTemplate ||
				!child.__dominative_isNative
			) return super.__dominative_onRemoveChild(child)

			removeFromArrayProp(this, 'items', child)

			super.__dominative_onRemoveChild(child)
		}
	}
)

export default makeListView()
