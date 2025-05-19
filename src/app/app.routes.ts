import { Routes } from '@angular/router';
import { LoginComponent } from './pages/2. login/login.component';
import { InscriptionComponent } from './pages/1. inscription/inscription.component';


export const routes: Routes = [{
    path: '',
    redirectTo: "login",
    pathMatch: 'full'

},{
    path: "login",
    component: LoginComponent
},
{
    path: "inscription",
    component: InscriptionComponent
}];