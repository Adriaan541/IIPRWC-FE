import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./account/login/login.component";
import { RegisterComponent } from "./account/register/register.component";
import { ProductListComponent } from "./shop/product-list/product-list.component";
import { AccountComponent } from "./account/account/account.component";
import { ProductPageComponent } from "./shop/product-page/product-page.component";
import { AddEditProductComponent } from "./admin/add-edit-product/add-edit-product.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/register', component: RegisterComponent},
  { path: 'home', component: HomeComponent},
  { path: 'me', component: AccountComponent },
  { path: 'shop', component: ProductListComponent },
  { path: 'product/:productId', component: ProductPageComponent },
  { path: 'addproduct', component: AddEditProductComponent },
  { path: 'editproduct/:productId', component: AddEditProductComponent },
  { path: 'addcategory', component: AddEditProductComponent },
  { path: 'editcategory/:categoryId', component: AddEditProductComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
