/**
 * Activity Data Service
 * 
 * This module provides functions to interact with activities in Supabase.
 * It handles fetching activities for trips and finding upcoming activities.
 */

import { supabase } from './supabase'
import type { Activity } from '@/types/database'

export type ActivityWithDay = Activity & {
  day_number?: number
  trip_id?: string
}

/**
 * Fetch all activities for a trip
 */
export async function getTripActivities(tripId: string): Promise<{ data: ActivityWithDay[]; error: any }> {
  if (!tripId) {
    return { data: [], error: null }
  }

  // First fetch all itinerary days for the trip
  const { data: days, error: daysError } = await supabase
    .from('itinerary_days')
    .select('id, day_number, trip_id')
    .eq('trip_id', tripId)
    .order('day_number', { ascending: true }) as {
      data: Array<{ id: string; day_number: number; trip_id: string }> | null
      error: any
    }

  if (daysError) {
    console.error('Error fetching itinerary days:', daysError)
    return { data: [], error: daysError }
  }

  if (!days || days.length === 0) {
    return { data: [], error: null }
  }

  // Fetch all activities for these days
  const dayIds = days.map(d => d.id)
  const { data: activities, error: activitiesError } = await supabase
    .from('activities')
    .select('*')
    .in('day_id', dayIds)
    .order('time', { ascending: true }) as {
      data: Activity[] | null
      error: any
    }

  if (activitiesError) {
    console.error('Error fetching activities:', activitiesError)
    return { data: [], error: activitiesError }
  }

  // Enrich activities with day number and trip_id
  const enrichedActivities: ActivityWithDay[] = (activities || []).map(activity => {
    const day = days.find(d => d.id === activity.day_id)
    return {
      ...activity,
      day_number: day?.day_number,
      trip_id: day?.trip_id,
    }
  })

  return { data: enrichedActivities, error: null }
}

/**
 * Find the next upcoming activity for a trip
 * Returns the activity with the soonest time that is still in the future
 */
export async function getNextPlannedActivity(
  tripId: string,
  tripStartDate: string | null
): Promise<{ data: ActivityWithDay | null; error: any }> {
  const { data: activities, error } = await getTripActivities(tripId)

  if (error || !activities || activities.length === 0) {
    return { data: null, error }
  }

  if (!tripStartDate) {
    return { data: null, error: null }
  }

  const now = new Date()
  const tripStart = new Date(tripStartDate)

  // Filter activities that have a valid time
  const activitiesWithTime = activities.filter(a => a.time)

  // Find the next upcoming activity
  let nextActivity: ActivityWithDay | null = null
  let minDiff = Infinity

  for (const activity of activitiesWithTime) {
    // Parse the activity time
    // Time format can be "HH:MM" or "HH:MM AM/PM"
    const activityDateTime = parseActivityDateTime(activity.time!, activity.day_number || 1, tripStartDate)
    
    if (!activityDateTime) continue

    // Only consider activities that are in the future
    if (activityDateTime > now) {
      const diff = activityDateTime.getTime() - now.getTime()
      if (diff < minDiff) {
        minDiff = diff
        nextActivity = activity
      }
    }
  }

  return { data: nextActivity, error: null }
}

/**
 * Parse activity date and time into a full DateTime object
 * @param time - Time string like "09:00" or "9:00 AM"
 * @param dayNumber - Day number in the trip (1-indexed)
 * @param tripStartDate - Trip start date string
 */
function parseActivityDateTime(time: string, dayNumber: number, tripStartDate: string): Date | null {
  try {
    const tripStart = new Date(tripStartDate)
    
    // Calculate the date for this day number
    const activityDate = new Date(tripStart)
    activityDate.setDate(activityDate.getDate() + (dayNumber - 1))

    // Parse the time string
    let hours = 0
    let minutes = 0

    // Handle "HH:MM AM/PM" format
    const timeWithPeriod = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (timeWithPeriod) {
      hours = parseInt(timeWithPeriod[1], 10)
      minutes = parseInt(timeWithPeriod[2], 10)
      
      if (timeWithPeriod[3]) {
        const period = timeWithPeriod[3].toUpperCase()
        if (period === 'PM' && hours !== 12) {
          hours += 12
        } else if (period === 'AM' && hours === 12) {
          hours = 0
        }
      }
    }

    activityDate.setHours(hours, minutes, 0, 0)
    return activityDate
  } catch (err) {
    console.error('Error parsing activity date/time:', err)
    return null
  }
}

/**
 * Get the count of activities for a trip
 */
export async function getTripActivityCount(tripId: string): Promise<number> {
  const { data, error } = await getTripActivities(tripId)
  
  if (error || !data) {
    return 0
  }

  return data.length
}
