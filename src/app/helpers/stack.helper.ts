
import * as d3 from 'd3';
import { IChartMargins } from '../interfaces/chart.interfaces';

export interface IGroupStackDataElem {
  key?: string;
  domain: string;
  group: string;
  stack: string;
  value: number;
}

export interface IGroupStackData {
  title: string;
  yLabel: string;
  unit: string;
  data: IGroupStackDataElem[];
}

export interface IGroupStackCOnfig {
  hiddenOpacity: number;
  transition: number;
  margins: IChartMargins;
}

export class StackHelper {
  static SetStacks<T>(data: T[], domainAttr: string, groupAttr: string, stackAttr: string, valueAttr: string): IGroupStackDataElem[] {

    const calcKey = (elem): string => {
      const removeUndefined = (d) => d === undefined ? '' : '__' + d;
      return elem[0] + removeUndefined(elem[1]) + removeUndefined(elem[2]);
    }

    return d3.flatRollup(data, v => d3.sum(v, d => d[valueAttr]) , d => d[domainAttr], d => d[groupAttr], d => d[stackAttr])
    .map((elem) => ({
      key: calcKey(elem),
      domain: elem[0],
      group: elem[1] || null,
      stack: elem[2] || null,
      value: elem[3]
    }));

  }
}
