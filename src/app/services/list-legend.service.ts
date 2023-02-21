import { Injectable } from "@angular/core";
import { ListLegendData, ListLegendItem } from "../interfaces/legend.interfaces";
import { LegendItemClicked, LegendItemHighlighted, LegendItemReset, LegendService } from "./legend.service";

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

  updateItemStyles = () => {
    this.host.selectAll<SVGGElement, ListLegendItem>('g.legend-item')
      .style('opacity', (d: ListLegendItem) => this.hiddenIds.has(d.id) ? 0.3 : null);
  };

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
      .style('font-weight', null);

    const action = new LegendItemReset({ item: data.id });

    this.onLegendAction.emit(action)
  }

  onMouseClick = (event: MouseEvent, data: any) => {
    // this.toggleItem(data.id);
    this.naturalClick(data.id);
    this.updateItemStyles();
    const action = new LegendItemClicked({ item: data.id });
    this.onLegendAction.emit(action);
  }

  hideAllOthers = (id: any) => {
    const ids = this.data.items.filter((item: any) => item.id !== id)
      .map((item: any) => item.id);

    this.hiddenIds = new Set(ids);
  }

  reverseHidden = () => {
    this.data.items.map((item: any) => this.toggleItem(item.id));
  }

  hiddenIsEmpty = (): boolean => {
    return this.hiddenIds.size === 0;
  }

  allOthersHidden = (id: any): boolean => {
    return !this.hiddenIds.has(id) && this.hiddenIds.size === this.data.items.length - 1;
  }

  naturalClick = (id: any) => {
    if (this.hiddenIsEmpty()) {
      this.hideAllOthers(id);
    } else {
      if (this.allOthersHidden(id)) {
        this.reverseHidden();
      } else {
        this.toggleItem(id);
      }
    }
  }
}
