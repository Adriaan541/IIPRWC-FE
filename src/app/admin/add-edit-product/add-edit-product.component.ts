import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { FormBuilder,  FormGroup, Validators } from "@angular/forms";
import { Category } from "../../models/category.model";
import { ShopService } from "../../shop/shop.service";
import { Product } from "../../models/product.model";
import { AdminService } from "../admin.service";
import { AuthService } from "../../auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html'
})
export class AddEditProductComponent implements OnInit, OnDestroy {
  public isNew: boolean = false;
  public toEditType: string = ''
  public toEdit: Product | Category = {} as Product;
  public form: FormGroup;
  public categories: Category[] = [];
  public successMessage: string = '';
  public error: string = '';

  public selectedCategory: Category = {} as Category;

  public categoryToDelete: Category = {} as Category;
  public warning: string = '';

  private routerSubscription: Subscription = {} as Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private shopService: ShopService,
              private adminService: AdminService,
              private authService: AuthService) {
    this.form = this.formBuilder.group({});

  }

  ngOnInit() {
    this.init();
    this.routerSubscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  init() {
    this.getCategories();
    this.objectCheck();
  }

  async objectCheck() {
    let url = this.router.url;

    if (url.includes("addproduct")) {
      this.isNew = true;
      this.objectIsProduct();
    } else if (url.includes("addcategory")) {
      this.isNew = true;
      this.objectIsCategory();
    } else if (url.includes("editproduct")) {
      this.isNew = false;
      this.getProduct();
      this.objectIsProduct();
    } else if (url.includes("editcategory")) {
      this.isNew = false;
      this.objectIsCategory();
      this.toEditHasCategoryCheck();
    }
  }

  getProduct() {
    let productId;
    this.route.params.subscribe(p => {
      productId = p['productId'];
    });
    if (productId) {
      this.shopService.getProductById(productId).subscribe({
        next: (product) => {
          this.toEdit = product;
          this.form.patchValue(this.toEdit);
          this.selectedCategory = product.category;
        },
        error: (e) => {
          this.error = e;
        }
      });
    }
  }


  getCategories() {
    this.shopService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.sort((a, b) => a.name.localeCompare(b.name));
        this.setCategoryToEdit();
      },
      error: (e) => {
        this.error = e.message;
        if (e.status == 500) {
          this.authService.destroySession();
          this.router.navigateByUrl('/auth/login');
        }
      }
    });
  }

  setCategoryToEdit() {
    if (this.toEditType == 'Category') {
      let categoryId: string;
      this.route.params.subscribe(c => {
        categoryId = c['categoryId'];
      });
      let categoryToEdit = this.categories.find(category => category.id == categoryId);
      if (categoryToEdit) {
        this.form.patchValue(categoryToEdit);
        this.toEdit = categoryToEdit;
      }

    }
  }

  toEditHasCategoryCheck() {
    if (this.toEdit.hasOwnProperty('category')) {
      // @ts-ignore
      return this.toEdit?.category;
    }
  }

  objectIsProduct() {
    this.toEditType = 'Product';
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      pictureUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\//)]]
    });
  }

  objectIsCategory() {
    this.toEditType = 'Category';
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  onCategoryChange(event: any) {
    let categoryId = event.target.value;
    let category = this.categories.find(cat => cat.id = categoryId);
    if (category) {
      this.selectedCategory = category;
    }

  }

  submit() {
    this.error = '';
    this.successMessage = '';
    let val = this.form.value;

    if (this.toEditType == 'Product' && val.name && val.shortDescription && val.description && val.price && val.stockQuantity && val.pictureUrl && this.selectedCategory) {
      let product = new Product('', val.name, val.shortDescription, val.description, val.price, val.stockQuantity, val.pictureUrl, this.selectedCategory);

      if (this.isNew) {
        this.addProduct(product);
      } else {
        this.patchProduct(product);
      }
    } else if (this.toEditType == 'Category' && val.name) {
      let category = new Category('', val.name, []);
      if (this.isNew) {
        this.addCategory(category);
      } else {
        this.patchCategory(category);
      }
    }
  }

  addProduct(product: Product) {
    this.adminService.createProduct(product).subscribe({
      next: (product) => {this.successMessage = `Product with name ${product.name} created!`; this.init()},
      error: (e) => {this.error = e.message;}
    });
  }

  patchProduct(product: Product) {
    product.id = this.toEdit.id;
    this.adminService.patchProduct(product).subscribe({
      next: (product) => {this.successMessage = `Product ${product.name} patched!`; this.router.navigateByUrl('/home')},
      error: (e) => {this.error = e.message;}
    });
  }

  addCategory(category: Category) {
    this.adminService.createCategory(category).subscribe({
      next: (category) => {
        this.successMessage = `Category with name ${category.name} created!`;
        this.getCategories();},
      error: (e) => {this.error = e.message;}
    });
  }

  patchCategory(category: Category) {
    category.id = this.toEdit.id;
    let oldName = this.toEdit.name;
    if (this.toEdit.hasOwnProperty('products')) {
      // @ts-ignore
      category.products = this.toEdit.products;
    }
    this.adminService.patchCategory(category).subscribe({
      next: (category) => {
        this.successMessage = `Category name changed from ${oldName} to ${category.name}!`;
        this.getCategories();},
      error: (e) => {this.error = e.message;}
    });
  }

  deleteCategoryClicked(category: Category) {
    this.categoryToDelete = category;
    if (category.products.length) {
      this.warning = 'deleteCategoryWarning';
    } else {
      this.deleteCategoryConfirmed();
    }
  }

  deleteCategoryConfirmed() {
    this.adminService.deleteCategory(this.categoryToDelete).subscribe({
      next: cat => {this.getCategories()},
      error: e => {this.error = e;}
    });

    this.categoryToDelete = {} as Category;
    this.warning = '';
  }

  deleteCategoryCancelled() {
    this.categoryToDelete = {} as Category;
    this.warning = '';
  }
}
