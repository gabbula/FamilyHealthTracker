import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { MemberDetailPageComponent } from './pages/member-detail-page/member-detail-page.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'dashboard', component: DashboardPageComponent },
	{ path: 'members/:id', component: MemberDetailPageComponent },
	{ path: '**', redirectTo: 'dashboard' }
];
