import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartUpdatedSource = new Subject<void>();
  cartUpdated$ = this.cartUpdatedSource.asObservable();

  private isDialogOpenSubject = new BehaviorSubject<boolean>(false);
  isDialogOpen$ = this.isDialogOpenSubject.asObservable();

  updateCart() {
    this.cartUpdatedSource.next();
  }

  openDialog() {
    this.isDialogOpenSubject.next(true);
  }

  closeDialog() {
    this.isDialogOpenSubject.next(false);
  }

  toggleDialog() {
    this.isDialogOpenSubject.next(!this.isDialogOpenSubject.value);
  }
}