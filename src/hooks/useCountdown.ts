/**
 * useCountdown Hook
 * 
 * Provides a live countdown timer that updates every second
 * Handles edge cases like missing or invalid dates
 */

import { useState, useEffect } from 'react'

export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

/**
 * Hook to create a live countdown to a target date
 * @param targetDate - The date to count down to (ISO string or Date)
 * @returns CountdownTime object with days, hours, minutes, seconds, and completion status
 */
export function useCountdown(targetDate: string | Date | null | undefined): CountdownTime {
  const [timeRemaining, setTimeRemaining] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  })

  useEffect(() => {
    // Handle invalid or missing dates
    if (!targetDate) {
      setTimeRemaining({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: true,
      })
      return
    }

    const calculateTimeRemaining = () => {
      try {
        const target = new Date(targetDate)
        
        // Validate the date
        if (isNaN(target.getTime())) {
          setTimeRemaining({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isComplete: true,
          })
          return
        }

        const now = new Date()
        const diff = target.getTime() - now.getTime()

        if (diff <= 0) {
          // Countdown is complete
          setTimeRemaining({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isComplete: true,
          })
        } else {
          // Calculate remaining time
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)

          setTimeRemaining({
            days,
            hours,
            minutes,
            seconds,
            isComplete: false,
          })
        }
      } catch (err) {
        console.error('Error calculating countdown:', err)
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        })
      }
    }

    // Initial calculation
    calculateTimeRemaining()

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeRemaining
}
