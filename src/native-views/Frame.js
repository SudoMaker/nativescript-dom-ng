import { PageBase, Frame } from '@nativescript/core'
import { named, makeView } from "./mixin.js"

export const makeFrame = named(
	'Frame', 'Frame', Frame,
	_ => class FrameElement extends makeView(_) {
		onSetAttribute(key, val) {
			if (key.toLowerCase() === "defaultpage" && val) {
				const page = new val()
				this.navigate({ create: () => page})
				return
			}
			super.onSetAttribute(key, val)
		}

		onInsertChild(child, ref) {
			if (!child.__isNative || (ref && !ref.__isNative)) return super.onInsertChild(child, ref)

			if (child instanceof PageBase) {
				this.navigate({ create: () => child, clearHistory: true })
			}

			super.onInsertChild(child, ref)
		}
	}
)

export default makeFrame()
