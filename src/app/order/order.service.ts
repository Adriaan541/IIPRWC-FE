import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Order } from "../models/order.model";
import { Cart } from "../models/cart.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl: string = "/api/order";

  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get<Order[]>(`${this.apiUrl}`).pipe();
  }

  createOrder(cart: Cart) {
    const orderProducts = [];

    for (let cartItem of cart.products) {
      const orderProduct = {
        id: {
          productId: cartItem.product.id,
        },
        product: cartItem.product,
        quantity: cartItem.quantity
      };
      orderProducts.push(orderProduct);
    }

    const order = {
      orderProducts: orderProducts
    };

    return this.http.post(`${this.apiUrl}`, order).pipe();
  }

  deleteOrder(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe();
  }
}
