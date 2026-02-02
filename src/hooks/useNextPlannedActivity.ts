/**
 * useNextPlannedActivity Hook
 * 
 * Fetches and manages the next upcoming activity for a trip
 */

import { useState, useEffect } from 'react'
import { getNextPlannedActivity, type ActivityWithDay } from '@/lib/activities'

export interface NextActivityState {
  activity: ActivityWithDay | null
  loading: boolean
  error: any
}

/**
 * Hook to fetch the next planned activity for a trip
 * @param tripId - The trip ID
 * @param tripStartDate - The trip start date
 * @returns State object with activity, loading, and error
 */
export function useNextPlannedActivity(
  tripId: string | undefined,
  tripStartDate: string | null | undefined
): NextActivityState {
  const [state, setState] = useState<NextActivityState>({
    activity: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!tripId || !tripStartDate) {
      setState({
        activity: null,
        loading: false,
        error: null,
      })
      return
    }

    let mounted = true

    async function fetchNextActivity() {
      setState(prev => ({ ...prev, loading: true }))

      try {
        const { data, error } = await getNextPlannedActivity(tripId!, tripStartDate!)

        if (mounted) {
          setState({
            activity: data,
            loading: false,
            error: error,
          })
        }
      } catch (err) {
        if (mounted) {
          setState({
            activity: null,
            loading: false,
            error: err,
          })
        }
      }
    }

    fetchNextActivity()

    // Refresh every minute to keep the "next" activity up to date
    const refreshInterval = setInterval(fetchNextActivity, 60 * 1000)

    return () => {
      mounted = false
      clearInterval(refreshInterval)
    }
  }, [tripId, tripStartDate])

  return state
}
