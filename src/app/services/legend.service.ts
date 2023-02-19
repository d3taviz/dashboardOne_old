import { Injectable } from "@angular/core";
import ObjectHelper from "../helpers/object.helper";

import { Selection } from 'd3-selection';

import * as d3 from 'd3';


@Injectable()
export abstract class LegendService<D, C> {
  host: Selection<SVGGElement, any, any, any> = {} as any;

  private _data: D = undefined as any;
  private _config: C = undefined as any;

  protected abstract defaultData: D;
  protected abstract defaultConfig: C;

  set data(data: D) {
    this._data = data;
    this.onUpdateData();
  }

  get data() {
    return this._data || this.defaultData;
  }

  set config(config: C) {
    this._config = ObjectHelper.UpdateObjectWithPartialValues(this.defaultConfig, config);
    this.onUpdateConfig();
  }

  get config() {
    return this._config || this.defaultConfig;
  }

  setItems = () => {
    const data: any = this.getItems();

    this.host.selectAll('g.legend-item')
    .data(data)
    .join(
      (enter: any) => enter.append('g')
      .call(this.generateItem),
      (update: any) => update
      .call(this.updateItem)
    )
    .attr('class', 'legend-item')
//    .attr('transform', (d: any, i: number) => `translate(${i * width + (i && nodataSeparator || 0)}, 0)`)
    .on('mouseenter', (event: any, d: any) => {
      //highlight the legend items
//      this.highlightLegendItems(d);
      //highlight the features
//      this.highlightFeatures(d);
    })
    .on('mouseleave', () => {
      //reset the legend items
  //    this.resetLegendItems();
      //reset the features
  //    this.resetFeatures();
    });
  }

  repositionItems = () => {
    let padding = 0;

    const separator = 10;

    this.host.selectAll('g.legend-item')
      .each((d: any, i: number, items: any) => {
        const g = d3.select(items[i]);
        g.attr('transform', `translate(${padding}, 0)`);
        const dims = g.node()?.getBoundingClientRect() || new DOMRect();
        padding += dims.width + separator;
      });
  }

  generate = () => {
    this.setItems();
    this.repositionItems();
  }

  abstract onUpdateData: () => void;
  abstract onUpdateConfig: () => void;

  abstract generateItem: (selection: any) => void;
  abstract updateItem: (selection: any) => void;

  abstract getItems: () => any;

}
