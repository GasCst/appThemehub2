import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from './icons/icon.module';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { NavigabilityComponent } from './components/navigability/navigability.component';
import { UserPurchasesComponent } from './components/user-purchases-component/user-purchases-component.component';

@NgModule({
  declarations: [ NavigabilityComponent ],
  imports: [CommonModule, IconModule, MaterialModule, RouterModule, UserPurchasesComponent],
  exports: [ NavigabilityComponent],
})
export class SharedModule {}
