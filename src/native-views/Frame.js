import { PageBase, Frame } from '@nativescript/core'
import { named, makeView } from "./mixin.js"
import * as symbol from '../symbols.js'

export const makeFrame = named(
	'Frame', 'Frame', Frame,
	_ => class FrameElement extends makeView(_) {
		[symbol.onSetAttributeNS](ns, key, val) {
			if (ns) return
			if (key.toLowerCase() === "defaultpage" && val) {
				const page = new val()
				this.navigate({ create: () => page})
				return
			}
			super[symbol.onSetAttributeNS](key, val)
		}

		[symbol.onInsertChild](child, ref) {
			if (!child[symbol.isNative] || (ref && !ref[symbol.isNative])) return super[symbol.onInsertChild](child, ref)

			if (child instanceof PageBase) {
				this.navigate({ create: () => child, clearHistory: true })
			}

			super[symbol.onInsertChild](child, ref)
		}
	}
)

export default makeFrame()
