import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { AuthService } from "../auth.service";
import { HttpClient } from "@angular/common/http";
import { Category } from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  getProducts() {
    let apiUrl: string = "/api/products";
    let headers: any;

    if (this.authService.isAdmin()) {
      apiUrl = "/api/products/all";
    } else if (!this.authService.isLoggedIn()) {
      headers = {skip: "true"};
    }

    return this.http.get<Product[]>(apiUrl, { headers }).pipe();
  }

  getProductById(productId: String) {
    let apiUrl: string = `/api/products/${productId}`;
    
    return this.http.get<Product>(apiUrl).pipe();
  }

  getCategories() {
    let apiUrl: string = "/api/category";
    let headers: any;

    if (this.authService.isAdmin()) {
      apiUrl = "/api/category/all";
    } else if (!this.authService.isLoggedIn()) {
      headers = {skip: "true"};
    }

    return this.http.get<Category[]>(apiUrl, { headers }).pipe();
  }
}
