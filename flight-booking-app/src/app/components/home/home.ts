import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  isAuthenticated = false;

  constructor(private authService: Auth, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  navigateToFlights(): void {
    if (this.isAuthenticated) {
      // Redirect based on role
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
