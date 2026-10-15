export interface NodeMetricData {
  id: string;
  name: string;
  type: string;
  trafficValue: string;
  trafficUnit: string;
  responseTimeValue: string;
  responseTimeUnit: string;
  networkDelayValue: string;
  networkDelayUnit: string;
  connectFailRateValue: string;
  connectFailRateUnit: string;
  position: { x: number; y: number };
}

export interface TreeItem {
  id: string;
  label: string;
  type: 'folder' | 'leaf';
  children?: TreeItem[];
  isOpen?: boolean;
  isActive?: boolean;
}
