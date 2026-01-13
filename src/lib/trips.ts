/**
 * Trip Data Service
 * 
 * This module provides functions to interact with the trips table in Supabase.
 * It handles fetching trips, calculating trip statistics, and managing trip data.
 */

import { supabase } from './supabase'
import type { Trip } from '@/types/database'

export type TripWithMemberCount = Trip & {
  member_count: number
}

/**
 * Calculate the number of days in a trip
 */
export function getTripDuration(startDate: string | null, endDate: string | null): number {
  if (!startDate || !endDate) return 0
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays + 1 // Include both start and end days
}

/**
 * Fetch all trips for the authenticated user (as organizer or member)
 */
export async function getUserTrips(userId: string | undefined): Promise<{ data: Trip[]; error: any }> {
  if (!userId) {
    return { data: [], error: null }
  }

  // Fetch trips where user is organizer
  const { data: organizerTrips, error: orgError } = await supabase
    .from('trips')
    .select('*')
    .eq('organizer_id', userId)
    .order('created_at', { ascending: false })

  if (orgError) {
    console.error('Error fetching organizer trips:', orgError)
    return { data: [], error: orgError }
  }

  // Fetch trips where user is a member
  const { data: memberTrips, error: memberError } = await supabase
    .from('trip_members')
    .select('trip_id')
    .eq('user_id', userId) as { data: { trip_id: string | null }[] | null, error: any }

  if (memberError) {
    console.error('Error fetching member trips:', memberError)
    return { data: organizerTrips || [], error: null }
  }

  // Get full trip details for member trips
  const memberTripIds = (memberTrips || [])
    .map(m => m.trip_id)
    .filter((id): id is string => id !== null)
  
  if (memberTripIds.length === 0) {
    return { data: organizerTrips || [], error: null }
  }

  const { data: memberTripDetails, error: detailsError } = await supabase
    .from('trips')
    .select('*')
    .in('id', memberTripIds)
    .order('created_at', { ascending: false })

  if (detailsError) {
    console.error('Error fetching member trip details:', detailsError)
    return { data: organizerTrips || [], error: null }
  }

  // Combine and deduplicate trips
  const allTrips: Trip[] = [...(organizerTrips || []), ...(memberTripDetails || [])]
  const uniqueTrips = Array.from(
    new Map(allTrips.map(trip => [trip.id, trip])).values()
  )

  return { data: uniqueTrips, error: null }
}

/**
 * Fetch trips by status for the authenticated user
 */
export async function getUserTripsByStatus(
  userId: string | undefined,
  status: 'planning' | 'active' | 'completed'
) {
  const { data, error } = await getUserTrips(userId)
  
  if (error || !data) {
    return { data: [], error }
  }

  const filtered = data.filter(trip => trip.status === status)
  return { data: filtered, error: null }
}

/**
 * Fetch public trips for the explore page
 */
export async function getPublicTrips(): Promise<{ data: Trip[]; error: any }> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching public trips:', error)
    return { data: [], error }
  }

  return { data: data || [], error: null }
}

/**
 * Fetch a single trip by ID
 */
export async function getTripById(tripId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  if (error) {
    console.error('Error fetching trip:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get the count of trip members for a trip
 */
export async function getTripMemberCount(tripId: string): Promise<number> {
  const { count, error } = await supabase
    .from('trip_members')
    .select('*', { count: 'exact', head: true })
    .eq('trip_id', tripId)

  if (error) {
    console.error('Error fetching trip member count:', error)
    return 0
  }

  // Add 1 for the organizer (who may not be in trip_members)
  return (count || 0) + 1
}

/**
 * Get trips with member counts
 */
export async function getUserTripsWithMemberCounts(
  userId: string | undefined
): Promise<TripWithMemberCount[]> {
  const { data: trips, error } = await getUserTrips(userId)
  
  if (error || !trips) {
    return []
  }

  // Fetch member counts for all trips
  const tripsWithCounts = await Promise.all(
    trips.map(async (trip) => {
      const memberCount = await getTripMemberCount(trip.id)
      return {
        ...trip,
        member_count: memberCount,
      }
    })
  )

  return tripsWithCounts
}

/**
 * Get trip statistics for the dashboard
 */
export async function getTripStats(userId: string | undefined) {
  const { data: trips } = await getUserTrips(userId)
  
  if (!trips || trips.length === 0) {
    return {
      totalTrips: 0,
      planningTrips: 0,
      activeTrips: 0,
      completedTrips: 0,
      totalBudget: 0,
    }
  }

  const stats = {
    totalTrips: trips.length,
    planningTrips: trips.filter(t => t.status === 'planning').length,
    activeTrips: trips.filter(t => t.status === 'active').length,
    completedTrips: trips.filter(t => t.status === 'completed').length,
    totalBudget: trips.reduce((sum, t) => sum + (t.budget || 0), 0),
  }

  return stats
}
