import { Injectable } from "@angular/core";
import { ListLegendData, ListLegendItem } from "../interfaces/legend.interfaces";
import { LegendItemHighlighted, LegendService } from "./legend.service";

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

  onMouseEnter = (event: MouseEvent, data: ListLegendItem) => {
    this.host.selectAll<SVGGElement, ListLegendItem>('g.legend-item')
      .style('font-weight', (d: ListLegendItem) => d.id === data.id ? 'bold' : '');

    const action = new LegendItemHighlighted({ item: data.id });

    this.onLegendAction.emit(action)
  }

  onMouseLeave = (event: MouseEvent, data: any) => {
    this.host.selectAll<SVGGElement, ListLegendItem>('g.legend-item')
      .style('font-weight', '');
  }

  onMouseClick = (event: MouseEvent, data: any) => {}
}
