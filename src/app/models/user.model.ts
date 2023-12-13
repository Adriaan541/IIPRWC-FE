import { Product } from "./product.model";

export class User {
public id: string;
public email: string;
public firstName: string;
public preposition: string;
public lastName: string;
public createDate?: string;
public username: string;
public products: Product[];

  constructor(id: string, email: string, firstName: string, preposition: string, lastName: string, username: string, products: Product[]) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.preposition = preposition;
    this.lastName = lastName;
    this.username = username;
    this.products = products;
  }
}
