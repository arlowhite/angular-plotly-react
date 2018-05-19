import {Component, OnInit, ViewChild} from '@angular/core';
import { randomNormal } from 'd3-random';
import {Layout} from 'plotly.js';
import {PlotlyComponent} from '../../projects/angular/plotly/src/lib/plotly.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('plotly')
  plotly: PlotlyComponent;

  layout: Partial<Layout>;

  traces = [
    {
      type: 'scatter',
      x: [1, 2, 3, 4],
      y: [2, 4, 3, 0.5]
    }
  ];

  nextX = 5;

  rand = randomNormal(1, 2);

  ngOnInit() {

  }

  addRandomY() {
    const trace = this.traces[0];
    const x = this.nextX++;
    const y = this.rand();
    console.log(`Adding (${x}, ${y})`);
    trace.x.push(x);
    trace.y.push(y);
    this.traces = [trace];  // trigger Input change, which calls Plotly.react
  }

}
