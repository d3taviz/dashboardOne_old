import { Injectable } from "@angular/core";
import { ListLegendData } from "../interfaces/legend.interfaces";
import { LegendService } from "./legend.service";

@Injectable()
export class ListLegendService extends LegendService<ListLegendData, any> {
  protected override defaultData: ListLegendData = {
    items: []
  };
  protected override defaultConfig: any;


  onUpdateData = () => {
    this.generate();
  }

  onUpdateConfig = () => {}
  generateItem = (selection: any) => {
    selection.append('circle')
      .attr('class', 'legend-icon')
      .attr('cx', 3)
      .attr('cy', 3)
      .attr('r', 3)
      .style('fill', (d: any) => d.color);

    selection.append('text')
      .attr('class', 'legend-label')
      .attr('x', 3 + 5)
      .attr('y', 3)
      .style('font-size', 12 + 'px')
      .style('dominant-baseline', 'middle')
      .text((d: any) => d.label);
  }

  updateItem = (selection: any) => {
    selection.selectAll('circle.lengend-icon')
      .style('fill', (d: any) => d.color);

      selection.select('text.legend-label')
      .text((d: any) => d.label);
  }

  getItems = () => {
    return this.data.items;
  }
}
