export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  story?: {
    title: string;
    narrative: string;
    imageUrl: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ToastMessage {
  id: number;
  message: string;
}

export enum ViewMode {
  Grid = 'Grid',
  List = 'List',
  Table = 'Table',
  Flip = '3D Flip',
  Carousel = '3D Carousel',
  ThreeD = '3D View',
  Story = 'Story',
}

export enum Theme {
    Youthful = 'Youthful',
    Electronics = 'Electronics',
    Fashion = 'Fashion',
}