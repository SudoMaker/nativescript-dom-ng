import { Slider } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSlider = named(
	'Slider', 'Slider', Slider,
	_ => class SliderElement extends makeView(_) {}
)

export default makeSlider.master()
