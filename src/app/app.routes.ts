import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { voterGuard } from './guards/voter.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./pages/admin/elections/elections.component').then(m => m.ElectionsComponent)
      },
      {
        path: 'parties',
        loadComponent: () => import('./pages/admin/parties/parties.component').then(m => m.PartiesComponent)
      },
      {
        path: 'candidates',
        loadComponent: () => import('./pages/admin/candidates/candidates.component').then(m => m.CandidatesComponent)
      },
      {
        path: 'voters',
        loadComponent: () => import('./pages/admin/voters/voters.component').then(m => m.VotersComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./pages/admin/results/results.component').then(m => m.ResultsComponent)
      }
    ]
  },
  {
    path: 'voter',
    loadComponent: () => import('./layouts/voter-layout/voter-layout.component').then(m => m.VoterLayoutComponent),
    canActivate: [authGuard, voterGuard],
    children: [
      {
        path: '',
        redirectTo: 'vote',
        pathMatch: 'full'
      },
      {
        path: 'vote',
        loadComponent: () => import('./pages/voter/vote/vote.component').then(m => m.VoteComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./pages/voter/voter-results/voter-results.component').then(m => m.VoterResultsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];



