import { ViewBase } from '@nativescript/core'
import { named } from './mixin.js'
import { TemplateWrapperView } from '../pseudo-elements/ItemTemplate.js'

export const defaultItemTemplate = () => new TemplateWrapperView()

const handleItemLoading = (self, data) => {
	if (!self.items || !self.items.length || (!data.view && !data.object)) return

	const itemIndex = data.index
	const wrapper = data.view || data.object

	if (!(wrapper && wrapper.__dominative_template)) return

	let item = data.bindingContext

	if (!item) {
		if (self.items.getItem) item = self.items.getItem(itemIndex)
		else item = self.items[itemIndex]
	}

	if (wrapper.__dominative_template) {
		const template = wrapper.__dominative_template
		const newView = wrapper._batchUpdate(() => template.patch({
			view: wrapper,
			index: itemIndex,
			item,
			data
		}))

		if (wrapper !== newView) event.view = newView

		return
	}

	if (self.itemTemplate === defaultItemTemplate && item instanceof ViewBase && !item.__dominative_isPseudoElement) {
		if (item.parent instanceof TemplateWrapperView) item.parent.content = null
		wrapper.content = item
	}
}

export const makeTemplateReceiver = /*#__PURE__*/named(
	'TemplateReceiver', 'ViewBase', ViewBase,
	(_, {
		templateProps = [],
		loadingEvents = []
	} = {}) => class TemplateReceiverElement extends _ {
		constructor(...args) {
			super(...args)
			const loadingHandler = data => handleItemLoading(this, data)
			for (let i of templateProps) super[i] = defaultItemTemplate
			for (let i of loadingEvents) super.addEventListener(i, loadingHandler)
		}
	}
)
