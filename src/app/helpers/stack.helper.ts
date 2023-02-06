
import * as d3 from 'd3';
import { IChartMargins, IGroupStackDataElem } from '../interfaces/chart.interfaces';

export class StackHelper {
  static SetStacks<T>(data: T[], domainAttr: keyof T, groupAttr: keyof T, stackAttr: keyof T, valueAttr: keyof T, valueFormatter = (value: any) => value): IGroupStackDataElem[] {

    const calcKey = (elem: any): string => {
      const removeUndefined = (d: any) => d === undefined ? '' : '__' + d;
      return elem[0] + removeUndefined(elem[1]) + removeUndefined(elem[2]);
    }

    return d3.flatRollup(data, (v: any) => d3.sum(v, (d: any) => d[valueAttr]) , d => d[domainAttr], d => d[groupAttr], d => d[stackAttr])
    .map((elem: any) => ({
      key: calcKey(elem),
      domain: elem[0],
      group: elem[1] || null,
      stack: elem[2] || null,
      value: valueFormatter(elem[3])
    }));

  }
}
