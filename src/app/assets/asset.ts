/* Defines the product entity */
export interface Asset {
  id: number;
  assetName: string;
  assetCategory: string;
  tags?: string[];
  area: number;
  price: number;
  description: string;
}