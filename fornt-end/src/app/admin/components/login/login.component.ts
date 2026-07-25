import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../../shared/services/login-service.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';

  loginData = {
    Email: '',
    Password: ''
  };

  registerData = {
    Name: '',
    Email: '',
    Phone: '',
    Password: '',
    ConfirmPassword: ''
  };

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly loginService: LoginServiceService,
    private readonly router: Router
  ) {}

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.clearMessages();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    if (!this.loginData.Email || !this.loginData.Password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    this.loginService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('userType', (response as any).userType || 'USER');
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 800);
        } else {
          this.errorMessage = response.error || 'Invalid credentials.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }

  onRegister() {
    if (!this.registerData.Name || !this.registerData.Email || !this.registerData.Password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.registerData.Password !== this.registerData.ConfirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const payload = {
      Name: this.registerData.Name,
      Email: this.registerData.Email,
      Phone: this.registerData.Phone,
      Password: this.registerData.Password
    };

    this.loginService.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.data) {
          this.successMessage = 'Registration successful! You can now log in.';
          this.registerData = { Name: '', Email: '', Phone: '', Password: '', ConfirmPassword: '' };
          setTimeout(() => {
            this.switchTab('login');
          }, 1200);
        } else {
          this.errorMessage = response.error || 'Registration failed.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Registration failed. Email might already be registered.';
      }
    });
  }

  onGuestLogin() {
    this.isLoading = true;
    this.clearMessages();
    const guestUser = {
      Name: 'Guest User',
      Email: 'guest@school.com',
      Role: { Name: 'Guest' }
    };
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.setItem('userType', 'GUEST');

    this.successMessage = 'Continuing as Guest...';
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/admin/dashboard']);
    }, 600);
  }
}
