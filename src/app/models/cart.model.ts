import { Product } from "./product.model";
import { CartItem } from "./cartItem.model";

export class Cart{
  products: CartItem[];

  constructor(products: { product: Product; quantity: number }[]) {
    this.products = products;
  }
}
