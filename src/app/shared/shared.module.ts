import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SlideBarComponent } from './components/slide-bar/slide-bar.component';


@NgModule({
  declarations: [
    SlideBarComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ], exports: [
    SlideBarComponent
  ]
})
export class SharedModule { }
