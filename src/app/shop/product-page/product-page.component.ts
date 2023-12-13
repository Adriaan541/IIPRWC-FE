import { Component } from '@angular/core';
import { Product } from "../../models/product.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../auth.service";
import { CartService } from "../../cart/cart.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ShopService } from "../shop.service";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html'
})
export class ProductPageComponent {
  public product: Product = {} as Product;

  public form: FormGroup;
  public productAddedToCartMessage: string = '';
  public productPageUrlDisabled = false;
  public quantity: number = 1;
  public buttonText: string = 'Add to cart';
  public error: string = '';

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService,
              private cartService: CartService,
              public router: Router,
              private route: ActivatedRoute,
              public shopService: ShopService) {
    this.form = this.formBuilder.group({
      quantity: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.setButtonText()
    });
    this.getProduct();
  }

  preventPropagationClicks(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  getProduct() {
    let productId;
    this.route.params.subscribe(p => {
      productId = p['productId'];
    });
    if (productId) {
      this.shopService.getProductById(productId).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (e) => {
          this.error = e;
        }
      });
    }
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
}
