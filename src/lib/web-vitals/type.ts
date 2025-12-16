export type WebVitalItem = {
  id: string;
  name: string;      // LCP / INP / CLS
  value: number;
  rating: string;
  timestamp: number;
  route: string;
  ua: string
};

export interface VitalStore{
  push(item: WebVitalItem): Promise<void>;
  list(): Promise<WebVitalItem[]>;
}