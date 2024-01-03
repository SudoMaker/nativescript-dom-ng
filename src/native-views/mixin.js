/* global __IOS__ __ANDROID__ */

import { ViewBase, LayoutBase, TextBase, EditableTextBase } from '@nativescript/core'
import { named, resolvePath, mergeProps } from '../utils.js'

/* eslint-disable spaced-comment */

const makeView = /*#__PURE__*/named(
	'View', 'ViewBase', ViewBase,
	(_, options) => {
		class SubView extends _ {
			/* eslint-disable class-methods-use-this, no-empty-function */
			constructor(ownerDocument, ...args) {
				// ownerDocument does nothing for now, ignore
				super(...args)
				this.__dominative_isNative = true
				this.__dominative_role = 'View'
				Object.defineProperty(this, '__dominative_eventHandlers', {
					enumerable: false,
					value: {}
				})
			}

			__dominative_native_removeChild(child) {
				return super.removeChild(child)
			}

			__dominative_onInsertChild() {}
			__dominative_onRemoveChild() {}

			__dominative_onSetTextContent() {}
			__dominative_onGetTextContent() {}

			__dominative_onAddEventListener(...args) {
				return super.addEventListener(...args)
			}
			__dominative_onRemoveEventListener(...args) {
				return super.removeEventListener(...args)
			}

			__dominative_onAddedEventListener(...args) {
				return super.addEventListener(...args)
			}
			__dominative_onRemovedEventListener(...args) {
				return super.removeEventListener(...args)
			}

			__dominative_onSetAttributeNS(ns, name, value) {
				if (ns) return

				if (__ANDROID__) {
					if (name.startsWith('ios') && (name[3] === '.' || name[3] === ':')) return
					if (name.startsWith('android:')) name = name.substring(8)
				}

				if (__IOS__) {
					if (name.startsWith('android') && (name[7] === '.' || name[7] === ':')) return
					if (name.startsWith('ios:')) name = name.substring(4)
				}

				if (name === 'class') {
					super.className = value
					return
				}

				const [base, key] = resolvePath(name, this)
				base[key] = value
			}

			__dominative_onGetAttributeNS(ns, name, updateValue) {
				if (ns) return

				if (name === 'class') {
					updateValue(super.className)
					return
				}

				const [base, key] = resolvePath(name, this)
				updateValue(base[key])
			}

			__dominative_onRemoveAttributeNS(ns, name) {
				// eslint-disable-next-line no-void
				this.setAttributeNS(ns, name, void(0))
			}
		}

		if (options) {
			const { childrenPolicy } = options

			const proto = SubView.prototype

			if (childrenPolicy) {
				switch (childrenPolicy) {
					case 'layout': {
						Object.defineProperties(proto, {
							__dominative_onInsertChild: {
								value(child, ref) {
									if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return

									if (ref) {
										const refIndex = this.getChildIndex(ref)
										this.insertChild(child, refIndex)
									} else {
										this.addChild(child)
									}
								},
								configurable: true,
								writable: true
							},
							__dominative_onRemoveChild: {
								value(child) {
									if (!child.__dominative_isNative) return
									if (child.nodeType === 3) return

									this.__dominative_native_removeChild(child)
								},
								configurable: true,
								writable: true
							}
						})

						break
					}
					case 'content': {
						Object.defineProperties(proto, {
							__dominative_onInsertChild: {
								value(child, ref) {
									if (!child.__dominative_isNative || (ref && !ref.__dominative_isNative)) return

									if (this.content && this.content.__dominative_isNative) this.content.remove()
									this.content = child
								},
								configurable: true,
								writable: true
							},
							__dominative_onRemoveChild: {
								value(child) {
									if (!child.__dominative_isNative) return

									this.content = null
								},
								configurable: true,
								writable: true
							}
						})

						break
					}
					case 'builder': {
						Object.defineProperties(proto, {
							__dominative_onInsertChild: {
								value(child) {
									if (!child.__dominative_isNative) return
									if (child.nodeType === 1) this._addChildFromBuilder(child.constructor.name, child)
								},
								configurable: true,
								writable: true
							},
							__dominative_onRemoveChild: {
								value(child) {
									if (!child.__dominative_isNative) return
									if (child.nodeType === 1) this._removeView(child)
								},
								configurable: true,
								writable: true
							}
						})

						break
					}
					case (childrenPolicy instanceof Object): {
						const { insertion, removal } = childrenPolicy

						if (insertion) {
							Object.defineProperty(proto, '__dominative_onInsertChild', {
								value: insertion,
								configurable: true,
								writable: true
							})
						}
						if (removal) {
							Object.defineProperty(proto, '__dominative_onRemoveChild', {
								value: removal,
								configurable: true,
								writable: true
							})
						}

						break
					}
					case 'none':
					default: {
						// do nhtoing
					}
				}
			}
		}

		return SubView
	}
)

const makeLayout = /*#__PURE__*/named(
	'Layout', 'LayoutBase', LayoutBase,
	(_, options) => class SubLayout extends /*#__PURE__*/makeView(_, mergeProps({childrenPolicy: 'layout'}, options)) {
		constructor(...args) {
			super(...args)
			this.__dominative_role = 'Layout'
		}
	}
)

const makeText = /*#__PURE__*/named(
	'Text', 'TextBase', TextBase,
	(_, options) => class SubText extends /*#__PURE__*/makeView(_, mergeProps({childrenPolicy: 'builder'}, options)) {
		constructor(...args) {
			super(...args)
			this.__dominative_role = 'Text'
		}

		__dominative_updateText() {
			super.text = this.textContent
		}

		__dominative_onSetTextContent(val) {
			super.text = val
		}
		__dominative_onGetTextContent() {
			if (this.firstChild) return
			return super.text
		}

		__dominative_onInsertChild(child, ref) {
			super.__dominative_onInsertChild(child, ref)
			if (child.nodeType === 3) this.__dominative_updateText()
		}
		__dominative_onRemoveChild(child) {
			super.__dominative_onRemoveChild(child)
			if (child.nodeType === 3) this.__dominative_updateText()
		}
	}
)

const makeEditableText = /*#__PURE__*/named(
	'EditableText', 'EditableTextBase', EditableTextBase,
	(_, options) => class SubEditableText extends /*#__PURE__*/makeText(_, options) {
		constructor(...args) {
			super(...args)
			this.__dominative_role = 'EditableText'
		}
	}
)

export {
	named,
	makeView,
	makeLayout,
	makeText,
	makeEditableText
}
