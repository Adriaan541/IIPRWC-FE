import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from "../../models/order.model";
import { Router } from "@angular/router";
import { AuthService } from "../../auth.service";
import { OrderService } from "../order.service";

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html'
})
export class OrderItemComponent {
  @Input() order: Order = {} as Order;
  @Output() refreshOrders = new EventEmitter<void>();
  public isAdmin = this.authService.isAdmin();
  public accordeonExpanded = this.isAdmin;
  public error: string = '';

  constructor(private router: Router,
              private authService: AuthService,
              private orderService: OrderService) {}

  returnOrder(event: Event) {
    event.preventDefault();
    this.orderService.deleteOrder(this.order.id!).subscribe({
      next: order => {this.refreshOrders.emit();},
      error: e => {this.error = e.message;}
    });
  }

  returnOrdersAvailable() {
    let thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(new Date().getDate() - 30);

    if (this.isAdmin || (this.order.orderDate && new Date(this.order.orderDate) >= thirtyDaysAgo)) {
      return true;
    } else {
      return false;
    }
  }

  toggleAccordeon() {
    this.accordeonExpanded = !this.accordeonExpanded;
  }

  getTotalPrice() {
    let totalPrice: number = 0;
    this.order.orderProducts.forEach(orderItem => {
      totalPrice += orderItem.product.price * orderItem.quantity;
    })
    return totalPrice;
  }
}
