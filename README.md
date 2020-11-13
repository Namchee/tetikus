# Tetikus

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts) [![Vue 3](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://github.com/vuejs/vue-next) [![NPM Package Version](https://img.shields.io/npm/v/@namchee/tetikus)](https://www.npmjs.com/package/@namchee/tetikus) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@namchee/tetikus)](https://bundlephobia.com/result?p=@namchee/tetikus@0.2.0)

Tetikus is a custom cursor component made for Vue 3 🖱️.

> ⚠️ **WARNING**: This component **DOES NOT WORK** with Vue 2! Consider upgrading to Vue 3 as it's already been officially released.

> ⚠️ **WARNING**: This library **DOES NOT** work on older browsers that doesn't support `esnext`, the reason is stated [here](https://github.com/vuejs/vue-next)

## Table of Contents

- [Features](#Features)
- [Installation](#Installation)
- [Usage](#Usage)
- [Props](#Props)
- [Slots](#Slots)
- [Events](#Events)
- [Directives](#Directives)
- [Options](#Component-Options)
- [Objects](#Objects)
- [Development](#Development)
- [License](#License)

## Features

- Easily customizable, you're not locked with basic circle shape and most
events are emitted properly
- Relatively performant, uses native browser technologies
- Relatively small, the minified build is only 6.3KB gzipped 📦
- Made with [Typescript](https://www.typescriptlang.org/), no more guessing games 🤔
- Depends on nothing, all features are implemented with pure CSS, JS, and Vue ✌️.

## Installation

Simply execute this script from your terminal

`npm install @namchee/tetikus --save`

After that, you can add it to your Vue 3 application by using the `.use()` like:

```js
import { createApp } from 'vue';
import Root from './Root.vue';
import Tetikus from '@namchee/tetikus';
import '@namchee/tetikus/dist/tetikus.css';

const app = createApp(Root);
app.use(Tetikus);
```

## Usage

Just use the component in your root file.
You can use the directives on any element in your app.

```js
// Root.vue
<template>
  <div>
    <tetikus />
  </div>
</template>

// ...rest of your code

// Somewhere.vue
<template>
  <div v-thover="{ scale: 0.8 }">
    // ...
  </div>
</template>

// If you're not using the global installation method,
// make sure to install the components and directives correctly
```

## Props

Prop Name | Type | Default | Description
--------- | ---- | ------- | -----------
`showDefaultCursor` | `boolean` | `false` | Determines if the native cursor should be shown alongside `tetikus` component. Useful for accessability purposes.
`throttleSpeed` | `number` (integer) | 1 | Number of `mousemove` event that should be fired per 1000 milliseconds. The higher the number, the choppier the cursor movement will be. Useful to boost performance.
`borderWidth` | `number` (px) | 2 | Border width of default cursor shape in pixels.
`color` | `string` | `transparent` | Background color of default cursor shape. Accept any CSS color value.
`borderColor` | `string` | `#121212` | Border color of default cursor shape. Accept any CSS color value.
`size` | `number` (px) | 36 | Size of default cursor shape in pixels
`invertColor` | `boolean` | `false` | Determines if the default cursor shape should apply `mix-blend-mode: difference`
`buttonMap` | `Array` | `['left']` | List of mouse button that should trigger `tetikus-mouse-down` event. Possible values are `left`, `right`, `middle`
`clickBehavior` | `TransformProps` | `{}` | Determines transforms that should be applied to default cursor when a click event is registered
`showOnTouch` | `boolean` | `false` | Determines if the cursor should be shown on 'touch'-devices. ⚠️ __Unless you know what are you doing, leave this on `false`__ ⚠️
`opacity` | `number` (between 0.0 - 1.0) | 1 | Opacity of default cursor.
`hideOnOut` | `boolean` | `false` | Determines if the custom cursor should be hidden when the cursor leaves the viewport
`contentPosition` | `string` | `center` | Determines the position of `contents` slot relative to the cursor. Possible values are `center`, `bottom`, `right`
`lerp` | `number` | `1` | [Linear Interpolation Value](https://codepen.io/ma77os/pen/KGIEh)
`options` | `Object` | `{}` | All of other options in one single object. Will gracefully fallback if some values are not provided.

## Slots

Name | Description
---- | -----------
(default slot) | Determines the cursor shape to be used. The default shape is a perfect circle ⚠️ __Currently, using this slot will render any previously defined behaviors invalid. Any transition MUST be handled by yours truly__ ⚠️
`contents` | Content to be displayed with the cursor

## Events

Name | Params | Description
---- | ------ | -----------
`tetikus-window-leave` | &nbsp; | Fired when the cursor leaves the viewport
`tetikus-window-enter` | &nbsp; | Fired when the cursor enters the viewport
`tetikus-mouse-move` | `(event: MouseEvent)` | Fired when the cursor moves on the viewport
`tetikus-mouse-down` | `(event: MouseEvent)` | Fired when any previously registered mouse buttons are clicked by the user
`tetikus-mouse-up` | `(event: MouseEvent)` | Fired when any previously registered mouse buttons are lifted
`tetikus-element-in` | `(behavior: HoverBehavior)` | Fired when the cursor hovers over any element that has `tetikus` hover directives
`tetikus-element-out` | `(behavior: HoverBehavior)` |Fired when the cursor exits from the bounding box of any element that has `tetikus` hover directives

## Directives

Name | Value | Description
---- | ----- | -----------
`thover` (can be customized from options) | `TransformProps` | Determines transform to be applied when the cursor hovers this element

## Component Options

These values will set default values for `tetikus` component

Name | Type |Default| Description
--------- | ---- | ------|-----------
`directiveName` | `string` | `thover` | Name for the hover directive.
`transitionSpeed` | `number` (ms) | 200 | Animation speed for CSS transition.
`easing` | `string` | `ease-out` | Easing function for CSS transition. Accept anything than can be represented using `cubic-bezier`
`delay` | `number` (ms) | 0 | Delay for CSS transition.

## Objects

Name | Property | Type | Description
---- | -------- | ---- | -----------
`TransformOpts` | `value` | `T` | Value for the transformation.
&nbsp; | `duration` (optional) | `number` (ms) | Transition duration. If the value is omitted, default value will be used
&nbsp; | `delay` (optional) | `number` (ms) | Delay for CSS transition.
&nbsp; | `easing` (optional) | `string` | Easing function for CSS transition. Accept anything than can be represented using `cubic-bezier`
`TransformProps` | `scale` (optional) | `TransformOpts<number>`, `number` | Determines the scale of cursor to be applied on transition.
&nbsp; | `color` (optional) | `TransformOpts<string>`, `string` | Determines the background color of cursor to be applied on transition.
&nbsp; | `borderWidth` (optional) | `TransformOpts<number>`, `number` | Determines the border width of cursor to be applied on transition.
&nbsp; | `borderColor` (optional) | `TransformOpts<string>`, `string` | Determines the border color of cursor to be applied on transition. Accepts any CSS color string.
&nbsp; | `opacity` (optional) | `TransformOpts<number>`, `number` (between 0.0 - 1.0) | Determines the opacity of cursor to be applied on transition.
&nbsp; | `id` (optional) | `string`, `string[]` | Specify instances which should transform on hover event. Useful when you have multiple `tetikus` instances. Won't work at all on click events, you must register different behaviors directly into the instances.
`HoverBehavior` | `domElement` | `HTMLElement` | The HTML element that triggers `tetikus-element-in` and `tetikus-element-out` events.
&nbsp; | `transformProps` | `TransformProps` | Transformation to be applied on the cursor element.

> Note: When any property of `TransformProps` is defined without `TransformOpts`, the transition settings (duration, easing, delay) for that property will be applied with default values.

## Development

> Make sure that your have NodeJS and `npm` installed in your computer!

1. Clone this repository
2. Navigate to the project directory
3. Install all required dependency by executing `npm install` from your terminal
4. [Link the project with the playground](https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557)
5. Execute `npm run build:watch` from your terminal
6. Happy developing!

## License

This project is licensed under [MIT License](LICENSE)
