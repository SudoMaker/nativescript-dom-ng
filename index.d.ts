import {
	AbsoluteLayout,
	ActionBar,
	ActionItem,
	ActivityIndicator,
	Button,
	ContentView,
	DatePicker,
	DockLayout,
	FlexboxLayout,
	FormattedString,
	Frame,
	GridLayout,
	HtmlView,
	Image,
	Label,
	ListPicker,
	ListView,
	NavigationButton,
	Page,
	Placeholder,
	Progress,
	ProxyViewContainer,
	RootLayout,
	ScrollView,
	SearchBar,
	SegmentedBar,
	SegmentedBarItem,
	Slider,
	Span,
	StackLayout,
	Style,
	Switch,
	TabView,
	TabViewItem,
	TextField,
	TextView,
	TimePicker,
	ViewBase,
	WebView,
	WrapLayout,
} from "@nativescript/core";

declare module "dominative" {
	interface ElementCreationOptions {
		is?: string;
	}

	interface EventListener {
		(evt: Event): void;
	}

	interface EventListenerObject {
		handleEvent(object: Event): void;
	}

	type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

	interface AddEventListenerOptions extends EventListenerOptions {
		once?: boolean;
		passive?: boolean;
		//signal?: AbortSignal;
	}

	interface EventListenerOptions {
		capture?: boolean;
	}

	type DOMHighResTimeStamp = number;

	export interface Event {
		/** Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise. */
		readonly bubbles: boolean;
		/** Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method. */
		readonly cancelable: boolean;
		/** Returns the object whose event listener's callback is currently being invoked. */
		readonly currentTarget: EventTarget | null;
		/** Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise. */
		readonly defaultPrevented: boolean;
		/** Returns the type of event, e.g. "click", "hashchange", or "submit". */
		readonly type: string;
		initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
		/** If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled. */
		preventDefault(): void;
		/** Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects. */
		stopImmediatePropagation(): void;
		/** When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object. */
		stopPropagation(): void;
	}

	export class Node extends ViewBase {
		constructor(nodeType: number, nodeName: string);
		readonly nodeType: number;
		readonly nodeName: string;
		readonly tagName: string;
		parentNode: ParentNode;
		get nextSibling(): Node;
		get previousSibling(): Node;

		get firstChild(): Node;
		get lastChild(): Node;

		hasChildNodes(): boolean;
		replaceWith(...nodes: Node[]): void;
		cloneNode(deep: boolean): Node;
		remove(): void;
	}

	//@ts-ignore
	export interface Text extends Node {
		constructor(text: string);
		set textContent(value: string);
		get textContent(): string;
	}

