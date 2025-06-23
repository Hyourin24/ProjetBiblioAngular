import { Routes } from '@angular/router';
import { LoginComponent } from './pages/2. login/login.component';
import { InscriptionComponent } from './pages/1. inscription/inscription.component';
import { AccueilComponent } from './pages/3. accueil/accueil.component';
import { BookServiceService } from './services/book-service.service';
import { BookIdComponent } from './pages/4. book-id/book-id.component';
import { ProfilComponent } from './pages/section profil/1. profil/profil.component';
import { EventComponent } from './pages/5. event/event.component';
import { HistoriqueComponent } from './pages/section profil/2. historique/historique.component';
import { PosterComponent } from './pages/section profil/3. poster/poster.component';
import { ModifProfilComponent } from './pages/section profil/5.modif-profil/modif-profil.component';
import { MesLivresComponent } from './pages/section profil/4.mes-livres/mes-livres.component';


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
},
{
    path: "accueil",
    component: AccueilComponent
},
{
    path: "book/:id",
    component: BookIdComponent
},
{
    path: "event",
    component: EventComponent
},
{
    path: "profil",
    component: ProfilComponent
},
{
    path: "profil/historique",
    component: HistoriqueComponent
},
{
    path: "profil/poster",
    component: PosterComponent
},
{
    path: "profil/mes-livres",
    component: MesLivresComponent
},
{
    path: "profil/modifier",
    component: ModifProfilComponent
}
];