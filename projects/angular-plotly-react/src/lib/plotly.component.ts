import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {PlotlyService} from './plotly.service';


export interface PlotlyEvent {
  /**
   * Name of the Plotly event. "plotly_*"
   */
  event: string;
  /**
   * Data Plotly provided with event
   */
  data: any;
  /**
   * PlotlyComponent where event is from
   */
  source: PlotlyComponent;
}

@Component({
  selector: 'plotly',
  template: `<div #plotlyDiv></div>`,
  styleUrls: ['./plotly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlotlyComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * The <div> where Plotly is created
   */
  @ViewChild('plotlyDiv')
  plotlyDiv: ElementRef<HTMLDivElement>;

  /**
   * Plotly layout
   * Note: may be mutated by Plotly.
   */
  @Input()
  layout: any;

  /**
   * Plotly configuration
   */
  @Input()
  config: any;

  /**
   * Plotly traces data
   * Note: may be mutated by Plotly.
   */
  @Input()
  data: any[];

  /**
   * Plotly events to connect to and emit via plotlyEvent Output
   * "plotly_" prefix optional
   */
  @Input()
  events: string[];

  /**
   * An observable that emits when the <plotly> size may have changed.
   */
  @Input()
  resize$: Observable<any>;

  private _resizeSubscription: Subscription;

  /**
   * emits after every Plotly.react,
   * which is driven by changes to Inputs
   */
  @Output()
  afterReact: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Emits plotly_* events
   */
  @Output()
  plotlyEvent: EventEmitter<PlotlyEvent> = new EventEmitter();

  private datarevision = 1;

  /**
   * plotly.js when it is resolved
   */
  private plotly: any | undefined;

  constructor(private plotlyService: PlotlyService) {
    this.plotly = plotlyService.plotly;
    if (!this.plotly) {
      plotlyService.plotlyReady
        .then(plotly => {
          this.plotly = plotly;
          if (this.data || this.layout) {
            this.react();
          }
        });
    }
  }

  ngOnInit() {
    const afterReactSub: Subscription = this.afterReact
      .subscribe(() => {
        afterReactSub.unsubscribe();  // take(1)
        this._onFirstReact();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let newDatarevision: boolean;
    if (changes.traces && !changes.traces.firstChange) {
      /*
      As of 1.37.1, updating traces data does not reliably update Plotly
      So increment the datarevision to ensure the plot updates
       */
      newDatarevision = true;
    }
    if (changes.layout && this.layout) {
      // force autosize for proper layout
      if (this.layout.autosize == null) {
        this.layout.autosize = true;
      }
    }
    if (changes.resize$) {
      if (this._resizeSubscription) {
        this._resizeSubscription.unsubscribe();
      }
      if (this.resize$) {
        this._resizeSubscription = this.resize$
          .subscribe(() => this.react());
      }
    }
    this.react(newDatarevision);
  }

  ngOnDestroy() {
    if (this._resizeSubscription) {
      this._resizeSubscription.unsubscribe();
    }
    this.purge();
  }

  private _onFirstReact() {
    if (this.events) {
      const plotlyEvents = this.events.map(e => e.startsWith('plotly_') ? e : 'plotly_' + e);
      const div: any = this.plotlyDiv.nativeElement;
      for (const plotlyEvent of plotlyEvents) {
        div.on(plotlyEvent, data => {
          this.plotlyEvent.emit({
            source: this,
            event: plotlyEvent,
            data: data
          });
        });
      }
    }
  }

  /**
   * Invoke Plotly.react with the current traces data, layout, and config.
   * This will update the size of the chart.
   *
   * @param newDatarevision increment datarevision; needed when traces data has been mutated
   */
  react(newDatarevision?: boolean) {
    if (this.layout == null) {
      this.layout = {
        autosize: true
      };
    }
    if (newDatarevision) {
      this.layout.datarevision = this.datarevision++;
    }
    // react() may be called before plotly is ready
    if (this.plotly) {
      this.plotly.react(this.plotlyDiv.nativeElement, this.data, this.layout, this.config)
        .then(() => this.afterReact.emit());
    }
  }

  /**
   * Clear the Plotly <div>
   */
  purge() {
    this.plotly.purge(this.plotlyDiv.nativeElement);
  }

}