	export interface EventTarget {
		/**
		 * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.
		 *
		 * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.
		 *
		 * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
		 *
		 * When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.
		 *
		 * When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.
		 *
		 * If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.
		 *
		 * The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.
		 */
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject | null,
			options?: AddEventListenerOptions | boolean
		): void;
		/** Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise. */
		dispatchEvent(event: Event): boolean;
		/** Removes the event listener in target's event listener list with the same type, callback, and options. */
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject | null,
			options?: EventListenerOptions | boolean
		): void;
	}

	export class Element extends ParentNode implements EventTarget {
		attributes: { namespace: string; name: string }[];
		style: Style;
		localName: string;
		//@ts-ignore
		get className(): string;

		set className(val: string);

		get cssText(): string;
		set cssText(val: string);
		//@ts-ignore
		get children(): Element[];

		namespaceURI(): string;

		get innerHTML(): string;

		set innerHTML(value: string);

		get outerHTML(): string;

		set outerHTML(value: string);

		get textContent(): string;

		set textContent(value: string);

		insertBefore(child: Node, ref: Node): Node;

		setAttribute(qualifiedName: string, value: string): void;
		getAttribute(qualifiedName: string): string | null;

		removeAttribute(qualifiedName: string): void;
		/** Removes element's attribute whose namespace is namespace and local name is localName. */
		removeAttributeNS(namespace: string | null, localName: string): void;

		setAttributeNS(
			namespace: string | null,
			qualifiedName: string,
			value: string
		): void;
		/** Returns element's attribute whose namespace is namespace and local name is localName, and null if there is no such attribute otherwise. */
		getAttributeNS(namespace: string | null, localName: string): string | null;
		//@ts-ignore
		addEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | AddEventListenerOptions
		): void;
		dispatchEvent(event: Event): boolean;
		removeEventListener(
			type: string,
			callback: EventListenerOrEventListenerObject,
			options?: boolean | EventListenerOptions
		): void;
	}

	export interface CharacterData extends Node {
		get data(): string;
		set data(data: string);

		get length(): number;

		get nodeValue(): string;
		set nodeValue(data: string);

		get textContent(): string;
		set textContent(value: string);

		appendData(data: string);
	}

	export interface Comment extends CharacterData {
		constructor(data: string): void;
	}

	export class ParentNode extends Node {
		childElementCount: number;
		get firstElementChild(): Node;
		get lastElementChild(): Node;
		get children(): Node[];
		get childNodes(): Node;
		append(...nodes: Node[]): void;
		insertBefore(child: Node, ref: Node): Node;
		replaceChild(child: Node, ref: Node): Node;
		appendChild(child: Node): Node;
		get textContent(): string;
		set textContent(value: string);
		removeChild(child: Node): Node;
	}

	export interface Scope {
		Event: Event;
		Node: Node;
		ParentNode: ParentNode;
		HTMLElement: HTMLElement;
		SVGElement: SVGElement;
		DocumentFragment: DocumentFragment;
		Comment: Comment;
		CharacterData: CharacterData;
		Text: Text;
		Element: Element;
		Document: Document;
	}

	export const scope: Scope;

	export class Document extends Element {
		createElement<K extends keyof HTMLElementTagNameMap>(
			tagName: K
		): //options?: ElementCreationOptions
		HTMLElementTagNameMap[K];
		createElementNS(
			namespace: string | null,
			qualifiedName: string
		): //options?: ElementCreationOptions
		Element;
		createTextNode(text: string): Text;
		createDocumentFragment(): DocumentFragment;
		createEvent(type: string): Event;
		createComment(data: string): Comment;
		get defaultView(): Scope;
	}

	export class DocumentFragment extends ParentNode {}

	export class SVGElement extends Element {}

	export class HTMLElement<T = ViewBase> extends Element {
		style: Style;
	}

	export class Prop extends HTMLElement {
		constructor(key: string, type: string);
		get key(): string;
		set key(key: string);
		get class(): string;
		set class(value: string);
		get type(): string;
		set type(type: string);
		get value(): any;
		set value(value: any);
		//@ts-ignore
		get parent(): ParentNode;
	}

	export class ItemTemplate extends Prop {
		get content(): any;
		set content(value: any);
		patch(data: {
			view: HTMLElement;
			index: number;
			item: any;
			data: any;
		}): HTMLElement;
		createView(): HTMLElement;
	}

	export const document: Document;

	export function aliasTagName(nameHnadler: (tag: string) => string): void;
	export function isNode(node: any): boolean;
	export const domImpl: {
		Node: Node;
		document: Document;
		isNode(node: any): boolean;
	};
	export function createDocument(): Document;
	export function registerElement(
		name: string,
		element: HTMLElement
	): HTMLElement;
	export function registerDOMElement(
		name: string,
		element: HTMLElement,
		isSvg: boolean
	): HTMLElement;
	export function register(global: any): void;
	export function isElement(element: any): boolean;
	export function createEvent(type: string): Event;
	export function defaultDocumentInit(document: Document): void;
	export function updateAttributeNS(
		self: HTMLElement,
		namespace: string,
		type: string,
		value: any
	): void;

	interface NSComponentsMap {
		Frame: Frame;
		Page: Page;
		Prop: Prop;
		ItemTemplate: ItemTemplate;
		AbsoluteLayout: AbsoluteLayout;
		ActionBar: ActionBar;
		ActionItem: ActionItem;
		ActivityIndicator: ActivityIndicator;
		Button: Button;
		ContentView: ContentView;
		DatePicker: DatePicker;
		DockLayout: DockLayout;
		FlexboxLayout: FlexboxLayout;
		FormattedString: FormattedString;
		GridLayout: GridLayout;
		HtmlView: HtmlView;
		Image: Image;
		Label: Label;
		ListPicker: ListPicker;
		ListView: ListView;
		NavigationButton: NavigationButton;
		Placeholder: Placeholder;
		Progress: Progress;
		ProxyViewContainer: ProxyViewContainer;
		RootLayout: RootLayout;
		ScrollView: ScrollView;
		SearchBar: SearchBar;
		SegmentedBar: SegmentedBar;
		SegmentedBarItem: SegmentedBarItem;
		Slider: Slider;
		Span: Span;
		StackLayout: StackLayout;
		Switch: Switch;
		TabView: TabView;
		TabViewItem: TabViewItem;
		TextField: TextField;
		TextView: TextView;
		TimePicker: TimePicker;
		WebView: WebView;
		WrapLayout: WrapLayout;
	}

	type HTMLElementTagNameMap = {
		[K in keyof NSComponentsMap]: HTMLElement<NSComponentsMap[K]>;
	};

	export const pseudoElements: {
		Prop: Prop;
		ItemTemplate: ItemTemplate;
	};

	export const nativeViews: Omit<
		HTMLElementTagNameMap,
		"Prop" | "ItemTemplate"
	>;

	export const makers: {
		makeTweakable(view: ViewBase, options: any): HTMLElement;
		makeView(view: ViewBase, options: any): HTMLElement;
		makeLayout(view: ViewBase, options: any): HTMLElement;
		makeText(view: ViewBase, options: any): HTMLElement;
		makeEditableText(view: ViewBase, options: any): HTMLElement;
		makeAbsoluteLayout(view: ViewBase, options: any): HTMLElement;
		makeActionBar(view: ViewBase, options: any): HTMLElement;
		makeActionItem(view: ViewBase, options: any): HTMLElement;
		makeActivityIndicator(view: ViewBase, options: any): HTMLElement;
		makeButton(view: ViewBase, options: any): HTMLElement;
		makeContentView(view: ViewBase, options: any): HTMLElement;
		makeDatePicker(view: ViewBase, options: any): HTMLElement;
		makeDockLayout(view: ViewBase, options: any): HTMLElement;
		makeFlexboxLayout(view: ViewBase, options: any): HTMLElement;
		makeFormattedString(view: ViewBase, options: any): HTMLElement;
		makeFrame(view: ViewBase, options: any): HTMLElement;
		makeGridLayout(view: ViewBase, options: any): HTMLElement;
		makeHtmlView(view: ViewBase, options: any): HTMLElement;
		makeImage(view: ViewBase, options: any): HTMLElement;
		makeLabel(view: ViewBase, options: any): HTMLElement;
		makeListPicker(view: ViewBase, options: any): HTMLElement;
		makeListView(view: ViewBase, options: any): HTMLElement;
		makeNavigationButton(view: ViewBase, options: any): HTMLElement;
		makePage(view: ViewBase, options: any): HTMLElement;
		makePlaceholder(view: ViewBase, options: any): HTMLElement;
		makeProgress(view: ViewBase, options: any): HTMLElement;
		makeProxyViewContainer(view: ViewBase, options: any): HTMLElement;
		makeRootLayout(view: ViewBase, options: any): HTMLElement;
		makeScrollView(view: ViewBase, options: any): HTMLElement;
		makeSearchBar(view: ViewBase, options: any): HTMLElement;
		makeSegmentedBar(view: ViewBase, options: any): HTMLElement;
		makeSegmentedBarItem(view: ViewBase, options: any): HTMLElement;
		makeSlider(view: ViewBase, options: any): HTMLElement;
		makeSpan(view: ViewBase, options: any): HTMLElement;
		makeStackLayout(view: ViewBase, options: any): HTMLElement;
		makeSwitch(view: ViewBase, options: any): HTMLElement;
		makeTabView(view: ViewBase, options: any): HTMLElement;
		makeTabViewItem(view: ViewBase, options: any): HTMLElement;
		makeTemplateReceiver(view: ViewBase, options: any): HTMLElement;
		makeTextField(view: ViewBase, options: any): HTMLElement;
		makeTextView(view: ViewBase, options: any): HTMLElement;
		makeTimePicker(view: ViewBase, options: any): HTMLElement;
		makeWebView(view: ViewBase, options: any): HTMLElement;
		makeWrapLayout(view: ViewBase, options: any): HTMLElement;
	};
}

export {};
