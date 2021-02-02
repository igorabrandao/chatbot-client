import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './core/helpers/auth/auth-guard.helper';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'chatbot',
        pathMatch: 'full'
    },
    {
        path: 'chatbot',
        //runGuardsAndResolvers: 'always',
        //canActivate: [AuthGuardService],
        loadChildren: 'app/components/chatbot/chatbot.module#ChatbotModule'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {enableTracing: false}
        )
    ],
    exports: [RouterModule],
    providers: [
        AuthGuardService
    ]
})

export class AppRoutingModules {
}
