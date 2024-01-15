# DOMiNATIVE

[![NPM](https://img.shields.io/npm/v/dominative.svg?style=flat)](https://www.npmjs.org/package/dominative)

The Next Gen, Minimally viable DOM Document implementation for NativeScript, built for performance

---

## Disclaimer

*A lack of maintenance does not imply that the project is obsolete. Rather, it suggests that the code is of such high quality that ongoing maintenance isn't necessary.*


## WARNING

This project, being focused on performance, does not include `innerHTML` support in its standard implementation. In browsers, `innerHTML` allows for efficient XML parsing and DOM tree generation through native code, which is significantly faster. However, in a JavaScript-simulated DOM, utilizing `innerHTML` becomes a costly process. It involves parsing the XML string in JavaScript and creating the associated tags, leading to the recursive creation of actual instances of native views in JavaScript. This process is considerably slower compared to directly using `createElement`.

For those who need to use `innerHTML` for specific reasons, further information is available in the section titled "innerHTML" [here](#innerhtml).

I suggest that framework developers think about incorporating methods for node creation that don't depend on `innerHTML` or `cloneNode`. This recommendation is particularly relevant considering that the same DOM implementation ([undom-ng](https://github.com/ClassicOldSong/undom-ng)) might be utilized in diverse environments, such as embedded devices with limited resources — specifically, those with less than 8MB of available memory and a CPU frequency under 500MHz. In such contexts, integrating an XML parser may not be the most efficient approach.

---


## Installation

Via npm:

`npm install dominative undom-ng`

**Note:** `undom-ng` is a peer dependency, you have to install it manually.

**Note:** The package name is `dominative`, not `nativescript-dom-ng`. Please install `dominative`.


---


## Usage

### Vanilla

app.js
```js
import { Application } from '@nativescript/core'
import { document } from 'dominative'

const page = document.body
const actionBar = document.createElement('ActionBar')

actionBar.title = 'Hello World!'

page.appendChild(actionBar)

Application.run({
	create: () => document
})
```

### with [ef.js](https://github.com/TheNeuronProject/ef.js)

[Playground](https://stackblitz.com/edit/ef-native-experiment?file=app%2Fapp.js)

App.eft

```efml
>ActionBar
	#title = Hello World!
	>ActionBarItem
		#text = Button
>StackLayout
	>Label
		.Welcome to the wonderland of ef.native!
```

app.js
```js
import { Application } from '@nativescript/core'
import { domImpl, document } from 'dominative'
import { setDOMImpl } from 'ef-core'
import App from 'App.eft'

setDOMImpl(domImpl)

const app = new App()
app.$mount({target: document.body})

Application.run({
	create: () => document
})
```

### with [SingUI](https://github.com/ClassicOldSong/SingUI)

[Playground](https://stackblitz.com/edit/singui-native-experiment?file=app%2Fapp.js)

app.js
```js
import { Application } from '@nativescript/core'
import { document } from 'dominative'
import { browser, prop, setGlobalCtx, useTags, useElement, build } from 'singui'

setGlobalCtx(browser(document))

const tags = useTags(false)

const app = (target) =>
	build(({attach}) => {
		const { ActionBar, NavigationButton, ActionItem, StackLayout, Label, Button } = tags

		ActionBar(() => {
			prop.title = 'Hello World!'
		})

		StackLayout(() => {
			let count = 0

			const {ret: updateText} = Label(() => {
				return text().$textContent(
					() => `You have tapped ${count} time${count === 1 ? '' : 's'}`
				)
			})

			Button(() => {
				prop.text = 'Tap me!'
				on('tap', () => {
					count += 1
					updateText()
				})
			})

			updateText()
		})

		attach(target)
	})

app(document.body)

Application.run({
	create: () => {
		return document
	},
})

```

### with [React](https://reactjs.org) + react-dom

[Playground](https://stackblitz.com/edit/nativescript-stackblitz-templates-zeazui?file=package.json,src%2Fappi.tsx) - by [Ammar Ahmed](https://github.com/ammarahm-ed)

**Note:** This demo might have some issues with Chrome. Use Firefox if necessary.

### with [Vue 3](https://vuejs.org/) + runtime-dom + [DOMiNATIVE-Vue](https://github.com/nativescript-community/vue)

[Playground](https://stackblitz.com/edit/nativescript-dominative-vue-3?file=app/App.vue)

app.js
```js
import { Application } from '@nativescript/core'
import { createApp } from '@dominative/vue'
import App from './App.vue'

const app = createApp(App)

app.$run()

```

### with [SolidJS](https://www.solidjs.com/) + [DOMiNATIVE-Solid](https://github.com/nativescript-community/solid-js)

[Playground](https://stackblitz.com/edit/nativescript-dominative-solid?file=app/Fapp.jsx)

app.jsx
```jsx
import { Application } from "@nativescript/core"
import { render } from "@dominative/solid"
import { createSignal } from "solid-js"

document.body.actionbarHidden = false

const App = () => {
	const [count, setCount] = createSignal(0)
	const increment = () => {
		setCount(c => c + 1)
	}
	return <>
	<actionbar title="Hello, SolidJS!"></actionbar>
	<stacklayout>
		<label>You have taapped {count()} time(s)</label>
		<button class="-primary" on:tap={increment}>Tap me!</button>
	</stacklayout>
	</>
}

render(App, document.body)

const create = () => document

Application.run({ create })

```


---

## Prepare global environment

Automatically register `document`, `window` and related variables globally:

```js
import { globalRegister } from 'dominative'

globalRegister(global)
```


---


## Register Elements

```js
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { RadListView } from 'nativescript-ui-listview'
import { registerElement, makeListView } from 'dominative'

// If you cannot determin what the component is based on, you can register it directly.
registerElement('RadSideDrawer', RadSideDrawer)
// Register with a specific type by using a pre-defined maker. Usually we check for inheritance, but with force we can make magic happen
registerElement('RadListView', makeListView(RadListView, {force: true}))
```

---


## Virtual Elements

Virtual elements are not real elements, but they appear as DOM elements to help organizing composition.

### Prop

Helper to put it's child/children to it's parent node's property by key

**Attributes:**

`key: String`: **RW** The prop name to set on parent.

`type: <'array'|'key'>`: **RW** Property type, could be an array prop or a single object prop. Once set, this prop couldn't be changed.

`value: any`: **RW** Value to be set to parent. Usually children of this current node. Don't touch unless you know what you're doing.

`parent: Element`: **R** Parent node of this node.

`class: String`: **RW** Helper to set `key` and `type`, could be `key:type` or `multi.level.key:type`

**Events:**

None.

### KeyProp

`Prop` but `type` already set to `key`.

### ArrayProp

`Prop` but `type` already set to `array`.

### ItemTemplate

**\* `Template` was renamed to `ItemTemplate` to avoid conflict with HTML `template` tag.**

An `ItemTemplate` element holds a template to be replicated later, or can create views programmatically.

**Attributes:**

Share mostly from `Prop`. Differences are listed below:

`key: String`: **RW** Same form `Prop`, also serves the key name of a `KeyedTemplate`. Default to `itemTemplate`.

`type: 'single'`: **R** Should not be able to set `type` on a `ItemTemplate`.

`value: Function<T extends ViewBase>`: **R** Same as `createView`.

`content: <T extends ViewBase>`: **RW** The single child of this node. Don't touch unless you know what you're doing.

`patch: Function<T extends ViewBase>(PatchOptions)`: **R** Method to patch an existing clone.

`createView: Function<T extends ViewBase>`: **R** Function to create view from this template.

**Events:**

`itemLoading`: Triggered when patching and template has no content. Set `event.view` to change the view of this item. Additional props on `event`: `view`, `index`, `item`, `data`. This event's callback argument doesn't extend from NativeScript's data object.

`createView`: Triggered when creating view from the template and template has no content. Set created view to `event.view`. If not set, view will be created by cloning the template. This event's callback argument doesn't extend from NativeScript's data object.

**Note:**

`ItemTemplate` element could only have one element child. If you'd like to have multiple children in a template, just use a different type of view or layout as the only child and insert your other contents inside.

## KeyedTemplates

By simpling putting `ItemTemplate`s inside an array `Prop` we could set up a KeyedTemplate.

Example:

```html
<ListView itemTemplateSelector="$item % 2 ? 'odd' : 'even'">
	<Prop key="itemTemplates" type="array">
		<ItemTemplate key="odd">
			<Label text="odd"/>
		</ItemTemplate>
		<ItemTemplate key="even">
			<Label text="even"/>
		</ItemTemplate>
	</Prop>
</ListView>
```

## Template Handling for Custom Components

There's a special maker caller `makeTemplateReceiver`, which you can use when a NativeScript component accepts templates.

Example:

```js
import { RadListView } from 'nativescript-ui-listview'
import { registerElement, makeTemplateReceiver } from 'dominative'

registerElement('RadListView', makeTemplateReceiver(RadListView, {
	templateProps: ['itemTemplate'],
	loadingEvents: ['itemLoading']
}))
```

`templateProps: Array<String>`: Props that accepts a template. Do not write keyed template props.

`loadingEvents: Array<String>`: Events that will fire on the component when items loading.

`itemEvents: Array<String>`: Custom events that will fire on the component referencing to an item.


---

## Tweaking

All elements added with `registerElement` is automatically extended with tweaking ability.

### Tweakable.defineEventOption(eventName: string, option: EventOption)

Define how a event should be initialized. If an event is defined with `bubbles: true` or `captures: true`, they'll automatically be registered to native at element creation.

Event option:

```js
{
	bubbles: boolean // should this event bubble, default false
	captures: boolean // should this event have capture phase, default false
	cancelable: boolean // should this event be cancelable, defalut true
}
```

Usage:

```js
const ButtonElement = document.defaultView.Button
ButtonElement.defineEventOption('tap', {
	bubbles: true,
	captures: true
})
```

### Tweakable.mapEvent(fromEvent: string, toEvent: string)

See [below](#hardcoded-events-and-props)

### Tweakable.mapProp(fromProp: string, toProp: string)

See [below](#hardcoded-events-and-props)


---


## Tree shaking

Tree shaking is off by default, but if you want a smaller bundle size, you can enable it manually by setting `__UI_USE_EXTERNAL_RENDERER__` global variable to true in your project's webpack config. For example:

```js
const { merge } = require('webpack-merge');

module.exports = (env) => {
	webpack.init(env);

	webpack.chainWebpack((config) => {
		config.plugin('DefinePlugin').tap((args) => {
			args[0] = merge(args[0], {
				__UI_USE_EXTERNAL_RENDERER__: true, // Set true to enable tree shaking
				__UI_USE_XML_PARSER__: false, // Usually XML parser isn't needed as well, so disabling it as well
			});

			return args;
		});
	});

	return webpack.resolveConfig();
};

```

But, **PLEASE NOTICE**, after tree shaking is enabled, you'll need to register {N} core components manually, otherwise they won't be available as elements. For example:

```js
import { AbsoluteLayout, StackLayout, Label, Button, registerElement } from 'dominative'

registerElement('AbsoluteLayout', AbsoluteLayout)
registerElement('StackLayout', StackLayout)
registerElement('Label', Label)
registerElement('Button', Button)
```

or you can just register them all with `registerAllElements`, although it's pointless when tree shaking is enabled:

```js
import { registerAllElements } from 'dominative'

registerAllElements()
````

`Frame`, `Page` and `ContentView` are registered by default.

---


## Caveats

### innerHTML

As highlighted in the initial warning, using `innerHTML` on a DOM created in JavaScript is quite resource-intensive. However, it's still possible to implement this feature on your own. To do this, ensure that your base class includes a setter method named `innerHTML` before you proceed with the registration of this element.

For example:

```js
import { StackLayout, registerElement } from 'dominative'

const StackLayoutWithInnerHTML = class extends StackLayout {
	// only setter is needed
	set innerHTML(val) {
		if (val === '') {
			// clear all children
		}

		const parsed = parseXML(val)
		createElementRecursively(this, parsed)
	}
}

registerElement('StackLayout', StackLayoutWithInnerHTML)
```

### cloneNode

While this method works as expected in most time, be aware that deep cloning might result in the loss of properties that are not set by attributes. Therefore, this approach is not generally recommended, akin to the advice regarding the use of `innerHTML`.

### Hardcoding in Frameworks

Frameworks are useful tools, yet their effectiveness diminishes when dealing with hardcoded elements. It's important to develop strategies to mitigate the negative impact of such hardcoded aspects.

**Please avoid hardcoding as it can be detrimental.**

#### Always lowercased tag names

Sometimes frameworks are just too thoughtful for you, they translate all your tag names to lowercase and no way to alter this behavior, which means your camelCase or PascalCase tag names won't work as intended.

We can alias our tag names to lowercase if you like:

```js
import { aliasTagName } from 'dominative'

const tagNameConverter = (PascalCaseName) => {
	// ...whatever your transformation code here
	// This is useful when your framework/renderer doesn't support document.createElement with uppercase letters.
	const transformedName = PascalCaseName.toLowerCase()
	return transformedName
}

// Convert all built-in tag names
aliasTagName(tagNameConverter)
```

#### Hardcoded events and props

Some frameworks work like magic by providing lots of "just works" features that you don't even need to think about what's going on behind. They're actually done by heavily assuming you're on a specific platform - browser, and hardcoded these features to browser specific features.

We have to mimic the events and props they hardcoded in order to make these frameworks happy:

```js
import { document } from 'dominative'

const TextFieldElement = document.defaultView.TextField
const ButtonElement = document.defaultView.Button

TextFieldElement.mapEvent('input', 'inputChange') // This is redirecting event handler registering for 'input' to 'inputChange'
TextFieldElement.mapProp('value', 'text') // This is redirecting access from 'value' prop to 'text' prop

ButtonElement.mapEvent('click', 'tap') // Redirect 'click' event to 'tap'

const input = document.createElement('TextField')
input.addEventListener('input', (event) => { // This is actually registered to `inputChange`
	console.log(event.target.value) // This is actually accessing `event.target.text`
})
```

Then the following code could work:

```html
<TextField v-model="userInput"/>
<!-- 'v-model' hardcoded with `input` or `change` event and `value` or `checked` prop, so we have to provide it with a emulated `input` event and `value` prop -->
```

```jsx
<button onClick="onTapHandler"></button> // 'onTapHandler' is actually registered to 'tap', since some frameworks hardcoded "possible" event names so they can know it's an event handler
```

---


## License

MIT
