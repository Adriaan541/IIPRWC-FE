import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CartService } from "../../cart/cart.service";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent{
  @ViewChild("cartView") cartView: ElementRef | undefined;
  public showCart: boolean = false;
  public isLoggedIn = this.authService.isLoggedIn();
  public isAdmin = this.authService.isAdmin();


  constructor(private http: HttpClient,
              public cartService: CartService,
              private router: Router,
              private authService: AuthService,
              private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Check if the click is outside the cart and close it
    // @ts-ignore
    if (!this.cartView.nativeElement.contains(event.target)) {
      this.showCart = false;
    }
  }

  focusOnCart() {

    if (this.cartView) {
      this.cartView.nativeElement.focus();
      console.log("clicked")
    }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('auth/login');
  }

  toggleCart() {
    if (this.cartService.cart.products) {
      this.showCart = !this.showCart;
    } else {
      this.showCart = false;
    }
  }
}
