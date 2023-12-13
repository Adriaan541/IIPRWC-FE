import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrlProducts: string = "/api/products";
  private apiUrlCategories: string = "/api/category";

  constructor(private http: HttpClient) {
  }

  createProduct(product: Product) {
    return this.http.post<Product>(this.apiUrlProducts, product).pipe();
  }

  patchProduct(product: Product) {
    return this.http.put<Product>(`${this.apiUrlProducts}/${product.id}`, product).pipe();
  }

  deleteProduct(product: Product) {
    return this.http.delete<Product>(`${this.apiUrlProducts}/${product.id}`).pipe();
  }

  createCategory(category: Category) {
    return this.http.post<Category>(this.apiUrlCategories, category).pipe();
  }

  patchCategory(category: Category) {
    return this.http.put<Category>(`${this.apiUrlCategories}/${category.id}`, category).pipe();
  }

  deleteCategory(category: Category) {
    return this.http.delete<Category>(`${this.apiUrlCategories}/${category.id}`).pipe();
  }
}
