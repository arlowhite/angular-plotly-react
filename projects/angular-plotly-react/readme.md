
# plotly.js component for Angular

Provides a `PlotlyComponent` for working with [Plotly.js](https://plot.ly/javascript/)  
This library is designed around the `Plotly.react()` API (available since Plotly.js 1.34.0)

An alternative to this library is [angular-plotly.js](https://github.com/plotly/angular-plotly.js), which is discussed at the bottom of this page.

## angular-plotly-react intallation

1. Install the `angular-plotly-react` package
2. [Install plotly.js](https://plot.ly/javascript/getting-started/)  
Either add the CDN to `index.html` `<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>`  
or install `plotly.js` and serve it yourself. (add it to `angular.json` scripts)
3. import `PlotlyModule` in one of your Angular modules
4. (optional) install dev dependency: `@types/plotly.js`

## PlotlyComponent usage

If you installed `@types/plotly.js` you may want to import and use these types:  
`import {Config, Layout, ScatterData} from 'plotly.js';`

In your template:
`<plotly [data]="data"></plotly>`

At minimum, only traces `data` is required. However, you probably want to set a config to adjust Plotly's buttons and a layout to adjust margins:  
`<plotly [data]="data" [layout]="layout" [config]="config"></plotly>`

```typescript
  layout: Partial<Layout> = {
    margin: {
      t: 16, r: 16, b: 30, l: 24
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
 * `(error)` and a resize solution will be coming soon.
