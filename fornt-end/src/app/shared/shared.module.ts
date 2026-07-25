import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TableCaptionComponent } from './components/table-caption/table-caption.component';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    TableCaptionComponent,
    TruncateTextPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    BadgeModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    SelectModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    BadgeModule,
    HeaderComponent,
    FooterComponent,
    TableCaptionComponent,
    TruncateTextPipe
  ]
})
export class SharedModule { }
