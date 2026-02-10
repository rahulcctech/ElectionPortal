import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  name = '';
  email = '';
  age: number | null = null;
  gender = '';
  password = '';
  confirmPassword = '';
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.signup({
      name: this.name,
      email: this.email,
      password: this.password,
      age: this.age ?? undefined,
      gender: this.gender || undefined
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to create account');
      }
    });
  }
}
