import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-admin-flights-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flights-container">
      <!-- Header Section -->
      <header class="page-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
          <div class="header-title">
            <div class="title-icon">✈️</div>
            <div>
              <h1>All Registered Flights</h1>
              <p class="subtitle">Comprehensive Flight Inventory Management</p>
            </div>
          </div>
          <div class="header-stats">
            <div class="stat-badge">
              <span class="badge-label">Total Flights</span>
              <span class="badge-value">{{ flights.length }}</span>
            </div>
            <div class="stat-badge active-badge">
              <span class="badge-label">Active</span>
              <span class="badge-value">{{ activeFlights }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div class="loading-overlay" *ngIf="loading">
        <div class="loading-background"></div>
        <div class="clouds-container">
          <div class="cloud cloud-1"></div>
          <div class="cloud cloud-2"></div>
          <div class="cloud cloud-3"></div>
          <div class="cloud cloud-4"></div>
        </div>
        <div class="loading-content">
          <div class="plane-animation">
            <svg class="animated-plane" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
            </svg>
            <div class="plane-trail"></div>
            <div class="plane-trail trail-2"></div>
            <div class="plane-trail trail-3"></div>
          </div>
          <div class="loading-text">
            <h2>Taking Off...</h2>
            <p>Fetching all registered flights from inventory</p>
            <div class="loading-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error && !loading">
        <div class="error-icon">⚠️</div>
        <h2>Error Loading Flights</h2>
        <p>{{ error }}</p>
        <button class="retry-btn" (click)="loadFlights()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Retry
        </button>
      </div>

      <!-- Flights Grid -->
      <div class="flights-grid" *ngIf="!loading && !error">
        <div class="no-flights" *ngIf="flights.length === 0">
          <div class="no-flights-icon">✈️</div>
          <h2>No Flights Found</h2>
          <p>There are no flights in the inventory yet.</p>
          <button class="add-flight-btn" (click)="navigateToAddFlight()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add First Flight
          </button>
        </div>

        <div class="flight-card" *ngFor="let flight of flights; let i = index" [style.animation-delay]="(i * 0.1) + 's'">
          <!-- Top Status Bar -->
          <div class="flight-status-bar" [class.active]="flight.status === 'ACTIVE'" [class.scheduled]="flight.status === 'SCHEDULED'" [class.cancelled]="flight.status === 'CANCELLED'">
            <span class="status-text">{{ flight.status }}</span>
          </div>

          <!-- Flight Header -->
          <div class="flight-header">
            <div class="airline-section">
              <div class="airline-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <div class="airline-info">
                <h3>{{ flight.airline }}</h3>
                <p class="flight-number">{{ flight.flightNumber }}</p>
              </div>
            </div>
            <div class="price-badge">
              <span class="currency">₹</span>
              <span class="amount">{{ flight.price | number:'1.0-0' }}</span>
            </div>
          </div>

          <!-- Flight Route -->
          <div class="flight-route">
            <div class="route-point">
              <div class="route-code">{{ flight.origin }}</div>
              <div class="route-time">{{ formatTime(flight.departureTime) }}</div>
              <div class="route-date">{{ formatDate(flight.departureTime) }}</div>
            </div>
            <div class="route-line">
              <div class="route-dot"></div>
              <div class="route-dash"></div>
              <div class="plane-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <div class="route-dash"></div>
              <div class="route-dot"></div>
            </div>
            <div class="route-point destination">
              <div class="route-code">{{ flight.destination }}</div>
              <div class="route-time">{{ formatTime(flight.arrivalTime) }}</div>
              <div class="route-date">{{ formatDate(flight.arrivalTime) }}</div>
            </div>
          </div>

          <!-- Flight Details -->
          <div class="flight-details">
            <div class="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <span>{{ flight.availableSeats }} Seats</span>
            </div>
            <div class="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ calculateDuration(flight.departureTime, flight.arrivalTime) }}</span>
            </div>
            <div class="detail-item" *ngIf="flight.createdAt">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Added {{ formatDate(flight.createdAt) }}</span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <span class="id-badge">ID: {{ flight.id }}</span>
            <button class="details-btn" (click)="viewFlightDetails(flight)">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flights-container {
      min-height: 100vh;
      background:
        linear-gradient(135deg, rgba(21, 101, 192, 0.3) 0%, rgba(13, 71, 161, 0.4) 50%, rgba(26, 35, 126, 0.45) 100%),
        url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1920&q=80') center/cover fixed;
      position: relative;
      padding-bottom: 4rem;
    }

    .flights-container::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.06) 0%, transparent 50%);
      animation: float 20s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(30px, -30px); }
    }

    /* Header Section */
    .page-header {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.96) 100%);
      backdrop-filter: blur(30px) saturate(180%);
      box-shadow:
        0 10px 40px rgba(0, 0, 0, 0.15),
        0 2px 8px rgba(0, 0, 0, 0.08),
        inset 0 -1px 0 rgba(255, 255, 255, 0.8);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 3px solid rgba(21, 101, 192, 0.15);
    }

    .header-content {
      max-width: 1600px;
      margin: 0 auto;
      padding: 2rem 3rem;
      display: flex;
      align-items: center;
      gap: 2.5rem;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.9rem 1.8rem;
      background: linear-gradient(135deg, #1565C0 0%, #1976D2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow:
        0 4px 12px rgba(21, 101, 192, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .back-btn:hover {
      transform: translateY(-2px);
      box-shadow:
        0 8px 20px rgba(21, 101, 192, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .header-title {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .title-icon {
      font-size: 3.5rem;
      filter: drop-shadow(0 4px 12px rgba(21, 101, 192, 0.3));
      animation: bounce 3s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .header-title h1 {
      margin: 0 0 0.4rem 0;
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #1565C0 0%, #0d47a1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }

    .subtitle {
      margin: 0;
      color: #546e7a;
      font-size: 1.05rem;
      font-weight: 600;
    }

    .header-stats {
      display: flex;
      gap: 1rem;
    }

    .stat-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 2rem;
      background: linear-gradient(135deg,
        rgba(21, 101, 192, 0.1) 0%,
        rgba(21, 101, 192, 0.05) 100%);
      border: 2px solid rgba(21, 101, 192, 0.2);
      border-radius: 16px;
      min-width: 120px;
    }

    .active-badge {
      background: linear-gradient(135deg,
        rgba(76, 175, 80, 0.1) 0%,
        rgba(76, 175, 80, 0.05) 100%);
      border-color: rgba(76, 175, 80, 0.3);
    }

    .badge-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin-bottom: 0.4rem;
    }

    .badge-value {
      font-size: 2rem;
      font-weight: 900;
      background: linear-gradient(135deg, #1565C0 0%, #0d47a1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .active-badge .badge-value {
      background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Loading Overlay - Enhanced */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      overflow: hidden;
      animation: fadeIn 0.5s ease;
    }

    .loading-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        linear-gradient(to bottom,
          #1e3c72 0%,
          #2a5298 25%,
          #7e8ba3 50%,
          #fcb69f 75%,
          #ff9a56 100%);
      animation: skyShift 15s ease-in-out infinite;
    }

    @keyframes skyShift {
      0%, 100% {
        background:
          linear-gradient(to bottom,
            #1e3c72 0%,
            #2a5298 25%,
            #7e8ba3 50%,
            #fcb69f 75%,
            #ff9a56 100%);
      }
      50% {
        background:
          linear-gradient(to bottom,
            #0f2027 0%,
            #203a43 25%,
            #2c5364 50%,
            #ff6b6b 75%,
            #feca57 100%);
      }
    }

    /* Clouds */
    .clouds-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 100px;
      opacity: 0.6;
    }

    .cloud::before,
    .cloud::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 100px;
    }

    .cloud-1 {
      width: 100px;
      height: 50px;
      top: 20%;
      left: -100px;
      animation: cloudFloat 20s linear infinite;
    }

    .cloud-1::before {
      width: 50px;
      height: 50px;
      top: -25px;
      left: 10px;
    }

    .cloud-1::after {
      width: 60px;
      height: 40px;
      top: -15px;
      right: 10px;
    }

    .cloud-2 {
      width: 120px;
      height: 60px;
      top: 40%;
      left: -150px;
      animation: cloudFloat 25s linear infinite;
      animation-delay: 5s;
    }

    .cloud-2::before {
      width: 60px;
      height: 60px;
      top: -30px;
      left: 15px;
    }

    .cloud-2::after {
      width: 70px;
      height: 50px;
      top: -20px;
      right: 15px;
    }

    .cloud-3 {
      width: 90px;
      height: 45px;
      top: 60%;
      left: -120px;
      animation: cloudFloat 18s linear infinite;
      animation-delay: 10s;
    }

    .cloud-3::before {
      width: 45px;
      height: 45px;
      top: -20px;
      left: 12px;
    }

    .cloud-3::after {
      width: 55px;
      height: 40px;
      top: -15px;
      right: 12px;
    }

    .cloud-4 {
      width: 110px;
      height: 55px;
      top: 80%;
      left: -130px;
      animation: cloudFloat 22s linear infinite;
      animation-delay: 2s;
    }

    .cloud-4::before {
      width: 55px;
      height: 55px;
      top: -27px;
      left: 13px;
    }

    .cloud-4::after {
      width: 65px;
      height: 45px;
      top: -18px;
      right: 13px;
    }

    @keyframes cloudFloat {
      0% {
        left: -150px;
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        left: 110%;
        opacity: 0;
      }
    }

    /* Loading Content */
    .loading-content {
      position: relative;
      z-index: 10;
      text-align: center;
      color: white;
    }

    /* Plane Animation */
    .plane-animation {
      position: relative;
      margin-bottom: 3rem;
      display: inline-block;
    }

    .animated-plane {
      filter: drop-shadow(0 8px 24px rgba(255, 215, 0, 0.8))
              drop-shadow(0 0 40px rgba(255, 255, 255, 0.6));
      animation: planeTakeoff 3s ease-in-out infinite;
    }

    @keyframes planeTakeoff {
      0% {
        transform: translate(-50px, 30px) rotate(-15deg) scale(0.8);
        opacity: 0.5;
      }
      25% {
        transform: translate(-10px, 0px) rotate(-5deg) scale(0.95);
        opacity: 1;
      }
      50% {
        transform: translate(20px, -10px) rotate(5deg) scale(1.1);
        opacity: 1;
      }
      75% {
        transform: translate(40px, -5px) rotate(10deg) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(60px, 20px) rotate(15deg) scale(0.8);
        opacity: 0.5;
      }
    }

    /* Plane Trails */
    .plane-trail {
      position: absolute;
      top: 50%;
      left: -100px;
      width: 0;
      height: 3px;
      background: linear-gradient(to right,
        transparent,
        rgba(255, 255, 255, 0.8),
        transparent);
      border-radius: 50%;
      animation: trail 3s ease-in-out infinite;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
    }

    .trail-2 {
      top: 55%;
      animation-delay: 0.2s;
      opacity: 0.7;
    }

    .trail-3 {
      top: 60%;
      animation-delay: 0.4s;
      opacity: 0.5;
    }

    @keyframes trail {
      0% {
        width: 0;
        opacity: 0;
      }
      50% {
        width: 150px;
        opacity: 1;
      }
      100% {
        width: 0;
        opacity: 0;
      }
    }

    /* Loading Text */
    .loading-text h2 {
      margin: 0 0 1rem 0;
      font-size: 3rem;
      font-weight: 900;
      text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(255, 215, 0, 0.8),
        0 0 60px rgba(255, 255, 255, 0.4);
      letter-spacing: 2px;
      animation: textGlow 2s ease-in-out infinite;
    }

    @keyframes textGlow {
      0%, 100% {
        text-shadow:
          0 2px 10px rgba(0, 0, 0, 0.3),
          0 0 30px rgba(255, 215, 0, 0.8),
          0 0 60px rgba(255, 255, 255, 0.4);
      }
      50% {
        text-shadow:
          0 2px 10px rgba(0, 0, 0, 0.3),
          0 0 40px rgba(255, 215, 0, 1),
          0 0 80px rgba(255, 255, 255, 0.6);
      }
    }

    .loading-text p {
      margin: 0 0 2rem 0;
      font-size: 1.3rem;
      opacity: 0.95;
      font-weight: 600;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    /* Loading Dots */
    .loading-dots {
      display: flex;
      justify-content: center;
      gap: 12px;
    }

    .dot {
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
      animation: dotBounce 1.4s ease-in-out infinite;
    }

    .dot:nth-child(1) {
      animation-delay: 0s;
    }

    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes dotBounce {
      0%, 60%, 100% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      30% {
        transform: translateY(-20px) scale(1.2);
        opacity: 0.8;
      }
    }

    /* Error Container */
    .error-container {
      max-width: 600px;
      margin: 8rem auto;
      padding: 4rem;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      text-align: center;
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border: 2px solid rgba(239, 83, 80, 0.2);
    }

    .error-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 4px 12px rgba(239, 83, 80, 0.3));
    }

    .error-container h2 {
      margin: 0 0 1rem 0;
      color: #ef5350;
      font-size: 2rem;
      font-weight: 900;
    }

    .error-container p {
      margin: 0 0 2rem 0;
      color: #666;
      font-size: 1.1rem;
    }

    .retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 1rem 2.5rem;
      background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(239, 83, 80, 0.4);
    }

    .retry-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(239, 83, 80, 0.5);
    }

    /* Flights Grid */
    .flights-grid {
      max-width: 1600px;
      margin: 0 auto;
      padding: 3rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
      gap: 2rem;
    }

    /* No Flights State */
    .no-flights {
      grid-column: 1 / -1;
      text-align: center;
      padding: 6rem 3rem;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 28px;
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border: 2px solid rgba(21, 101, 192, 0.1);
    }

    .no-flights-icon {
      font-size: 6rem;
      margin-bottom: 2rem;
      opacity: 0.3;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
    }

    .no-flights h2 {
      margin: 0 0 1rem 0;
      font-size: 2.5rem;
      font-weight: 900;
      color: #263238;
    }

    .no-flights p {
      margin: 0 0 2.5rem 0;
      font-size: 1.2rem;
      color: #666;
    }

    .add-flight-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1.2rem 3rem;
      background: linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #FFD700 100%);
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow:
        0 8px 24px rgba(21, 101, 192, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .add-flight-btn:hover {
      transform: translateY(-4px);
      box-shadow:
        0 12px 32px rgba(21, 101, 192, 0.5),
        0 0 40px rgba(255, 215, 0, 0.3);
    }

    /* Flight Card */
    .flight-card {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.96) 100%);
      backdrop-filter: blur(30px) saturate(180%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow:
        0 15px 50px rgba(0, 0, 0, 0.15),
        0 6px 20px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border: 2px solid rgba(255, 255, 255, 0.4);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation: fadeInUp 0.6s ease backwards;
      position: relative;
    }

    .flight-card::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg,
        rgba(255, 215, 0, 0.2),
        rgba(21, 101, 192, 0.2));
      border-radius: 26px;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.4s ease;
      filter: blur(15px);
    }

    .flight-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow:
        0 25px 70px rgba(0, 0, 0, 0.2),
        0 10px 30px rgba(0, 0, 0, 0.12),
        0 0 60px rgba(255, 215, 0, 0.2);
    }

    .flight-card:hover::before {
      opacity: 1;
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

    /* Status Bar */
    .flight-status-bar {
      height: 6px;
      background: linear-gradient(90deg, #90a4ae 0%, #607d8b 100%);
      position: relative;
    }

    .flight-status-bar::after {
      content: attr(data-status);
      position: absolute;
      top: 100%;
      right: 1.5rem;
      margin-top: 0.8rem;
      padding: 0.4rem 1rem;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .flight-status-bar.active {
      background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
    }

    .flight-status-bar.scheduled {
      background: linear-gradient(90deg, #2196F3 0%, #42A5F5 100%);
    }

    .flight-status-bar.cancelled {
      background: linear-gradient(90deg, #f44336 0%, #ef5350 100%);
    }

    .status-text {
      position: absolute;
      top: 100%;
      right: 1.5rem;
      margin-top: 0.8rem;
      padding: 0.4rem 1rem;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .flight-status-bar.active .status-text {
      color: #4CAF50;
    }

    .flight-status-bar.scheduled .status-text {
      color: #2196F3;
    }

    .flight-status-bar.cancelled .status-text {
      color: #f44336;
    }

    /* Flight Header */
    .flight-header {
      padding: 2rem 2rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid rgba(207, 216, 220, 0.3);
    }

    .airline-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .airline-logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #1565C0 0%, #2196F3 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow:
        0 8px 20px rgba(21, 101, 192, 0.4),
        inset 0 -2px 6px rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(255, 215, 0, 0.5);
    }

    .airline-info h3 {
      margin: 0 0 0.3rem 0;
      font-size: 1.4rem;
      font-weight: 800;
      color: #263238;
    }

    .flight-number {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: #1565C0;
      letter-spacing: 0.5px;
    }

    .price-badge {
      display: flex;
      align-items: baseline;
      gap: 0.3rem;
    }

    .currency {
      font-size: 1.3rem;
      font-weight: 700;
      color: #263238;
    }

    .amount {
      font-size: 2.2rem;
      font-weight: 900;
      background: linear-gradient(135deg, #1565C0 0%, #FFD700 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Flight Route */
    .flight-route {
      padding: 2rem;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 1.5rem;
      align-items: center;
    }

    .route-point {
      text-align: left;
    }

    .route-point.destination {
      text-align: right;
    }

    .route-code {
      font-size: 2rem;
      font-weight: 900;
      color: #1565C0;
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
    }

    .route-time {
      font-size: 1.1rem;
      font-weight: 700;
      color: #263238;
      margin-bottom: 0.2rem;
    }

    .route-date {
      font-size: 0.85rem;
      color: #666;
      font-weight: 600;
    }

    .route-line {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1rem;
    }

    .route-dot {
      width: 10px;
      height: 10px;
      background: linear-gradient(135deg, #1565C0 0%, #2196F3 100%);
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(21, 101, 192, 0.4);
    }

    .route-dash {
      flex: 1;
      height: 3px;
      background: linear-gradient(90deg,
        #cfd8dc 0%,
        #90a4ae 50%,
        #cfd8dc 100%);
      border-radius: 2px;
    }

    .plane-icon {
      color: #FFD700;
      filter: drop-shadow(0 2px 6px rgba(255, 215, 0, 0.5));
      animation: wiggle 2s ease-in-out infinite;
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }

    /* Flight Details */
    .flight-details {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      border-top: 2px solid rgba(207, 216, 220, 0.3);
      background: linear-gradient(135deg,
        rgba(21, 101, 192, 0.02) 0%,
        rgba(21, 101, 192, 0.05) 100%);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #546e7a;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .detail-item svg {
      color: #1565C0;
    }

    /* Card Footer */
    .card-footer {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid rgba(207, 216, 220, 0.3);
    }

    .id-badge {
      font-size: 0.85rem;
      font-weight: 700;
      color: #999;
      letter-spacing: 0.5px;
    }

    .details-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.5rem;
      background: linear-gradient(135deg, #1565C0 0%, #1976D2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(21, 101, 192, 0.3);
    }

    .details-btn:hover {
      transform: translateX(4px);
      box-shadow: 0 6px 16px rgba(21, 101, 192, 0.4);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .flights-grid {
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }

      .header-title {
        flex-direction: column;
        text-align: center;
      }

      .header-title h1 {
        font-size: 2rem;
      }

      .header-stats {
        justify-content: center;
      }

      .flights-grid {
        grid-template-columns: 1fr;
        padding: 2rem 1.5rem;
      }

      .flight-route {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .route-point.destination {
        text-align: left;
      }

      .route-line {
        order: 3;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class AdminFlightsListComponent implements OnInit {
  flights: Flight[] = [];
  loading = true;
  error: string | null = null;
  activeFlights = 0;

  constructor(
    private flightService: FlightService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.loading = true;
    this.error = null;

    this.flightService.getAllFlights().subscribe({
      next: (flights) => {
        console.log('Flights loaded successfully:', flights);
        this.flights = flights;
        this.activeFlights = flights.filter(f => f.status === 'ACTIVE').length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading flights:', err);
        let errorMessage = 'Failed to load flights. ';

        if (err.status === 0) {
          errorMessage += 'Unable to connect to the server. Please ensure the backend is running on http://localhost:8080';
        } else if (err.status === 404) {
          errorMessage += 'API endpoint not found. The backend may not have the /api/flights/inventory endpoint.';
        } else if (err.status === 401 || err.status === 403) {
          errorMessage += 'Authentication error. Please log in again.';
        } else {
          errorMessage += `Server error: ${err.message || 'Unknown error'}`;
        }

        this.error = errorMessage;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }

  navigateToAddFlight() {
    this.router.navigate(['/add-flight']);
  }

  viewFlightDetails(flight: Flight) {
    console.log('View flight details:', flight);
    // You can implement a modal or navigate to a details page here
  }

  formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  calculateDuration(departureTime: string, arrivalTime: string): string {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const diffMs = arrival.getTime() - departure.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}m`;
  }
}
