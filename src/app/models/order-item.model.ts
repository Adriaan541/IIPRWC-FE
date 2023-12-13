import { Product } from "./product.model";

export class OrderItem {
  id?: string;
  product: Product;
  quantity: number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }
}
