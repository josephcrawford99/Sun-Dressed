/**
 * Trip types for local persistence and basic trip management
 */

/**
 * Basic Trip interface for MVP trip creation
 * Used for simple trip creation with location and date range
 */
export interface Trip {
  id: string;
  location: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}