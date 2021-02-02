import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './chatbot.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const chatbotRoutes: Routes = [
  {
    path: '',
    component: ChatbotComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(
      chatbotRoutes,
    )
  ],
  declarations: [
    ChatbotComponent
  ],
  providers: []
})
export class ChatbotModule {
}
