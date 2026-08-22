import { describe, it, expect } from 'vitest';
import { dataStore } from '../src/services/mockDataStore.js';

describe('Student Self-Service Lookup Service', () => {
  it('should lookup student by exact Roll Number / Student ID', () => {
    const result = dataStore.lookupStudent('BB-STU-101');
    expect(result).toBeDefined();
    expect(result?.student.studentId).toBe('BB-STU-101');
    expect(result?.student.studentName).toBe('Alexander Hayes');
    expect(result?.charges.length).toBeGreaterThan(0);
  });

  it('should lookup student by parent phone number (with formatting or plain digits)', () => {
    const result1 = dataStore.lookupStudent('+1-555-0102');
    expect(result1).toBeDefined();
    expect(result1?.student.studentName).toBe('Sophia Patel');

    const result2 = dataStore.lookupStudent('5550102');
    expect(result2).toBeDefined();
    expect(result2?.student.studentName).toBe('Sophia Patel');
  });

  it('should lookup student by parent email', () => {
    const result = dataStore.lookupStudent('david.vance@example.com');
    expect(result).toBeDefined();
    expect(result?.student.studentName).toBe('Lucas Vance');
  });

  it('should return null for non-existent queries', () => {
    const result = dataStore.lookupStudent('UNKNOWN-99999');
    expect(result).toBeNull();
  });
});
