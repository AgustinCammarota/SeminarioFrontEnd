import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from '@angular/material/stepper';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';


@NgModule({
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
  ],
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MaterialFileInputModule,
    MatCardModule,
    MatTooltipModule,
    MatStepperModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MaterialFileInputModule,
    MatCardModule,
    MatTooltipModule,
    MatStepperModule
  ]
})
export class MaterialModule { }
