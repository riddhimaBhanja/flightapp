import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>✈️ Admin Panel</h2>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item active" (click)="activeSection = 'overview'">
            <span class="nav-icon">📊</span>
            Overview
          </a>
          <a class="nav-item" (click)="activeSection = 'add-flight'">
            <span class="nav-icon">➕</span>
            Add Flight
          </a>
          <a class="nav-item" (click)="navigateToAdminFlights()">
            <span class="nav-icon">🛫</span>
            View All Flights
          </a>
          <a class="nav-item" (click)="navigateToFlights()">
            <span class="nav-icon">🔍</span>
            Search Flights
          </a>
          <a class="nav-item" (click)="navigateToBookingHistory()">
            <span class="nav-icon">📋</span>
            Booking History
          </a>
          <a class="nav-item logout" (click)="logout()">
            <span class="nav-icon">🚪</span>
            Logout
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="content-header">
          <h1>Welcome, Admin {{ username }}</h1>
          <div class="admin-badge">ADMIN</div>
        </header>

        <!-- Overview Section -->
        <div class="content-body" *ngIf="activeSection === 'overview'">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">✈️</div>
              <div class="stat-info">
                <h3>Total Flights</h3>
                <p class="stat-number">45</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📋</div>
              <div class="stat-info">
                <h3>Bookings Today</h3>
                <p class="stat-number">28</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>Active Users</h3>
                <p class="stat-number">156</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <h3>Revenue</h3>
                <p class="stat-number">$24,500</p>
              </div>
            </div>
          </div>

          <div class="admin-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
              <button class="action-btn primary" (click)="activeSection = 'add-flight'">
                <span class="btn-icon">➕</span>
                Add New Flight
              </button>
              <button class="action-btn secondary" (click)="navigateToAdminFlights()">
                <span class="btn-icon">🛫</span>
                View All Flights
              </button>
              <button class="action-btn secondary" (click)="navigateToFlights()">
                <span class="btn-icon">🔍</span>
                Search Flights
              </button>
              <button class="action-btn secondary" (click)="navigateToBookingHistory()">
                <span class="btn-icon">📊</span>
                View Bookings
              </button>
            </div>
          </div>
        </div>

        <!-- Add Flight Section -->
        <div class="content-body" *ngIf="activeSection === 'add-flight'">
          <div class="section-header">
            <h2>➕ Add New Flight</h2>
            <p>Create a new flight inventory entry</p>
          </div>
          <div class="add-flight-card">
            <button class="feature-btn" (click)="navigateToAddFlight()">
              <div class="feature-icon">✈️</div>
              <div class="feature-content">
                <h3>Open Flight Creation Form</h3>
                <p>Click here to add a new flight to the inventory</p>
              </div>
              <div class="feature-arrow">→</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background:
        linear-gradient(135deg, rgba(21, 101, 192, 0.3), rgba(13, 71, 161, 0.4)),
        linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(102, 126, 234, 0.2)),
        url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80') center/cover fixed;
      position: relative;
      animation: backgroundPulse 20s ease-in-out infinite;
    }

    @keyframes backgroundPulse {
      0%, 100% { background-position: 0% 50%, 100% 50%; }
      50% { background-position: 100% 50%, 0% 50%; }
    }

    .admin-container::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg,
        rgba(102, 126, 234, 0.15) 0%,
        rgba(118, 75, 162, 0.15) 50%,
        rgba(255, 215, 0, 0.1) 100%);
      background-size: 400% 400%;
      animation: gradientShift 15s ease infinite;
      pointer-events: none;
      z-index: 1;
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* Sidebar Styles - Enhanced with Increased Width */
    .sidebar {
      width: 340px;
      background: linear-gradient(165deg,
        rgba(21, 101, 192, 0.98) 0%,
        rgba(13, 71, 161, 0.95) 50%,
        rgba(5, 40, 90, 0.98) 100%);
      backdrop-filter: blur(30px);
      color: white;
      box-shadow:
        8px 0 40px rgba(0, 0, 0, 0.4),
        inset -1px 0 0 rgba(255, 255, 255, 0.1);
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      z-index: 100;
      border-right: 2px solid rgba(255, 215, 0, 0.2);
      position: relative;
    }

    .sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg,
        rgba(255, 215, 0, 0.05) 0%,
        transparent 30%,
        transparent 70%,
        rgba(102, 126, 234, 0.1) 100%);
      pointer-events: none;
    }

    .sidebar-header {
      padding: 2.5rem 1.8rem;
      border-bottom: 2px solid rgba(255, 215, 0, 0.2);
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.08) 0%,
        rgba(255, 215, 0, 0.05) 100%);
      position: relative;
      overflow: hidden;
    }

    .sidebar-header::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
      animation: rotate 20s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.9rem;
      font-weight: 800;
      text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(255, 215, 0, 0.4);
      letter-spacing: 1px;
      position: relative;
      z-index: 1;
    }

    .sidebar-nav {
      padding: 2rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 1.2rem 1.8rem;
      color: rgba(255, 255, 255, 0.85);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-left: 4px solid transparent;
      margin: 0.5rem 0.8rem;
      border-radius: 0 12px 12px 0;
      font-weight: 600;
      font-size: 1.05rem;
      position: relative;
      overflow: hidden;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0;
      background: linear-gradient(90deg,
        rgba(255, 215, 0, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 100%);
      transition: width 0.4s ease;
      z-index: 0;
    }

    .nav-item:hover::before {
      width: 100%;
    }

    .nav-item:hover {
      background: linear-gradient(90deg,
        rgba(255, 215, 0, 0.2) 0%,
        rgba(255, 255, 255, 0.15) 100%);
      color: white;
      border-left-color: #FFD700;
      padding-left: 2.5rem;
      box-shadow:
        0 6px 20px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .nav-item.active {
      background: linear-gradient(90deg,
        rgba(255, 215, 0, 0.25) 0%,
        rgba(255, 255, 255, 0.2) 100%);
      color: white;
      border-left-color: #FFD700;
      box-shadow:
        0 6px 20px rgba(255, 215, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      position: relative;
    }

    .nav-item.active::after {
      content: '';
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background: #FFD700;
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
      animation: pulse 2s ease-in-out infinite;
    }

    .nav-item.logout {
      margin-top: 2.5rem;
      border-top: 2px solid rgba(255, 215, 0, 0.2);
      padding-top: 2.5rem;
      color: rgba(255, 107, 107, 0.9);
    }

    .nav-item.logout:hover {
      border-left-color: #ff6b6b;
      background: linear-gradient(90deg,
        rgba(255, 107, 107, 0.2) 0%,
        rgba(255, 255, 255, 0.1) 100%);
    }

    .nav-icon {
      margin-right: 1.2rem;
      font-size: 1.4rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      transition: transform 0.3s ease;
    }

    .nav-item:hover .nav-icon {
      transform: scale(1.15) rotate(-5deg);
    }

    /* Main Content Styles - Enhanced */
    .main-content {
      flex: 1;
      margin-left: 340px;
      position: relative;
      z-index: 10;
    }

    .content-header {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.95) 100%);
      backdrop-filter: blur(30px);
      padding: 2.5rem 3.5rem;
      box-shadow:
        0 10px 40px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid rgba(255, 215, 0, 0.2);
      position: relative;
      overflow: hidden;
    }

    .content-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(255, 215, 0, 0.03) 50%,
        transparent 100%);
      animation: shimmer 3s ease-in-out infinite;
    }

    @keyframes shimmer {
      0%, 100% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
    }

    .content-header h1 {
      margin: 0;
      font-size: 2.8rem;
      background: linear-gradient(135deg,
        #1565C0 0%,
        #0d47a1 50%,
        #FFD700 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 900;
      letter-spacing: -0.5px;
      text-shadow: 0 0 30px rgba(21, 101, 192, 0.2);
      animation: gradientText 4s ease infinite;
      position: relative;
      z-index: 1;
    }

    @keyframes gradientText {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .admin-badge {
      background: linear-gradient(135deg,
        #FFD700 0%,
        #FFA000 50%,
        #FF6F00 100%);
      color: white;
      padding: 0.8rem 2.2rem;
      border-radius: 30px;
      font-weight: 800;
      font-size: 1.1rem;
      letter-spacing: 3px;
      box-shadow:
        0 6px 20px rgba(255, 215, 0, 0.5),
        0 0 40px rgba(255, 215, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
      animation: badgePulse 2s ease-in-out infinite, badgeGlow 3s ease-in-out infinite;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .admin-badge::before {
      content: '';
      position: absolute;
      inset: -3px;
      background: linear-gradient(135deg, #FFD700, #FFA000, #FF6F00);
      border-radius: 30px;
      z-index: -1;
      opacity: 0;
      filter: blur(12px);
      animation: badgeGlowPulse 2s ease-in-out infinite;
    }

    @keyframes badgePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes badgeGlow {
      0%, 100% {
        box-shadow:
          0 6px 20px rgba(255, 215, 0, 0.5),
          0 0 40px rgba(255, 215, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.4);
      }
      50% {
        box-shadow:
          0 8px 30px rgba(255, 215, 0, 0.7),
          0 0 60px rgba(255, 215, 0, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.4);
      }
    }

    @keyframes badgeGlowPulse {
      0%, 100% { opacity: 0; }
      50% { opacity: 0.6; }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .content-body {
      padding: 3rem;
      animation: fadeIn 0.5s ease-in-out;
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

    /* Stats Grid - Enhanced */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
      gap: 2.5rem;
      margin-bottom: 3.5rem;
    }

    .stat-card {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.95) 100%);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2.5rem;
      display: flex;
      align-items: center;
      box-shadow:
        0 10px 40px rgba(0, 0, 0, 0.12),
        0 4px 15px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      border: 2px solid rgba(255, 215, 0, 0.15);
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle,
        rgba(255, 215, 0, 0.08) 0%,
        transparent 70%);
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .stat-card::after {
      content: '';
      position: absolute;
      inset: -3px;
      background: linear-gradient(135deg,
        rgba(255, 215, 0, 0.4),
        rgba(21, 101, 192, 0.4));
      border-radius: 26px;
      z-index: -1;
      opacity: 0;
      filter: blur(15px);
      transition: opacity 0.5s ease;
    }

    .stat-card:hover {
      transform: translateY(-12px) scale(1.03) rotateX(2deg);
      box-shadow:
        0 20px 60px rgba(21, 101, 192, 0.3),
        0 8px 25px rgba(0, 0, 0, 0.15),
        0 0 50px rgba(255, 215, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 1);
      border-color: rgba(255, 215, 0, 0.4);
    }

    .stat-card:hover::before {
      opacity: 1;
      animation: rotate 8s linear infinite;
    }

    .stat-card:hover::after {
      opacity: 1;
    }

    .stat-icon {
      font-size: 4rem;
      margin-right: 2rem;
      filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      z-index: 1;
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.2) rotate(-8deg);
      filter: drop-shadow(0 8px 20px rgba(255, 215, 0, 0.4));
    }

    .stat-info {
      position: relative;
      z-index: 1;
    }

    .stat-info h3 {
      margin: 0 0 0.8rem 0;
      color: #666;
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      transition: color 0.3s ease;
    }

    .stat-card:hover .stat-info h3 {
      color: #1565C0;
    }

    .stat-number {
      margin: 0;
      font-size: 2.8rem;
      font-weight: 900;
      background: linear-gradient(135deg, #1565C0 0%, #0d47a1 50%, #FFD700 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      background-size: 200% 200%;
      transition: all 0.3s ease;
    }

    .stat-card:hover .stat-number {
      animation: gradientText 2s ease infinite;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    }

    .stat-card:nth-child(1) {
      animation: fadeInUp 0.6s ease 0.1s backwards;
    }
    .stat-card:nth-child(2) {
      animation: fadeInUp 0.6s ease 0.2s backwards;
    }
    .stat-card:nth-child(3) {
      animation: fadeInUp 0.6s ease 0.3s backwards;
    }
    .stat-card:nth-child(4) {
      animation: fadeInUp 0.6s ease 0.4s backwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Admin Actions - Enhanced */
    .admin-actions {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.95) 100%);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow:
        0 12px 45px rgba(0, 0, 0, 0.12),
        0 5px 18px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border: 2px solid rgba(255, 215, 0, 0.15);
      position: relative;
      overflow: hidden;
    }

    .admin-actions::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg,
        rgba(255, 215, 0, 0.02) 0%,
        rgba(21, 101, 192, 0.02) 100%);
      pointer-events: none;
    }

    .admin-actions h2 {
      margin: 0 0 2.5rem 0;
      color: #1565C0;
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      position: relative;
      display: inline-block;
    }

    .admin-actions h2::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60%;
      height: 4px;
      background: linear-gradient(90deg,
        #FFD700 0%,
        #1565C0 100%);
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 2.5rem;
      border: none;
      border-radius: 16px;
      font-size: 1.15rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
      letter-spacing: 0.5px;
    }

    .action-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: width 0.6s ease, height 0.6s ease;
    }

    .action-btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .action-btn.primary {
      background: linear-gradient(135deg,
        #1565C0 0%,
        #0d47a1 50%,
        #FFD700 100%);
      background-size: 200% 200%;
      color: white;
      box-shadow:
        0 6px 20px rgba(21, 101, 192, 0.4),
        0 0 40px rgba(255, 215, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      animation: gradientSlide 3s ease infinite;
    }

    @keyframes gradientSlide {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .action-btn.primary:hover {
      transform: translateY(-6px) scale(1.05);
      box-shadow:
        0 15px 45px rgba(21, 101, 192, 0.5),
        0 0 60px rgba(255, 215, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .action-btn.primary:active {
      transform: translateY(-3px) scale(1.02);
    }

    .action-btn.secondary {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.9) 100%);
      backdrop-filter: blur(15px);
      color: #1565C0;
      border: 2px solid rgba(21, 101, 192, 0.3);
      box-shadow:
        0 5px 18px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    .action-btn.secondary:hover {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.98) 100%);
      border-color: rgba(255, 215, 0, 0.5);
      transform: translateY(-6px) scale(1.05);
      box-shadow:
        0 15px 40px rgba(21, 101, 192, 0.25),
        0 0 40px rgba(255, 215, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 1);
    }

    .action-btn.secondary:active {
      transform: translateY(-3px) scale(1.02);
    }

    .btn-icon {
      margin-right: 0.8rem;
      font-size: 1.4rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      transition: transform 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .action-btn:hover .btn-icon {
      transform: scale(1.2) rotate(-10deg);
    }

    /* Add Flight Section - Enhanced */
    .section-header {
      margin-bottom: 4rem;
      text-align: center;
      position: relative;
    }

    .section-header h2 {
      margin: 0 0 1rem 0;
      color: #1565C0;
      font-size: 2.7rem;
      font-weight: 900;
      background: linear-gradient(135deg,
        #1565C0 0%,
        #0d47a1 40%,
        #FFD700 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientText 4s ease infinite;
      letter-spacing: -0.5px;
    }

    .section-header p {
      margin: 0;
      color: #666;
      font-size: 1.2rem;
      font-weight: 500;
      opacity: 0.9;
    }

    .add-flight-card {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.95) 100%);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      padding: 5rem;
      box-shadow:
        0 15px 50px rgba(0, 0, 0, 0.12),
        0 6px 20px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border: 2px solid rgba(255, 215, 0, 0.2);
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .add-flight-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle,
        rgba(255, 215, 0, 0.05) 0%,
        transparent 70%);
      animation: rotate 15s linear infinite;
    }

    .feature-btn {
      width: 100%;
      max-width: 750px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 3rem;
      background: linear-gradient(135deg,
        #1565C0 0%,
        #0d47a1 50%,
        #FFD700 100%);
      background-size: 200% 200%;
      border: none;
      border-radius: 20px;
      color: white;
      cursor: pointer;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      margin: 0 auto;
      box-shadow:
        0 10px 40px rgba(21, 101, 192, 0.4),
        0 0 50px rgba(255, 215, 0, 0.2),
        inset 0 2px 0 rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      animation: gradientSlide 4s ease infinite;
    }

    .feature-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 150%;
      height: 100%;
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent);
      transition: left 0.7s ease;
    }

    .feature-btn::after {
      content: '';
      position: absolute;
      inset: -3px;
      background: linear-gradient(135deg,
        rgba(255, 215, 0, 0.5),
        rgba(21, 101, 192, 0.5));
      border-radius: 22px;
      z-index: -1;
      opacity: 0;
      filter: blur(20px);
      transition: opacity 0.5s ease;
    }

    .feature-btn:hover::before {
      left: 150%;
    }

    .feature-btn:hover::after {
      opacity: 1;
    }

    .feature-btn:hover {
      transform: translateY(-10px) scale(1.03);
      box-shadow:
        0 20px 60px rgba(21, 101, 192, 0.5),
        0 0 80px rgba(255, 215, 0, 0.4),
        inset 0 2px 0 rgba(255, 255, 255, 0.4);
    }

    .feature-btn:active {
      transform: translateY(-6px) scale(1.01);
    }

    .feature-icon {
      font-size: 4.5rem;
      margin-right: 2.5rem;
      filter: drop-shadow(0 6px 15px rgba(255, 255, 255, 0.4));
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      z-index: 1;
    }

    .feature-btn:hover .feature-icon {
      transform: scale(1.25) rotate(-10deg);
      filter: drop-shadow(0 8px 20px rgba(255, 255, 255, 0.6));
    }

    .feature-content {
      flex: 1;
      text-align: left;
      position: relative;
      z-index: 1;
    }

    .feature-content h3 {
      margin: 0 0 0.8rem 0;
      font-size: 2rem;
      font-weight: 800;
      text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(255, 255, 255, 0.2);
      letter-spacing: 0.5px;
    }

    .feature-content p {
      margin: 0;
      opacity: 0.95;
      font-size: 1.2rem;
      font-weight: 500;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .feature-arrow {
      font-size: 3rem;
      margin-left: 2.5rem;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
    }

    .feature-btn:hover .feature-arrow {
      transform: translateX(12px) scale(1.2);
      filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.4));
    }
  `]
})
export class AdminDashboardComponent {
  username: string = '';
  activeSection: string = 'overview';

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    const user = this.auth.currentUserValue;
    this.username = user?.username || 'Admin';
  }

  navigateToAddFlight() {
    this.router.navigate(['/add-flight']);
  }

  navigateToAdminFlights() {
    this.router.navigate(['/admin-flights']);
  }

  navigateToFlights() {
    this.router.navigate(['/flights']);
  }

  navigateToBookingHistory() {
    this.router.navigate(['/booking-history']);
  }

  logout() {
    this.auth.logout();
  }
}
