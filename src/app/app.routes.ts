import { Routes } from '@angular/router';
import { LoginComponent } from './pages/2. login/login.component';
import { InscriptionComponent } from './pages/1. inscription/inscription.component';
import { AccueilComponent } from './pages/3. accueil/accueil.component';


export const routes: Routes = [{
    path: '',
    redirectTo: "accueil",
    pathMatch: 'full'

},{
    path: "login",
    component: LoginComponent
},
{
    path: "inscription",
    component: InscriptionComponent
},
{
    path: "accueil",
    component: AccueilComponent
}];