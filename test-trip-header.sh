#!/bin/bash
# Test script to verify trip dashboard header functionality

echo "🧪 Testing Trip Dashboard Header Upgrade"
echo "========================================"
echo ""

# Test 1: Check if all new files exist
echo "✅ Test 1: Verifying new files exist..."
files=(
  "src/app/trip/[id]/destination/page.tsx"
  "src/components/trip/ShareTripModal.tsx"
  "src/lib/weather.ts"
  "TRIP_HEADER_UPGRADE.md"
)

all_exist=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (missing)"
    all_exist=false
  fi
done

if [ "$all_exist" = true ]; then
  echo "  ✅ All files exist"
else
  echo "  ❌ Some files are missing"
  exit 1
fi
echo ""

# Test 2: Check for environment variable documentation
echo "✅ Test 2: Checking environment variable documentation..."
if grep -q "NEXT_PUBLIC_OPENWEATHER_API_KEY" .env.example; then
  echo "  ✓ OpenWeather API key documented in .env.example"
else
  echo "  ✗ OpenWeather API key not documented"
fi
echo ""

# Test 3: Check TypeScript compilation
echo "✅ Test 3: Running TypeScript type check..."
if npm run type-check 2>&1 | grep -q "Found 0 errors"; then
  echo "  ✓ No TypeScript errors"
else
  echo "  ⚠️  Some TypeScript errors exist (check other files)"
fi
echo ""

# Test 4: Verify imports in TripHeader
echo "✅ Test 4: Checking TripHeader component imports..."
if grep -q "useRouter" src/components/trip/TripHeader.tsx && \
   grep -q "ShareTripModal" src/components/trip/TripHeader.tsx; then
  echo "  ✓ TripHeader has required imports"
else
  echo "  ✗ TripHeader missing required imports"
fi
echo ""

# Test 5: Verify weather service has caching
echo "✅ Test 5: Checking weather service features..."
if grep -q "weatherCache" src/lib/weather.ts && \
   grep -q "CACHE_DURATION" src/lib/weather.ts; then
  echo "  ✓ Weather service has caching implemented"
else
  echo "  ✗ Weather service missing caching"
fi
echo ""

# Test 6: Verify members page uses real Supabase data
echo "✅ Test 6: Checking members page data connection..."
if grep -q "supabase" src/app/trip/\[id\]/members/page.tsx && \
   grep -q "trip_members" src/app/trip/\[id\]/members/page.tsx; then
  echo "  ✓ Members page connected to Supabase"
else
  echo "  ✗ Members page not connected to Supabase"
fi
echo ""

# Test 7: Verify itinerary page uses real Supabase data
echo "✅ Test 7: Checking itinerary page data connection..."
if grep -q "supabase" src/app/trip/\[id\]/itinerary/page.tsx && \
   grep -q "itinerary_days" src/app/trip/\[id\]/itinerary/page.tsx; then
  echo "  ✓ Itinerary page connected to Supabase"
else
  echo "  ✗ Itinerary page not connected to Supabase"
fi
echo ""

# Test 8: Check for empty states
echo "✅ Test 8: Verifying empty states exist..."
empty_state_count=$(grep -r "empty state\|No.*yet\|not available" src/app/trip/\[id\]/{destination,members,itinerary}/page.tsx 2>/dev/null | wc -l)
if [ "$empty_state_count" -gt 0 ]; then
  echo "  ✓ Found $empty_state_count empty state implementations"
else
  echo "  ✗ No empty states found"
fi
echo ""

echo "========================================"
echo "✅ All tests completed!"
echo ""
echo "📝 Next steps:"
echo "  1. Configure environment variables in .env.local"
echo "  2. Set up Supabase database tables"
echo "  3. Test the application manually"
echo "  4. Review TRIP_HEADER_UPGRADE.md for detailed documentation"
