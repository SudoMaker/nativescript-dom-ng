import { ListView, ContentView, ViewBase } from '@nativescript/core'
import { named, makeView } from './mixin.js'
import { addToArrayProp, removeFromArrayProp } from '../utils.js'

class DummyContentView extends ContentView {}
const defaultItemTemplate = () => new DummyContentView()

const updateList = (self) => {
	/* eslint-disable camelcase */
	if (self.__dominative_listViewUpdating) return
	self.__dominative_listViewUpdating = true
	setTimeout(() => {
		self.refresh()
		self.__dominative_listViewUpdating = false
	}, 0)
}

const handleItemLoading = (self, data) => {
	if (self.itemTemplate !== defaultItemTemplate) return
	if (!self.items) return
	const itemIndex = data.index

	let item = null
	if (self.items.getItem) item = self.items.getItem(itemIndex)
	else item = self.items[itemIndex]

	if (item instanceof ViewBase && data.view instanceof DummyContentView) {
		if (!item.parent) data.view.content = item
		else if (item.parent instanceof DummyContentView) {
			item.parent.content = null
			data.view.content = item
		}
	}
}

export const makeListView = named(
	'ListView', 'ListView', ListView,
	_ => class ListViewElement extends makeView(_) {
		constructor(...args) {
			super(...args)
			this.items = []
			this.__defaultItemLoadingHandler = data => handleItemLoading(this, data)
			super.itemTemplate = defaultItemTemplate
			super.addEventListener(ListView.itemLoadingEvent, this.__defaultItemLoadingHandler)
		}

		get itemTemplate() {
			return super.itemTemplate
		}
		set itemTemplate(val) {
			super.itemTemplate = val
			super.removeEventListener(ListView.itemLoadingEvent, this.__defaultItemLoadingHandler)
		}

		get itemTemplates() {
			return super.itemTemplates
		}
		set itemTemplates(val) {
			super.itemTemplates = val
			this.itemTemplate = null
		}

		onInsertChild(child, ref) {
			if (
				this.itemTemplate !== defaultItemTemplate ||
				!child.__isNative ||
				(ref && !ref.__isNative)
			) return super.onInsertChild(child, ref)

			addToArrayProp(this, 'items', child, ref)

			super.onInsertChild(child, ref)
			updateList(this)
		}

		onRemoveChild(child) {
			if (
				this.itemTemplate !== defaultItemTemplate ||
				!child.__isNative
			) return super.onRemoveChild(child)

			removeFromArrayProp(this, 'items', child)

			super.onRemoveChild(child)
			updateList(this)
		}
	}
)

export default makeListView()
