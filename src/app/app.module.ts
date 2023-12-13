import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NavbarComponent } from './nav/navbar/navbar.component';
import { RegisterComponent } from './account/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptorService } from "./auth-interceptor.service";
import { AccountComponent } from './account/account/account.component';
import { AddEditCategoryComponent } from './admin/add-edit-category/add-edit-category.component';
import { AddEditProductComponent } from './admin/add-edit-product/add-edit-product.component';
import { CartItemComponent } from './cart/cart-item/cart-item.component';
import { CartListComponent } from './cart/cart-list/cart-list.component';
import { HomeComponent } from './home/home.component';
import { OrderItemComponent } from './order/order-item/order-item.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { ProductListComponent } from './shop/product-list/product-list.component';
import { ProductItemComponent } from './shop/product-item/product-item.component';
import { ProductPageComponent } from './shop/product-page/product-page.component';
import { CartService } from "./cart/cart.service";
import { ShopService } from "./shop/shop.service";
import { AdminService } from "./admin/admin.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    AccountComponent,
    AddEditCategoryComponent,
    AddEditProductComponent,
    CartItemComponent,
    CartListComponent,
    HomeComponent,
    OrderItemComponent,
    OrderListComponent,
    ProductListComponent,
    ProductItemComponent,
    ProductPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    CartService,
    ShopService,
    AdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
