import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from "../../models/product.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../auth.service";
import { CartService } from "../../cart/cart.service";
import { Router } from "@angular/router";
import { AdminService } from "../../admin/admin.service";

@Component({
  selector: 'app-product-item',
  providers: [ProductItemComponent],
  templateUrl: './product-item.component.html'
})
export class ProductItemComponent implements OnInit{
  @Input() product: Product = {} as Product;
  @Output() refreshProducts = new EventEmitter<void>();

  public form: FormGroup;
  public isLoggedIn = this.authService.isLoggedIn();
  public isAdmin = this.authService.isAdmin();
  public productAddedToCartMessage: string = '';
  public productPageUrlDisabled = false;
  public quantity: number = 1;
  public buttonText: string = 'Add to cart';
  public error: string = '';

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService,
              private cartService: CartService,
              public router: Router,
              private adminService: AdminService) {
    this.form = this.formBuilder.group({
      quantity: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {this.setButtonText()});
  }

  preventPropagationClicks(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  setButtonText() {
    if (this.product.stockQuantity >= this.form.value.quantity) {
      this.buttonText = "Add to cart";
    } else if (this.product.stockQuantity < this.form.value.quantity) {
      this.buttonText = "Exceeds stock!";
    }
  }

  addToCart() {
    if (this.authService.isLoggedIn()) {
      let values = this.form.value;
      this.productAddedToCartMessage = this.cartService.addToCart(this.product, values.quantity);
    } else {
      this.productPageUrlDisabled = true;
      this.router.navigateByUrl('/auth/login');
    }
  }

  deleteProduct() {
    this.adminService.deleteProduct(this.product).subscribe({
      next: (product) => {this.refreshProducts.emit();},
      error: (e) => { this.error = e; }
      }
    );
  }
}
