import React from 'react';
import { useLegacyMigration } from '@/hooks/useLegacyMigration';

interface LegacyMigrationProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that handles legacy settings migration
 * Should be placed inside AuthGuard so migration only runs for authenticated users
 */
export function LegacyMigrationProvider({ children }: LegacyMigrationProviderProps) {
  // Run migration hook
  useLegacyMigration();
  
  // Render children immediately - migration runs in background
  return <>{children}</>;
}