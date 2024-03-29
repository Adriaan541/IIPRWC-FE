import { Component, OnInit } from '@angular/core';
import { Product } from "../models/product.model";
import { ShopService } from "../shop/shop.service";
import { finalize } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  public products: Product[] = [];
  public error: string = '';
  public productsLoading: boolean = false;

  constructor(private shopService: ShopService) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productsLoading = true;
    this.shopService.getProducts().pipe(
        finalize(() => {
          this.productsLoading = false;
        })
      ).subscribe({
      next: (products) => {
        this.products = products
          .sort((a,b) => {return a.stockQuantity - b.stockQuantity})
          .filter((product) => product.stockQuantity < 10);
      },
      error: (e) => {
        this.error = e;
      }
    })
  }
}
