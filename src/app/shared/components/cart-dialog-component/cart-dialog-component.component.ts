import { AfterViewInit, Component, inject, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/api/auth.service.ts.service';
import { IconModule } from '../../icons/icon.module';
import { BehaviorSubject, catchError, of, Subscription, switchMap } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { CartService } from '../../service/Cart.service';

@Component({
  selector: 'app-cart-dialog-component',
  templateUrl: './cart-dialog-component.component.html',
  styleUrl: './cart-dialog-component.component.scss',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,ReactiveFormsModule,IconModule],
 
})
export class CartDialogComponent implements OnInit, OnDestroy{

  private dialogSubscription: Subscription | undefined;

  private _authService = inject(AuthService);
  private _cartService = inject(CartService);

  constructor(
    public dialogRef: MatDialogRef<CartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cartItems: any }
  ) {
    console.log(this.data.cartItems);
  }


  ngOnInit() {
    this.dialogSubscription = this._cartService.isDialogOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.openDialog();
      } else {
        this.closeDialog();
      }
    });
  }

  ngOnDestroy() {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }


  private openDialog() {
    // Logica per aprire la finestra di dialogo
    console.log('Dialog opened');
  }

  private closeDialog() {
    // Logica per chiudere la finestra di dialogo
    console.log('Dialog closed');
  }




  onNoClick(): void {
    this.dialogRef.close();
  }





  RemoveFromCart(idtheme: number): void {
    console.log("Removing theme with id: " + idtheme);
    this._authService.RemoveFromCart(idtheme).pipe(
      catchError((error) => {
        console.error('Error during DELETE of idtheme:' + idtheme, error);
        return of(null);
      })
    ).subscribe(
      (result) => {
        if (result !== null) {
          console.log('Item successfully removed from cart');
          this._cartService.closeDialog(); // Chiude la finestra di dialogo corrente
          this._cartService.updateCart(); // questo invece apre una nuova finestra di dialogo con il carrello aggiornato
        } else {
          console.log('Failed to remove item from cart');
        }
      }
    );
  }



  

  onCheckout(): void {
    // Implement checkout logic here
    console.log('Proceeding to checkout');
    this.dialogRef.close('checkout');
  }

}
