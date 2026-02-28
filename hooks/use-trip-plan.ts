import { generateTripPlan } from '@/services/gemini-service';
import { getTripById, useStore } from '@/store/store';
import { TripPlan } from '@/types/trip';
import { buildTripPrompt } from '@/utils/trip-prompt-generator';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

/**
 * Hook to generate and cache a trip's packing plan.
 *
 * Uses useQuery so generation is unified for both create and edit flows:
 * - Create: trip saved with plan: null → navigate to detail → query fires → generates plan
 * - Edit: updateTrip clears plan → invalidate query → refires → regenerates
 *
 * @param tripId - ID of the trip to generate a plan for
 * @returns TanStack Query result with plan data, loading state, and error
 */
export function useTripPlan(tripId: string | undefined): UseQueryResult<TripPlan, Error> {
  const updateTrip = useStore((state) => state.updateTrip);

  return useQuery<TripPlan, Error>({
    queryKey: ['trip-plan', tripId],
    queryFn: async () => {
      const trip = getTripById(tripId!);
      if (!trip) {
        throw new Error('Trip not found');
      }

      // If plan already exists, return it
      if (trip.plan) {
        return trip.plan;
      }

      // Generate new plan via Gemini
      const prompt = buildTripPrompt(trip);
      const plan = await generateTripPlan(prompt);

      // Persist plan to store
      updateTrip(trip.id, {
        plan,
        planGeneratedAt: new Date(),
      });

      return plan;
    },
    enabled: !!tripId,
    staleTime: Infinity, // Plan doesn't go stale — only invalidation triggers regeneration
    retry: 2,
  });
}
