
# plotly.js component for Angular

Provides a `PlotlyComponent` for working with [Plotly.js](https://plot.ly/javascript/)  
This library is designed around the `Plotly.react()` API (available since Plotly.js 1.34.0)

There is an official [angular-plotly.js](https://github.com/plotly/angular-plotly.js) library. However, there are some design differences, which are discussed at the bottom of this page.

## angular-plotly-react installation

1. Install the `angular-plotly-react` package
2. [Install plotly.js](https://plot.ly/javascript/getting-started/)  
  Latest version recommended due to `Plotly.react` bug fixes.  
  Either add the CDN to `index.html`:  
`<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>`  
OR  
 install `plotly.js` package and bundle it into your app.  
  If using `@angular/cli` (add it to `angular.json` scripts)  
  `scripts: ["node_modules/plotly.js/dist/plotly-basic.min.js"]`

3. import `PlotlyModule` in one of your Angular modules  
`import { PlotlyModule } from 'angular-plotly-react';`
4. (optional) install dev dependency: `@types/plotly.js`

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

To update the plotly chart when `<plotly>` is resized, you can provide an `Observable` to `[resize$]` or call `PlotlyComponent.react()`.

If you're using **material2**, you can use `ViewportRuler` to get an `Observable` that emits when the window size changes:

```typescript
  constructor(private viewportRuler: ViewportRuler) {}

  ngOnInit() {
    this.resize$ = this.viewportRuler.change(100);
  }
```

## angular-plotly.js discussion
There is an official [angular-plotly.js](https://github.com/plotly/angular-plotly.js) library.

However, I decided to publish **angular-plotly-react** because of some fundamental design differences: 

 * **angular-plotly.js** requires that you install plotly.js and provides no way to choose the build (see issue [#5](https://github.com/plotly/angular-plotly.js/issues/5))  
`import * as Plotlyjs from 'plotly.js/dist/plotly.js';`  
**angular-plotly-react** just uses the `Plotly` global, so you can load plotly.js from a CDN or load it yourself.
 * **angular-plotly.js** has some [strange change detection code](https://github.com/plotly/angular-plotly.js/blob/156ff58ef187267d2c441f7842e572510b06653a/src/app/plotly/plot/plot.component.ts#L234), which I worry will impact performance when plotting lots of data. _I plan to test this and report the issue._
 * **angular-plotly.js** creates an `Output() EventEmitter` for every Plotly event (about 26) and hooks all of them even if you don't use the event.
 * Currently, **angular-plotly-react** manages `datarevision` for you.
 * **angular-plotly-react** currently lacks a few features such as `[divId]`,  `[style]`, `[className]`, `[debug]`, but IMO these aren't needed. Submit an issue if you think otherwise.
 * `(error)` Plotly.react() does not seem to throw errors, so **angular-plotly-react** has no error reporting system.

# Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.3.

The default **angular-plotly** project is an app for testing the **angular-plotly-react** library. 

Build **angular-plotly-react** library: `ng build angular-plotly-react`
