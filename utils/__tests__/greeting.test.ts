import {
  getCurrentTimePeriod,
  getTimeBasedGreeting,
  getTimeBasedGreetingWithEmoji,
} from '../greeting';

// Mock Date to control time for testing
const mockDate = (hours: number) => {
  const mockDate = new Date();
  mockDate.setHours(hours);
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
};

describe('Greeting Utils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getTimeBasedGreeting', () => {
    it('returns "Good morning" before 12 PM', () => {
      mockDate(8); // 8 AM
      expect(getTimeBasedGreeting()).toBe('Good morning');
    });

    it('returns "Good afternoon" between 12 PM and 5 PM', () => {
      mockDate(14); // 2 PM
      expect(getTimeBasedGreeting()).toBe('Good afternoon');
    });

    it('returns "Good evening" after 5 PM', () => {
      mockDate(20); // 8 PM
      expect(getTimeBasedGreeting()).toBe('Good evening');
    });

    it('returns "Good morning" at exactly 12 AM', () => {
      mockDate(0); // 12 AM
      expect(getTimeBasedGreeting()).toBe('Good morning');
    });

    it('returns "Good afternoon" at exactly 12 PM', () => {
      mockDate(12); // 12 PM
      expect(getTimeBasedGreeting()).toBe('Good afternoon');
    });

    it('returns "Good evening" at exactly 5 PM', () => {
      mockDate(17); // 5 PM
      expect(getTimeBasedGreeting()).toBe('Good evening');
    });
  });

  describe('getTimeBasedGreetingWithEmoji', () => {
    it('returns "Good morning 🌅" before 12 PM', () => {
      mockDate(9); // 9 AM
      expect(getTimeBasedGreetingWithEmoji()).toBe('Good morning 🌅');
    });

    it('returns "Good afternoon ☀️" between 12 PM and 5 PM', () => {
      mockDate(15); // 3 PM
      expect(getTimeBasedGreetingWithEmoji()).toBe('Good afternoon ☀️');
    });

    it('returns "Good evening 🌙" after 5 PM', () => {
      mockDate(22); // 10 PM
      expect(getTimeBasedGreetingWithEmoji()).toBe('Good evening 🌙');
    });
  });

  describe('getCurrentTimePeriod', () => {
    it('returns "morning" before 12 PM', () => {
      mockDate(7); // 7 AM
      expect(getCurrentTimePeriod()).toBe('morning');
    });

    it('returns "afternoon" between 12 PM and 5 PM', () => {
      mockDate(16); // 4 PM
      expect(getCurrentTimePeriod()).toBe('afternoon');
    });

    it('returns "evening" after 5 PM', () => {
      mockDate(19); // 7 PM
      expect(getCurrentTimePeriod()).toBe('evening');
    });
  });
});
