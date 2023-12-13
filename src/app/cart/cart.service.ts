import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Cart } from "../models/cart.model";
import { Product } from "../models/product.model";
import { OrderService } from "../order/order.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Cart = {} as Cart;

  constructor(private http: HttpClient,
              private orderService: OrderService) {
  }

  public setCart(cartItems: { product: Product, quantity: number }[]) {
    this.cart.products = cartItems;
  }

  public emptyCart() {
    this.cart = {} as Cart;
  }

  public addToCart(product: Product, quantity: number) {
    if (!this.cart.products) {
      this.cart = new Cart([]);
    }

    const productInCartFilter = this.cart?.products?.findIndex(cartProduct => cartProduct.product.id === product.id) ?? -1;
    const productInCart = productInCartFilter !== -1 ? this.cart.products[productInCartFilter] : null;

    if (!productInCart && product.stockQuantity >= quantity) {
      const cartItem = { product, quantity }
      this.cart.products.push(cartItem);
      return "Product added to cart!";

    } else if (productInCart && productInCart.product.stockQuantity >= productInCart.quantity + quantity) {
      productInCart.quantity += quantity;
      return "Cart updated!";

    } else if (product.stockQuantity < quantity) {
      const cartItem = { product, quantity: product.stockQuantity };
      this.cart.products.push(cartItem);
      return "Unfortunately your cart exceeds our stock quantity. We've updated your cart to the maximum we can sell right now.";

    } else if (productInCart && product.stockQuantity < quantity + productInCart.quantity) {
      productInCart.quantity = product.stockQuantity;
      return "Unfortunately your cart exceeds our stock quantity. We've updated your cart to the maximum we can sell right now.";
    }
    return "Something went wrong, please try again later."
  }

  getTotalPrice() {
    let totalPrice: number = 0;
    this.cart.products.forEach(product => {
      totalPrice += product.quantity * product.product.price;
    })
    return totalPrice;
  }

  removeFromCart(productId: string) {
    const toRemove = this.cart.products.findIndex(product => product.product.id == productId);
    this.cart.products.splice(toRemove, 1);
    if (this.cart.products.length < 1) {
      this.cart = {} as Cart;
    }
  }

  updateQuantity(product: Product, quantity: number) {
    const productInCartFilter = this.cart?.products?.findIndex(cartProduct => cartProduct.product.id === product.id) ?? -1;
    const productInCart = productInCartFilter !== -1 ? this.cart.products[productInCartFilter] : null;

    if (quantity > 0 && quantity <= product.stockQuantity) {
      productInCart!.quantity = quantity;
    }
  }

  createOrder() {
    return this.orderService.createOrder(this.cart);
  }
}
