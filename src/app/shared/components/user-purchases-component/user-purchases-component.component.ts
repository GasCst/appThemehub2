import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-purchases-component',
  templateUrl: './user-purchases-component.component.html',
  styleUrl: './user-purchases-component.component.scss',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,ReactiveFormsModule],
})
export class UserPurchasesComponent{
  constructor(
    public dialogRef: MatDialogRef<UserPurchasesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userPurchases: any[] }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCheckout(): void {
    // Implement checkout logic here
    console.log('Proceeding to checkout');
    this.dialogRef.close('checkout');
  }

}
