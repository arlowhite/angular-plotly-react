import {Component, OnInit, ViewChild} from '@angular/core';
import {randomIrwinHall, randomNormal} from 'd3-random';
import {Config, Layout, ScatterData} from 'plotly.js';
import {PlotlyComponent, PlotlyEvent} from 'angular-plotly-react';
import {ViewportRuler} from '@angular/cdk/overlay';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('plotly')
  plotly: PlotlyComponent;

  layout: Partial<Layout> = {
    title: 'Click & Select Events!',
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

  traces: Partial<ScatterData>[];

  traces2: Partial<ScatterData>[];

  nextX = 5;

  rand = randomNormal(1, 2);

  lastEvent: PlotlyEvent;

  resize$: Observable<any>;

  constructor(private viewportRuler: ViewportRuler) {}

  ngOnInit() {
    this.traces = [
      {
        type: 'scatter',
        x: [1, 2, 3, 4],
        y: [2, 4, 3, 0.5]
      }
    ];

    const x = [];
    const y = [];
    const rand = randomIrwinHall(5);
    for(let i = 0; i < 100; i++) {
      x.push(i);
      y.push(rand());
    }
    this.traces2 = [{
      type: 'scatter',
      mode: 'markers',
      x,
      y
    }];

    this.resize$ = this.viewportRuler.change(100);
  }

  addRandomY() {
    const trace = this.traces[0];
    const x = this.nextX++;
    const y = this.rand();
    console.log(`Adding (${x}, ${y})`);
    (trace.x as number[]).push(x);
    (trace.y as number[]).push(y);
    this.plotly.react(true);
    // this.traces = [trace];  // Alternatively, trigger Input change, which calls Plotly.react
  }

  addTrace() {
    // shallow clone of first trace
    const newTrace = {...this.traces[0]};
    // create a different random y value for each of the existing traces values
    newTrace.y = (newTrace.y as number[]).map(() => this.rand());
    this.traces = [...this.traces, newTrace];
    // this.plotly.react(true);  // alternate way of updating
  }

  onPlotlyEvent(e: PlotlyEvent) {
    console.info('plotlyEvent', e.event, e.data);
    this.lastEvent = e;
  }

}
