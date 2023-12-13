import { Product } from "./product.model";

export class Category {
  id: string;
  name: string;
  products: Product[];

  constructor(id: string, name: string, products: Product[]) {
    this.id = id;
    this.name = name;
    this.products = products;
  }
}
