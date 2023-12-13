import { Component } from '@angular/core';
import { CartService } from "../cart.service";

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html'
})
export class CartListComponent {
  public error: string = '';

  constructor(public cartService: CartService) {
  }

  emptyCart() {
    this.cartService.emptyCart();
  }

  checkOut() {
    this.cartService.createOrder().subscribe({
      next: order => {this.emptyCart();},
      error: e => {this.error = e;}
    });
  }
}
