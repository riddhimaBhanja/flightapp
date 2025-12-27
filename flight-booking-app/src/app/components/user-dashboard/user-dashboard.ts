import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- Animated Background Particles -->
      <div class="particles-bg"></div>

      <header class="dashboard-header">
        <div class="header-content">
          <div class="welcome-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <div>
              <span class="greeting">Welcome back,</span>
              <h1>{{ username }}!</h1>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div class="dashboard-content">
        <div class="welcome-section">
          <div class="hero-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <h2>Your Flight Booking Dashboard</h2>
          <p>Discover destinations, manage bookings, and plan your perfect journey</p>
        </div>

        <div class="action-cards">
          <div class="card card-flights" (click)="navigateToFlights()">
            <div class="card-bg"></div>
            <div class="card-content">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h3>Search Flights</h3>
              <p>Find and book your next adventure from 500+ destinations</p>
              <div class="card-arrow">→</div>
            </div>
          </div>

          <div class="card card-history" (click)="navigateToBookingHistory()">
            <div class="card-bg"></div>
            <div class="card-content">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3>Booking History</h3>
              <p>View all your past and upcoming flight bookings</p>
              <div class="card-arrow">→</div>
            </div>
          </div>

          <div class="card card-profile" (click)="navigateToProfile()">
            <div class="card-bg"></div>
            <div class="card-content">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3>Profile</h3>
              <p>Manage your account settings and preferences</p>
              <div class="card-arrow">→</div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">✈️</div>
            <div class="stat-info">
              <div class="stat-number">500+</div>
              <div class="stat-label">Daily Flights</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🌍</div>
            <div class="stat-info">
              <div class="stat-number">50+</div>
              <div class="stat-label">Destinations</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <div class="stat-number">Best</div>
              <div class="stat-label">Prices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

    .dashboard-container {
      min-height: 100vh;
      position: relative;
      font-family: 'Poppins', sans-serif;
      overflow-x: hidden;
      background:
        linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.35) 50%, rgba(21, 101, 192, 0.45) 100%),
        url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80') center/cover fixed;
    }

    .particles-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
      animation: pulse 8s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .dashboard-header {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(25px) saturate(180%);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      padding: 1.5rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 3px solid rgba(255, 215, 0, 0.3);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .welcome-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(255, 215, 0, 0.12));
      border-radius: 20px;
      border: 2px solid rgba(255, 215, 0, 0.3);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
      transition: all 0.3s ease;
    }

    .welcome-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.25);
    }

    .welcome-card svg {
      color: #667eea;
      filter: drop-shadow(0 4px 10px rgba(102, 126, 234, 0.4));
    }

    .greeting {
      display: block;
      font-size: 0.9rem;
      color: #666;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .welcome-card h1 {
      margin: 0;
      color: #1565C0;
      font-size: 1.8rem;
      font-weight: 900;
      letter-spacing: -0.5px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 14px;
      cursor: pointer;
      font-size: 1.05rem;
      font-weight: 700;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
    }

    .logout-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }

    .dashboard-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
      position: relative;
      z-index: 1;
    }

    .welcome-section {
      text-align: center;
      color: white;
      margin-bottom: 4rem;
      position: relative;
      padding: 3rem 2rem;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      animation: fadeInDown 0.8s ease;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 15px 50px rgba(102, 126, 234, 0.4),
        0 0 60px rgba(255, 215, 0, 0.3);
      border: 4px solid rgba(255, 215, 0, 0.6);
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }

    .hero-icon svg {
      width: 65px;
      height: 65px;
      color: white;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
    }

    .welcome-section h2 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 900;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      letter-spacing: -1px;
    }

    .welcome-section p {
      font-size: 1.3rem;
      opacity: 0.95;
      font-weight: 500;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .action-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
      margin-bottom: 4rem;
    }

    .card {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      height: 320px;
      animation: slideUp 0.6s ease backwards;
    }

    .card:nth-child(1) { animation-delay: 0.1s; }
    .card:nth-child(2) { animation-delay: 0.2s; }
    .card:nth-child(3) { animation-delay: 0.3s; }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: transform 0.6s ease;
    }

    .card-flights .card-bg {
      background:
        linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(21, 101, 192, 0.90) 100%),
        url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80');
    }

    .card-history .card-bg {
      background:
        linear-gradient(135deg, rgba(244, 63, 94, 0.85) 0%, rgba(220, 38, 38, 0.90) 100%),
        url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80');
    }

    .card-profile .card-bg {
      background:
        linear-gradient(135deg, rgba(16, 185, 129, 0.85) 0%, rgba(5, 150, 105, 0.90) 100%),
        url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80');
    }

    .card:hover .card-bg {
      transform: scale(1.1);
    }

    .card:hover {
      transform: translateY(-15px) scale(1.03);
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
    }

    .card-content {
      position: relative;
      z-index: 2;
      padding: 2.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
    }

    .card-icon {
      width: 85px;
      height: 85px;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      border: 2px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .card:hover .card-icon {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }

    .card-icon svg {
      color: white;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
    }

    .card h3 {
      font-size: 2rem;
      margin-bottom: 0.8rem;
      font-weight: 900;
      text-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
    }

    .card p {
      font-size: 1.05rem;
      opacity: 0.95;
      line-height: 1.6;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      font-weight: 500;
    }

    .card-arrow {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: right;
      opacity: 0.8;
      transition: all 0.3s ease;
    }

    .card:hover .card-arrow {
      opacity: 1;
      transform: translateX(10px);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      animation: fadeIn 0.8s ease 0.4s backwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(25px);
      padding: 2rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border: 2px solid rgba(255, 215, 0, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);
    }

    .stat-icon {
      font-size: 3.5rem;
      filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3));
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #1565C0 0%, #0d47a1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.1;
      margin-bottom: 0.3rem;
    }

    .stat-label {
      font-size: 1rem;
      color: #546e7a;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .welcome-section h2 {
        font-size: 2rem;
      }

      .action-cards {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserDashboardComponent {
  username: string = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    const user = this.auth.currentUserValue;
    this.username = user?.username || 'User';
  }

  navigateToFlights() {
    this.router.navigate(['/flights']);
  }

  navigateToBookingHistory() {
    this.router.navigate(['/booking-history']);
  }

  navigateToProfile() {
    this.router.navigate(['/user-profile']);
  }

  logout() {
    this.auth.logout();
  }
}
