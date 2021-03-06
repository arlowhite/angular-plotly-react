import {Injectable, Optional, SkipSelf} from '@angular/core';

declare var Plotly: any;

export interface PlotlyServiceConfig {
  /**
   * Plotly object to use
   */
  plotly?: any;
  /**
   * URL to download Plotly from
   */
  url?: string;

  /**
   * By default, plotly.js will not be loaded until a PlotlyComponent needs it.
   * Set preload true to download plotly.js on startup.
   */
  preload?: boolean;

  /**
   * preload delay (default 250ms)
   */
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlotlyService {

  config?: PlotlyServiceConfig;

  private _plotlyReady: Promise<any>;
  /**
   * resolves with Plotly object when plotly.js is ready.
   */
  get plotlyReady(): Promise<any> {
    if (!this._plotlyReady) {
      this.setup();
    }
    return this._plotlyReady;
  }

  /**
   * The Plotly object after being resolved
   */
  plotly: any | undefined;

  defaultUrl = 'https://cdn.plot.ly/plotly-latest.min.js';

  constructor(@Optional() @SkipSelf() otherService?: PlotlyService) {
    if (otherService) {
      throw new Error('multiple PlotlyService! PlotlyModule.forRoot() should only be called once!');
    }
  }

  /**
   * Setup plotlyReady based on the current config
   *
   * Called by PlotlyModule.forRoot() if config.preload
   * Otherwise, called lazily when plotlyReady is first accessed.
   */
  setup() {
    if (this._plotlyReady) {
      throw new Error('PlotlyService already setup');
    }
    const config = this.config;
    if (config) {
      if (config.plotly) {
        this.createPromiseForObject(config.plotly, 'PlotlyServiceConfig.plotly');
      }
      else if (config.url) {
        this.createPromiseForUrl(config.url);
      }
      else {
        throw new Error('PlotlyServiceConfig must have plotly OR url');
      }
    }
    else {
      // No config
      const plotly = this.getPlotlyGlobal();
      if (plotly) {
        this.createPromiseForObject(plotly, 'Plotly');
      }
      else {
        console.info('Plotly global not found and PlotlyService not configured via PlotlyModule.forRoot(),' +
          ' loading from ' + this.defaultUrl);
        this.createPromiseForUrl(this.defaultUrl);
      }
    }
  }

  private getPlotlyGlobal(): any | undefined {
    try {
      return (window as any).Plotly || Plotly;
    }
    catch (err) {  // ReferenceError
      return undefined;
    }
  }

  private createPromiseForObject(plotly: any, messagePrefix: string) {
    const error = this.verifyPlotly(plotly, messagePrefix);
    if (error) {
      this._plotlyReady = Promise.reject(error);
    }
    else {
      this.plotly = plotly;
      this._plotlyReady = Promise.resolve(plotly);
    }
  }

  private createPromiseForUrl(url: string) {
    this._plotlyReady = new Promise<any>((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = url;
      scriptElement.async = true;

      scriptElement.onload = (event: Event) => {
        const plotly = this.getPlotlyGlobal();
        if (plotly == null) {
          reject(new Error('No Plotly global after downloading ' + url));
        }
        const error = this.verifyPlotly(plotly, 'Plotly downloaded from ' + url);
        if (error) {
          reject(error);
        }
        else {
          resolve(plotly);
        }
      };

      scriptElement.onerror = (error: any) => {
        reject(error);
      };

      document.body.appendChild(scriptElement);
    });
  }

  /**
   * validate the Plotly object
   * @param plotly
   * @param messagePrefix
   * @returns undefined if Plotly is ok, Error if problem
   */
  private verifyPlotly(plotly: any, messagePrefix: string): Error | undefined {
    if (plotly.react) {
      return;
    }
    return new Error(messagePrefix + ' does not have react(), are you using plotly.js >= 1.34.0?');
  }

}
