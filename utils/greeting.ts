/**
 * Utility functions for time-based greetings and other common operations
 */

/**
 * Returns a time-based greeting based on the current hour
 * @returns {string} The appropriate greeting for the current time
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Returns a time-based greeting with emoji based on the current hour
 * @returns {string} The appropriate greeting with emoji for the current time
 */
export function getTimeBasedGreetingWithEmoji(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning 🌅';
  } else if (hour < 17) {
    return 'Good afternoon ☀️';
  } else {
    return 'Good evening 🌙';
  }
}

/**
 * Returns the current time period
 * @returns {string} 'morning', 'afternoon', or 'evening'
 */
export function getCurrentTimePeriod(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'morning';
  } else if (hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}
