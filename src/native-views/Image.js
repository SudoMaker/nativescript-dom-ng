import { Image } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeImage = /*#__PURE__*/named(
	'Image', 'Image', Image,
	(_, options) => class ImageElement extends /*#__PURE__*/makeView(_, options) {}
)

export default /*#__PURE__*/makeImage.master()
