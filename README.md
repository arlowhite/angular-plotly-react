
# plotly.js component for Angular

Provides a `PlotlyComponent` for working with [Plotly.js](https://plot.ly/javascript/)  
This library is designed around the `Plotly.react()` API (available since Plotly.js 1.34.0)

There is an official [angular-plotly.js](https://github.com/plotly/angular-plotly.js) library. However, **angular-plotly-react** has a different design, which is discussed at the bottom of this page.

# Project Status

I am no longer working on this project or maintaining it in any way. Feel free to fork it or take whatever code is useful. If you are interested in maintaining the project and want me to transfer it to you, let me know.

## angular-plotly-react installation

1. Install the `angular-plotly-react` package
2. import `PlotlyModule` in one of your Angular modules  
`import { PlotlyModule } from 'angular-plotly-react';`
4. (optional) install dev dependency: `@types/plotly.js`

By default the `Plotly` global will be used, or if it doesn't exist, plotly.js will be downloaded from the CDN `https://cdn.plot.ly/plotly-latest.min.js`

## PlotlyComponent usage

If you installed `@types/plotly.js` you may want to import and use these types:  
`import {Config, Layout, ScatterData} from 'plotly.js';`

Create your trace(s) data.
See the [Plotly.js documentation](https://plot.ly/javascript/) examples and [full reference](https://plot.ly/javascript/reference/). 

```typescript
    data: Partial<ScatterData>[] = [
      {
        type: 'scatter',
        x: [1, 2, 3, 4],
        y: [2, 4, 3, 0.5]
      }
    ];
```

In your template:
`<plotly [data]="data"></plotly>`

At minimum, only traces `data` is required. However, you probably want to set a config to adjust Plotly's buttons and a layout to adjust margins:  
`<plotly [data]="data" [layout]="layout" [config]="config"></plotly>`

```typescript
  layout: Partial<Layout> = {
    title: 'Hello Plotly!',
    margin: {
      t: 36, r: 16, b: 30, l: 24
    }
  };

  config: Partial<Config> = {
    displaylogo: false,
    showLink: false,
    modeBarButtonsToRemove: [
      'sendDataToCloud'
    ]
  };
```

### Resizing

To update the plotly chart when `<plotly>` is resized, you can provide an `Observable` to `[resize$]` or call `PlotlyComponent.react()`.

If you're using **material2**, you can use `ViewportRuler` to get an `Observable` that emits when the window size changes:

```typescript
  constructor(private viewportRuler: ViewportRuler) {}

  ngOnInit() {
    this.resize$ = this.viewportRuler.change(100);
  }
```

### plotly.js loading customization

#### Synchronous loading
You can create the `Plotly` global by either:  
Adding `<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>` to `index.html`  
OR  
In an `@angular/cli` project, install `plotly.js` and add `"node_modules/plotly.js/dist/plotly-basic.min.js"` to `scripts` in `angular.json`

Alternatively, instead of loading the Plotly global, you can import it within `AppModule` and pass it to `PlotlyModule`:  
```typescript
import * as Plotly from 'plotly.js/dist/plotly.min.js';
...
import: [
  PlotlyModule.forRoot({ plotly: Plotly })
]
```

#### Asynchronous loading

With an asynchronous configuration, plotly.js will be downloaded on demand. To preload, set `preload: true` in PlotlyModule's config. preload is delayed by 250ms by default, which can be configured with `delay`.

In `AppModule`  
```typescript
import: [
  PlotlyModule.forRoot({ url: 'https://cdn.plot.ly/plotly-latest.min.js' })
]
```

Alternatively, with `@angular/cli` > 6.0, you can configure **lazy** [global scripts](https://github.com/angular/angular-cli/wiki/stories-global-scripts) in `angular.json`:
```json
"scripts": [
  { "input": "node_modules/plotly.js/dist/plotly-basic.min.js", "bundleName": "plotly", "lazy": true }
]
```
In `AppModule` 
```typescript
import: [
  PlotlyModule.forRoot({ url: 'plotly.js' })
]
```

## angular-plotly.js discussion
There is an official [angular-plotly.js](https://github.com/plotly/angular-plotly.js) library. However, I decided to publish **angular-plotly-react** because of some fundamental design differences.
For comparison, see:
 * [angular-plotly.js PlotlyComponent](https://github.com/plotly/angular-plotly.js/blob/master/src/app/plotly/plot/plot.component.ts)
 * [angular-plotly-react PlotlyComponent](https://github.com/arlowhite/angular-plotly-react/blob/master/projects/angular-plotly-react/src/lib/plotly.component.ts) 

**Summary:**
 * **angular-plotly.js** requires that you install plotly.js and provides no way to choose the build (see issue [#5](https://github.com/plotly/angular-plotly.js/issues/5))  
`import * as Plotlyjs from 'plotly.js/dist/plotly.js';`  
**angular-plotly-react** just uses the `Plotly` global by default and supports multiple ways of loading plotly.js.
 * **angular-plotly.js** has some [strange change detection code](https://github.com/plotly/angular-plotly.js/blob/156ff58ef187267d2c441f7842e572510b06653a/src/app/plotly/plot/plot.component.ts#L234), which I worry will impact performance when plotting lots of data. _I plan to test this and report the issue._
 * **angular-plotly.js** creates an `Output() EventEmitter` for every Plotly event (about 26) and hooks all of them even if you don't use the event.
 * Currently, **angular-plotly-react** manages `datarevision` for you and increments it when data changes, which simplifies usage.
 * **angular-plotly-react** currently lacks a few features such as `[divId]`,  `[style]`, `[className]`, `[debug]`, but IMO these aren't needed. Submit an issue if you think otherwise.
 * `(error)` Plotly.react() does not seem to throw errors (at least with bad trace data), so **angular-plotly-react** has no error reporting system. _needs more research_

# Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

The default **angular-plotly** project is an app for testing the **angular-plotly-react** library. 

Build **angular-plotly-react** library: `ng build angular-plotly-react`
