import { Component , EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/api/auth.service.ts.service';
import { MatDialog } from '@angular/material/dialog';
import { CartDialogComponent } from '../cart-dialog-component/cart-dialog-component.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserPurchasesComponent } from '../user-purchases-component/user-purchases-component.component';
import { Observable, take, firstValueFrom, Subscription } from 'rxjs';
import { CartService } from '../../service/Cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [ MaterialModule,FormsModule,CommonModule , ReactiveFormsModule]
})
export class HeaderComponent implements OnInit, OnDestroy {

  private cartSubscription: Subscription | undefined;

  cartItemCount: number = 0;

  private _router: Router = inject(Router);

  private _authService = inject(AuthService);

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private cartService: CartService
   ) { }


  ngOnInit() {
    this.cartSubscription = this.cartService.cartUpdated$.subscribe(() => {
      this.openCart();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }


  public goToTheme(): void {
    this._router.navigate(['theme-catalog/Customer-Dashboard']);
  }

  public goToUser(): void {
    this._router.navigate(['theme-catalog/user']);
  }

  public goToUserSecurity(): void {
    this._router.navigate(['security/user']);
  }
  
  public goToRole(): void {
    this._router.navigate(['security/role']);
  }

  public goToCategory(): void {
    this._router.navigate(['theme-catalog/category']);
  }

  signOut() {
    this.authService.logout();
  }



  openCart() {
    // Check if the dialog is already open
    this.cartService.isDialogOpen$.pipe(take(1)).subscribe(isOpen => {
      if (!isOpen) {
        this.cartService.toggleDialog(); // Set the dialog as open
  
        firstValueFrom(this.getCartItems())
          .then(cartItems => {
            console.log('Opening Cart Dialog with items:', cartItems);
  
            const dialogRef = this.dialog.open(CartDialogComponent, {
              width: '800px',
              height: '600px',
              data: { cartItems: cartItems }
            });
  
            dialogRef.afterOpened().subscribe(() => {
              console.log('Cart dialog is now open');
            });
  
            dialogRef.beforeClosed().subscribe(result => {
              console.log('Cart dialog is about to close. Result:', result);
            });
  
            dialogRef.afterClosed().subscribe(result => {
              console.log('Cart dialog was closed. Result:', result);
              this.cartService.closeDialog(); // Set the dialog as closed
              if (result) {
                console.log('Handling actions after the cart dialog was closed.');
              }
            });
          })
          .catch(error => {
            console.error('Error fetching cart items:', error);
          });
      }
    });
  }

  
  
  

  openUserPurchases() {
    this.viewUserPurchases().pipe(take(1)).subscribe(
      purchases => {
        const dialogRef = this.dialog.open(UserPurchasesComponent, {
          width: '800px',
          height: '600px',
          data: { userPurchases: purchases }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('The purchases dialog was closed', result);
          }
        });
      },
      error => {
        console.error('Error fetching user purchases:', error);
        // Handle error (e.g., show an error message to the user)
      }
    );
  }




  viewUserPurchases(): Observable<any[]> {
    return this.authService.GetPurchasesByUser();
  }


  getCartItems() {
    return  this._authService.GetCart();
  }



  @Output() toggleSidenav = new EventEmitter<void>();

}





