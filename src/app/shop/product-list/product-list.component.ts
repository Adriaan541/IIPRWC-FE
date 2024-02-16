import { Component, OnInit } from '@angular/core';
import { Product } from "../../models/product.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../auth.service";
import { Category } from "../../models/category.model";
import { ShopService } from "../shop.service";
import { finalize } from "rxjs";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  public categories: Category[] = [];
  public products: Product[] = [];
  public selectedCategory: Category | undefined = undefined;
  public productsInCategory: Product[] = [];
  public sortTypes = [
    { sortBy: "category.name", buttonText: "Category" },
    { sortBy: "name", buttonText: "Name" },
    { sortBy: "price", buttonText: "Price" },
    { sortBy: "stockQuantity", buttonText: "Left in stock" }];
  public selectedSortType: string = "category.name";
  public sortDirection: string = '▼';
  public searchTerm: string = '';
  searchKeys: string[] = [
    "name", "shortDescription", "category.name"
  ]

  public productsLoading: boolean = false;

  public filteredProducts: Product[] = [];
  public error: string = '';

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private shopService: ShopService) {

  }

  ngOnInit() {
    this.getProducts();
    this.getCategories();
  }

  getProducts() {
    this.productsLoading = true;
    this.filteredProducts = [];
    this.shopService.getProducts().pipe(
      finalize(() => {
        this.productsLoading = false;
      })
    ).subscribe({
      next: (products) => {
        this.products = products;
        this.setFilteredProductsByCategory()
      },
      error: (e) => {
        this.error = e;
      }
    })
  }

  getCategories() {
    this.shopService.getCategories().subscribe({
      next: (categories) => {
        categories.sort((a, b) => a.name.localeCompare(b.name));
        this.categories = categories;
      },
      error: (e) => {
        this.error = e;
      }
    })
  }

  changeSelectedCategory(event: any) {
    const selectedCategoryId = event.target.value;
    this.selectedCategory = this.categories.find((category) => category.id == selectedCategoryId);
    this.setFilteredProductsByCategory();
  }

  setFilteredProductsByCategory() {
    if (this.selectedCategory !== undefined) {
      this.productsInCategory = this.products.filter(product => product.category.id == this.selectedCategory!.id);
    } else {
      this.productsInCategory = this.products;
    }
    this.applySearchFilter();
  }

  searchFilter() {
    let filteredNotUnique: Product[] = [];
    this.searchKeys.forEach(key => {
      this.productsInCategory.filter((product) => {
        if (this.getPropertyFromKeyString(product, key).toLowerCase().includes(this.searchTerm.toLowerCase().trim())) {
          filteredNotUnique.push(product);
        }
      });
    });
    let uniqueProductsSet = new Set(filteredNotUnique);
    this.filteredProducts = Array.from(uniqueProductsSet);
  }

  applySearchFilter() {
    if (this.searchTerm == '') {
      this.filteredProducts = this.productsInCategory;
    } else {
      this.searchFilter();
    }
    this.sortProducts();
  }

  changeSortType(event: any) {
    this.selectedSortType = event.target.value;
    this.sortProducts();
  }

  changeSortDirection() {
    if (this.sortDirection == '▼') {
      this.sortDirection = '▲';
    } else {
      this.sortDirection = '▼';
    }
    this.sortProducts();
  }

  getPropertyFromKeyString(obj: any, propertyKeyString: string): any {
    return propertyKeyString.split('.').reduce((acc, sortType) => acc[sortType], obj).toString();
  }

  sortProducts() {
    let pString = this.selectedSortType;

    if (this.getPropertyFromKeyString(this.filteredProducts[0], pString) * 0 === 0) {
      if (this.sortDirection == "▲") {
        this.filteredProducts.sort((a, b) => this.getPropertyFromKeyString(a, pString) - this.getPropertyFromKeyString(b, pString));
      } else {
        this.filteredProducts.sort((b, a) => this.getPropertyFromKeyString(a, pString) - this.getPropertyFromKeyString(b, pString));
      }
    } else {
      if (this.sortDirection == "▲") {
        this.filteredProducts.sort((a, b) => this.getPropertyFromKeyString(b, pString).localeCompare(this.getPropertyFromKeyString(a, pString)));
      } else {
        this.filteredProducts.sort((a, b) => this.getPropertyFromKeyString(a, pString).localeCompare(this.getPropertyFromKeyString(b, pString)));
      }
    }
  }
}
