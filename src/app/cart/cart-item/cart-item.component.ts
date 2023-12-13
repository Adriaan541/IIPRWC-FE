import { Component, Input } from '@angular/core';
import { CartItem } from "../../models/cartItem.model";
import { CartService } from "../cart.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {
  @Input() cartItem: CartItem = {} as CartItem;
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              public router: Router) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      quantity: [this.cartItem.quantity, [Validators.required, Validators.min(1), Validators.max(this.cartItem.product.stockQuantity)]]
    });
  }

  removeFromCart() {
    this.cartService.removeFromCart(this.cartItem.product.id);
  }

  updateQuantity() {
    let val = this.form.value;
    this.cartService.updateQuantity(this.cartItem.product, val.quantity);
  }
}
