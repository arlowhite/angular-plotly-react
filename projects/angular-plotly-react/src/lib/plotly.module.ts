import {ModuleWithProviders, NgModule} from '@angular/core';
import { PlotlyComponent } from './plotly.component';
import {PlotlyService, PlotlyServiceConfig} from './plotly.service';

@NgModule({
  imports: [
  ],
  declarations: [PlotlyComponent],
  exports: [PlotlyComponent]
})
export class PlotlyModule {

  /**
   * Configure how plotly.js is obtained.
   *
   * @param config with plotly OR url
   * @returns
   */
  static forRoot(config?: PlotlyServiceConfig): ModuleWithProviders {
    const plotlyService = new PlotlyService();
    plotlyService.config = config;
    if (config && config.preload) {
      // access plotlyReady to trigger setup() without danger of calling setup() twice
      // delay a bit to let App load
      setTimeout(() => plotlyService.plotlyReady, config.delay || 250);
    }
    return {
      ngModule: PlotlyModule,
      providers: [
        { provide: PlotlyService, useValue: plotlyService }
      ]
    };
  }
}
