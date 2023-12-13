import { Category } from "./category.model";

export class Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  stockQuantity: number;
  pictureUrl: string;
  category: Category;

  constructor(id: string, name: string, shortDescription: string, description: string, price: number, stockQuantity: number, pictureUrl: string, category: Category) {
    this.id = id;
    this.name = name;
    this.shortDescription = shortDescription;
    this.description = description;
    this.price = price;
    this.stockQuantity = stockQuantity;
    this.pictureUrl = pictureUrl;
    this.category = category;
  }
}
