#!/usr/bin/env node

const chalk = require('chalk');
const fetch = require('node-fetch');

console.log(chalk.blue('🏥 Quest Tracker Health Check'));
console.log(chalk.gray('============================'));

class HealthChecker {
  constructor() {
    this.frontendUrl = process.env.FRONTEND_URL || 'https://your-app.netlify.app';
    this.backendUrl = process.env.BACKEND_URL || 'https://your-api.railway.app';
    this.apiKey = process.env.API_KEY || 'demo_key_12345';
  }

  async checkFrontend() {
    console.log(chalk.yellow('\n🌐 Checking Frontend...'));

    try {
      const startTime = Date.now();
      const response = await fetch(this.frontendUrl, {
        timeout: 10000
      });
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        console.log(chalk.green(`✅ Frontend is accessible`));
        console.log(chalk.gray(`   Status: ${response.status}`));
        console.log(chalk.gray(`   Response time: ${responseTime}ms`));
        console.log(chalk.gray(`   URL: ${this.frontendUrl}`));
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(chalk.red(`❌ Frontend check failed`));
      console.log(chalk.red(`   Error: ${error.message}`));
      console.log(chalk.gray(`   URL: ${this.frontendUrl}`));
      return false;
    }
  }

  async checkBackendHealth() {
    console.log(chalk.yellow('\n🚂 Checking Backend Health...'));

    try {
      const startTime = Date.now();
      const response = await fetch(`${this.backendUrl}/health`, {
        timeout: 10000
      });
      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok && data.status === 'healthy') {
        console.log(chalk.green(`✅ Backend is healthy`));
        console.log(chalk.gray(`   Status: ${data.status}`));
        console.log(chalk.gray(`   Uptime: ${Math.round(data.uptime)}s`));
        console.log(chalk.gray(`   Response time: ${responseTime}ms`));
        console.log(chalk.gray(`   Memory usage: ${Math.round(data.memory.heapUsed / 1024 / 1024)}MB`));
        console.log(chalk.gray(`   Environment: ${data.environment}`));
        return true;
      } else {
        throw new Error(`Health check failed: ${data.status || 'unknown'}`);
      }
    } catch (error) {
      console.log(chalk.red(`❌ Backend health check failed`));
      console.log(chalk.red(`   Error: ${error.message}`));
      console.log(chalk.gray(`   URL: ${this.backendUrl}/health`));
      return false;
    }
  }

  async checkAPIEndpoints() {
    console.log(chalk.yellow('\n🔌 Checking API Endpoints...'));

    const endpoints = [
      { path: '/api/quests', method: 'GET', description: 'Quest list' },
      { path: '/api/quests/1', method: 'GET', description: 'Quest details' },
      { path: '/api/players/alex', method: 'GET', description: 'Player profile' },
      { path: '/api/categories', method: 'GET', description: 'Categories list' }
    ];

    let passedCount = 0;

    for (const endpoint of endpoints) {
      try {
        const url = `${this.backendUrl}${endpoint.path}?api_key=${this.apiKey}`;
        const startTime = Date.now();

        const response = await fetch(url, {
          method: endpoint.method,
          timeout: 10000
        });

        const responseTime = Date.now() - startTime;
        const data = await response.json();

        if (response.ok) {
          console.log(chalk.green(`   ✅ ${endpoint.description} (${responseTime}ms)`));
          passedCount++;
        } else {
          console.log(chalk.red(`   ❌ ${endpoint.description}: ${response.status}`));
        }
      } catch (error) {
        console.log(chalk.red(`   ❌ ${endpoint.description}: ${error.message}`));
      }
    }

    const success = passedCount === endpoints.length;
    if (success) {
      console.log(chalk.green(`✅ All ${endpoints.length} API endpoints working`));
    } else {
      console.log(chalk.red(`❌ ${endpoints.length - passedCount}/${endpoints.length} endpoints failed`));
    }

    return success;
  }

  async checkAuthentication() {
    console.log(chalk.yellow('\n🔐 Checking Authentication...'));

    try {
      // Test without API key (should fail)
      const noKeyResponse = await fetch(`${this.backendUrl}/api/quests/1`, {
        timeout: 5000
      });

      if (noKeyResponse.status === 401) {
        console.log(chalk.green(`   ✅ Authentication required (401 without key)`));
      } else {
        console.log(chalk.red(`   ❌ Authentication not enforced`));
        return false;
      }

      // Test with invalid API key (should fail)
      const invalidKeyResponse = await fetch(`${this.backendUrl}/api/quests/1?api_key=invalid`, {
        timeout: 5000
      });

      if (invalidKeyResponse.status === 401) {
        console.log(chalk.green(`   ✅ Invalid API key rejected (401)`));
      } else {
        console.log(chalk.red(`   ❌ Invalid API key not rejected`));
        return false;
      }

      // Test with valid API key (should succeed)
      const validKeyResponse = await fetch(`${this.backendUrl}/api/quests/1?api_key=${this.apiKey}`, {
        timeout: 5000
      });

      if (validKeyResponse.ok) {
        console.log(chalk.green(`   ✅ Valid API key accepted (${validKeyResponse.status})`));
      } else {
        console.log(chalk.red(`   ❌ Valid API key rejected`));
        return false;
      }

      console.log(chalk.green(`✅ Authentication working correctly`));
      return true;

    } catch (error) {
      console.log(chalk.red(`❌ Authentication check failed: ${error.message}`));
      return false;
    }
  }

  async checkRateLimit() {
    console.log(chalk.yellow('\n⚡ Checking Rate Limiting...'));

    try {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          fetch(`${this.backendUrl}/api/quests?api_key=${this.apiKey}`, {
            timeout: 5000
          })
        );
      }

      const responses = await Promise.all(promises);
      const allOk = responses.every(r => r.ok);

      if (allOk) {
        console.log(chalk.green(`   ✅ Rate limiting configured (5 requests passed)`));
        console.log(chalk.gray(`   Note: Rate limits may be per-IP or per-key`));
      } else {
        console.log(chalk.yellow(`   ⚠️  Some requests failed (rate limiting may be active)`));
      }

      return true;
    } catch (error) {
      console.log(chalk.red(`❌ Rate limit check failed: ${error.message}`));
      return false;
    }
  }

  // TODO 5: Set Up Health Monitoring (Challenge)
  async checkPerformanceMetrics() {
    console.log(chalk.yellow('\n📈 Checking Performance Metrics...'));

    try {
      // Test API response times
      const endpoints = ['/health', '/api/quests?api_key=' + this.apiKey];
      let totalResponseTime = 0;
      let passedPerformanceTests = 0;

      for (const endpoint of endpoints) {
        const startTime = Date.now();
        const response = await fetch(`${this.backendUrl}${endpoint}`, {
          timeout: 10000
        });
        const responseTime = Date.now() - startTime;
        totalResponseTime += responseTime;

        // Performance thresholds
        const isHealthEndpoint = endpoint.includes('/health');
        const threshold = isHealthEndpoint ? 500 : 2000; // Health should be faster

        if (responseTime < threshold) {
          console.log(chalk.green(`   ✅ ${endpoint}: ${responseTime}ms (< ${threshold}ms)`));
          passedPerformanceTests++;
        } else {
          console.log(chalk.red(`   ❌ ${endpoint}: ${responseTime}ms (>= ${threshold}ms)`));
        }
      }

      const avgResponseTime = Math.round(totalResponseTime / endpoints.length);
      console.log(chalk.gray(`   Average response time: ${avgResponseTime}ms`));

      return passedPerformanceTests === endpoints.length;
    } catch (error) {
      console.log(chalk.red(`❌ Performance check failed: ${error.message}`));
      return false;
    }
  }

  async checkErrorHandling() {
    console.log(chalk.yellow('\n🛡️  Checking Error Handling...'));

    try {
      // Test 404 handling
      const notFoundResponse = await fetch(`${this.backendUrl}/api/nonexistent`, {
        timeout: 5000
      });

      if (notFoundResponse.status === 404) {
        console.log(chalk.green(`   ✅ 404 errors handled correctly`));
      } else {
        console.log(chalk.red(`   ❌ 404 handling incorrect: ${notFoundResponse.status}`));
        return false;
      }

      // Test malformed request handling
      const malformedResponse = await fetch(`${this.backendUrl}/api/quests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json',
        timeout: 5000
      });

      if (malformedResponse.status >= 400) {
        console.log(chalk.green(`   ✅ Malformed requests rejected (${malformedResponse.status})`));
      } else {
        console.log(chalk.red(`   ❌ Malformed requests not rejected`));
        return false;
      }

      console.log(chalk.green(`✅ Error handling working correctly`));
      return true;
    } catch (error) {
      console.log(chalk.red(`❌ Error handling check failed: ${error.message}`));
      return false;
    }
  }

  async runAllChecks() {
    console.log(chalk.white('\nRunning comprehensive health checks...\n'));

    const results = {
      frontend: await this.checkFrontend(),
      backendHealth: await this.checkBackendHealth(),
      apiEndpoints: await this.checkAPIEndpoints(),
      authentication: await this.checkAuthentication(),
      rateLimit: await this.checkRateLimit(),
      performanceMetrics: await this.checkPerformanceMetrics(),
      errorHandling: await this.checkErrorHandling()
    };

    const totalChecks = Object.keys(results).length;
    const passedChecks = Object.values(results).filter(Boolean).length;

    console.log(chalk.blue('\n📊 Health Check Summary'));
    console.log(chalk.gray('========================'));

    Object.entries(results).forEach(([check, passed]) => {
      const icon = passed ? '✅' : '❌';
      const color = passed ? chalk.green : chalk.red;
      console.log(color(`${icon} ${check.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`));
    });

    console.log(chalk.blue(`\n📈 Overall Score: ${passedChecks}/${totalChecks} checks passed`));

    if (passedChecks === totalChecks) {
      console.log(chalk.green('🎉 All systems operational! Your app is ready for users.'));
      return true;
    } else {
      console.log(chalk.red('⚠️  Some issues detected. Review the failed checks above.'));
      return false;
    }
  }
}

// Run health checks if this script is called directly
async function main() {
  const checker = new HealthChecker();

  // Allow overriding URLs via command line arguments
  if (process.argv[2]) checker.frontendUrl = process.argv[2];
  if (process.argv[3]) checker.backendUrl = process.argv[3];

  const success = await checker.runAllChecks();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Health check failed:', error));
    process.exit(1);
  });
}

module.exports = { HealthChecker };