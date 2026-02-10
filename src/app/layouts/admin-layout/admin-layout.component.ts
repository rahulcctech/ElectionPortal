import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  sidebarCollapsed = signal(false);

  constructor(public authService: AuthService) {}

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  getInitials(): string {
    const name = this.authService.getUserName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout(): void {
    this.authService.logout();
  }
}
