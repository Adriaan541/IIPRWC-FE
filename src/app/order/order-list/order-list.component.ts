import { Component, OnInit } from '@angular/core';
import { Order } from "../../models/order.model";
import { OrderService } from "../order.service";
import { finalize } from "rxjs";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit{
  public orders: Order[] =[];
  public ordersLoading: boolean = false;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.ordersLoading = true;
    this.orderService.getOrders().pipe(
      finalize(() => {
        this.ordersLoading = false;
      })
    ).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.sortOrders();
        },
      error: () => {}
    })
  }

  sortOrders() {
    this.orders.filter(item => item.orderDate !== undefined);
    // @ts-ignore
    this.orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }
}
