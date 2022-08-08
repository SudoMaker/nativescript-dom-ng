# DOMiNATIVE

[![NPM](https://img.shields.io/npm/v/dominative.svg?style=flat)](https://www.npmjs.org/package/dominative)

### **Minimally viable DOM Document implementation for NativeScript**

**NOTE** THIS IS STILL EXPERIMENTAL.

---


## Installation

Via npm:

`npm install dominative`


---


## Usage

app.js
```js
import { Application } from '@nativescript/core'
import { document } from 'dominative'

const frame = document.createElement('Frame')
const page = document.createElement('Page')
const actionBar = document.createElement('ActionBar')

actionBar.title = 'Hello World!'

page.appendChild(actionBar)
frame.appendChild(page)

Application.run({
	create: () => frame
})
```

with ef.js

App.eft

```efml
>Frame
	>Page
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
import {document, domImpl} from 'dominative'
import {setDOMImpl} from 'ef-core'
import App from 'App.eft'

setDOMImpl(domImpl)

const app = new App()

Application.run({
	create: () => app.$refs.root
})
```
