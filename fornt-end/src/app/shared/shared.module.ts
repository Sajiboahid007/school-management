import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    TableCaptionComponent,
    TruncateTextPipe
  ]
})
export class SharedModule { }
