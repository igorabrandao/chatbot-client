import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { AuthGuard } from 'src/guards/auth.guard';
//import { LoginGuard } from 'src/guards/login.guard';

const routes: Routes = [
    // **************************************************
    // INITIAL SCREEN
    // **************************************************
    {
        path: '',
        redirectTo: 'chatbot',
        pathMatch: 'full'
    },
    // **************************************************
    // CHATBOT PAGE
    // **************************************************
    {
        path: 'chatbot',
        loadChildren: () => import('src/pages/chatbot/chatbot.module').then(m => m.ChatbotPageModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
