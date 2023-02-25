
export interface ITooltipData {
  title: string;
  color: string;
  key: string;
  value: number | string;
}

export interface ITooltipConfig {
  background: {
    xPadding: number;
    yPadding: number;
    color: string;
    opacity: number;
    stroke: string;
    strokeWidth: number;
    rx: number;
    ry: number;
  };
  title: {
    fontSize: number;
    fontWeight: 'bold'
  };
  labels: {
    symbolSize: number;
    fontSize: number;
    height: number;
    textSeparator: number;
  };
  value: {
    fontWeight: string;
  };
  symbol: {
    width: number;
    height: number;
  };
  offset: {
    x: number;
    y: number;
  };
}
