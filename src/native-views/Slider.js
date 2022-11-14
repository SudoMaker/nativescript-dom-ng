import { Slider } from '@nativescript/core'
import { named, makeView } from './mixin.js'

export const makeSlider = /*#__PURE__*/named(
	'Slider', 'Slider', Slider,
	_ => class SliderElement extends /*#__PURE__*/makeView(_) {}
)

export default /*#__PURE__*/makeSlider.master()
