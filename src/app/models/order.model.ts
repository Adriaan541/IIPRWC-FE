import { OrderItem } from "./order-item.model";
import { User } from "./user.model";

export class Order{
  id?:string;
  orderProducts: OrderItem[];
  orderDate?: Date;
  user?: User;

  constructor(items: OrderItem[]) {
    this.orderProducts = items;
  }
}
