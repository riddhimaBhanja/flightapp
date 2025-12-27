/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '.angular'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],

      // Exclude these from coverage
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        'dist/',
        '.angular/',
        'src/main.ts',
        'src/index.html'
      ],

      // Coverage thresholds (tests will fail if below these)
      lines: 70,        // Minimum 70% line coverage
      functions: 70,    // Minimum 70% function coverage
      branches: 60,     // Minimum 60% branch coverage
      statements: 70,   // Minimum 70% statement coverage

      // Output directory
      reportsDirectory: './coverage',

      // Enable all coverage
      all: true,

      // Include source files
      include: ['src/app/**/*.ts']
    }
  }
});
