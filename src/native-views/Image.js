import { Image } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeImage = named(
	'Image', 'Image', Image,
	_ => class ImageElement extends makeView(_) {}
)

export default makeImage()
