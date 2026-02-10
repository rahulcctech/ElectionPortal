import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  userType = signal('ADMIN');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setUserType(type: string): void {
    this.userType.set(type);
    this.errorMessage.set('');
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please enter both email and password');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({
      email: this.email,
      password: this.password,
      userType: this.userType()
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.userType === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/voter']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Invalid email or password');
      }
    });
  }
}
