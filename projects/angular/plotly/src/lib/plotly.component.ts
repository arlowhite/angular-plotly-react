import {Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
/*
There are many ways of loading Plotly; let the app developer load it however they want.
For now, just assume there is a Plotly global
 */
declare var Plotly: any;

// importing Plotly this way provides types, but causes App error:
// Module not found: Error: Can't resolve 'plotly.js' in '/home/awhite/Code/Angular/angular-plotly/dist/angular/plotly/fesm5'
// import * as Plotly from 'plotly.js';

export interface PlotlyEvent {
  /**
   * Name of the Plotly event. "plotly_*"
   */
  name: string;
  event: any;
}

@Component({
  selector: 'plotly',
  template: `<div #plotlyDiv></div>`,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `]
})
export class PlotlyComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * The <div> where Plotly is created
   */
  @ViewChild('plotlyDiv')
  plotlyDiv: ElementRef;

  /**
   * Plotly layout
   */
  @Input()
  layout: any;

  /**
   * Plotly configuration
   */
  @Input()
  config: any;

  /**
   * Plotly traces
   */
  @Input()
  traces: any[];

  /**
   * Plotly events to subscribe to
   * "plotly_" prefix optional
   */
  @Input()
  events: string[];

  @Output()
  plotlyEvent: EventEmitter<PlotlyEvent> = new EventEmitter();

  private datarevision = 1;

  constructor() { }

  ngOnInit() {
    if (Plotly == null) {
      throw new Error('Plotly global not found! Install plotly.js');
    }
    if (Plotly.react == null) {
      throw new Error('@angular/plotly requires plotly.js >= 1.34.0');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.traces && !changes.traces.firstChange) {
      /*
      As of 1.37.1, updating traces does not reliably update Plotly
      So increment the datarevision to ensure the plot updates
       */
      this.layout.datarevision = this.datarevision++;
    }
    if (changes.layout && this.layout) {
      // force autosize for proper layout
      if (this.layout.autosize == null) {
        this.layout.autosize = true;
      }
    }
    this.react();
  }

  ngOnDestroy() {
    this.purge();
  }

  /**
   * Invoke Plotly.react with the current traces, layout, and config.
   * This will update the size of the chart.
   */
  react() {
    if (this.layout == null) {
      this.layout = {
        autosize: true
      };
    }
    Plotly.react(this.plotlyDiv.nativeElement, this.traces, this.layout, this.config);
  }

  /**
   * Clear the Plotly <div>
   */
  purge() {
    Plotly.purge(this.plotlyDiv.nativeElement);
  }

}
