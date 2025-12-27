import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { FlightSearch } from './components/flight-search/flight-search';
import { Home } from './components/home/home';
import { BookingHistoryComponent } from './components/booking-history/booking-history';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { AddFlightComponent } from './components/add-flight/add-flight';
import { AdminFlightsListComponent } from './components/admin-flights-list/admin-flights-list';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'change-password',
    loadComponent: () => import('./components/change-password/change-password').then(m => m.ChangePasswordComponent)
  },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [authGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'add-flight', component: AddFlightComponent, canActivate: [adminGuard] },
  { path: 'admin-flights', component: AdminFlightsListComponent, canActivate: [adminGuard] },
  { path: 'flights', component: FlightSearch, canActivate: [authGuard] },
  { path: 'booking-history', component: BookingHistoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
