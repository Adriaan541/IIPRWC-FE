import { Component, OnInit } from '@angular/core';
import { Order } from "../../models/order.model";
import { OrderService } from "../order.service";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit{
  public orders: Order[] =[];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.sortOrders();
        },
      error: e => {}
    })
  }

  sortOrders() {
    this.orders.filter(item => item.orderDate !== undefined);
    // @ts-ignore
    this.orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }
}
