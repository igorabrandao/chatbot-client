import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotPageRoutingModule } from './chatbot-routing.module';
import { ChatbotPage } from './chatbot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChatbotPageRoutingModule
  ],
  declarations: [ChatbotPage]
})
export class ChatbotPageModule {}
