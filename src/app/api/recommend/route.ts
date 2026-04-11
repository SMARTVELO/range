import { NextRequest, NextResponse } from "next/server";

const HOTELS = [
  {
    id: "1", name: "Pure Air Hotel Berlin", city: "Berlin", country: "Germany",
    allergySafetyScore: 10, pricePerNight: 220,
    allergies: ["fragrance", "chemical", "dustMite", "mold", "essentialOils", "smoke"],
    certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
  },
  {
    id: "2", name: "Green Haven Amsterdam", city: "Amsterdam", country: "Netherlands",
    allergySafetyScore: 9, pricePerNight: 185,
    allergies: ["fragrance", "dustMite", "mold", "essentialOils", "smoke", "petDander"],
    certifications: ["fragrance-free", "organic", "allergen-tested", "eco-friendly"],
  },
  {
    id: "3", name: "Nordic Clean Hotel", city: "Copenhagen", country: "Denmark",
    allergySafetyScore: 10, pricePerNight: 295,
    allergies: ["fragrance", "chemical", "dustMite", "mold", "latex", "essentialOils", "smoke", "petDander", "electromagnetic"],
    certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
  },
  {
    id: "4", name: "Alpine Pure Lodge", city: "Zurich", country: "Switzerland",
    allergySafetyScore: 9, pricePerNight: 310,
    allergies: ["fragrance", "chemical", "dustMite", "mold", "latex", "essentialOils"],
    certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "hypoallergenic"],
  },
  {
    id: "5", name: "Safe Suites Vienna", city: "Vienna", country: "Austria",
    allergySafetyScore: 8, pricePerNight: 155,
    allergies: ["fragrance", "dustMite", "mold", "essentialOils", "smoke"],
    certifications: ["fragrance-free", "allergen-tested", "eco-friendly", "hypoallergenic"],
  },
  {
    id: "6", name: "Bio Hotel Salzburg", city: "Salzburg", country: "Austria",
    allergySafetyScore: 9, pricePerNight: 175,
    allergies: ["fragrance", "chemical", "dustMite", "mold", "essentialOils", "petDander"],
    certifications: ["fragrance-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
  },
  {
    id: "7", name: "Clean Air Boutique Paris", city: "Paris", country: "France",
    allergySafetyScore: 8, pricePerNight: 240,
    allergies: ["fragrance", "dustMite", "mold", "latex", "smoke"],
    certifications: ["fragrance-free", "allergen-tested", "hypoallergenic"],
  },
  {
    id: "8", name: "Oasis Libre Barcelona", city: "Barcelona", country: "Spain",
    allergySafetyScore: 8, pricePerNight: 165,
    allergies: ["fragrance", "dustMite", "mold", "essentialOils", "smoke", "petDander"],
    certifications: ["fragrance-free", "eco-friendly", "allergen-tested", "hypoallergenic"],
  },
  {
    id: "9", name: "Lufthafen Free Frankfurt", city: "Frankfurt", country: "Germany",
    allergySafetyScore: 7, pricePerNight: 110,
    allergies: ["fragrance", "dustMite", "smoke", "petDander"],
    certifications: ["fragrance-free", "allergen-tested"],
  },
  {
    id: "10", name: "Thermal Safe Budapest", city: "Budapest", country: "Hungary",
    allergySafetyScore: 8, pricePerNight: 140,
    allergies: ["fragrance", "chemical", "dustMite", "mold", "essentialOils", "smoke"],
    certifications: ["fragrance-free", "eco-friendly", "allergen-tested", "hypoallergenic"],
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { allergies, destination, maxBudget } = body as {
      allergies?: string[];
      destination?: string;
      maxBudget?: number;
    };

    let recommendations = [...HOTELS];

    // Filter by allergies - score hotels based on how many of the user's allergies they cover
    if (allergies && allergies.length > 0) {
      recommendations = recommendations
        .map((hotel) => ({
          ...hotel,
          matchScore: allergies.filter((a) =>
            hotel.allergies.includes(a)
          ).length,
        }))
        .filter((h) => h.matchScore === allergies.length) // Must cover ALL user allergies
        .sort((a, b) => {
          // Primary sort: allergy safety score (descending)
          if (b.allergySafetyScore !== a.allergySafetyScore) {
            return b.allergySafetyScore - a.allergySafetyScore;
          }
          // Secondary sort: number of certifications (descending)
          if (b.certifications.length !== a.certifications.length) {
            return b.certifications.length - a.certifications.length;
          }
          // Tertiary sort: price (ascending for better value)
          return a.pricePerNight - b.pricePerNight;
        });
    } else {
      recommendations.sort(
        (a, b) => b.allergySafetyScore - a.allergySafetyScore
      );
    }

    // Filter by destination
    if (destination && destination.trim()) {
      const lower = destination.toLowerCase();
      const destFiltered = recommendations.filter(
        (h) =>
          h.city.toLowerCase().includes(lower) ||
          h.country.toLowerCase().includes(lower) ||
          h.name.toLowerCase().includes(lower)
      );
      if (destFiltered.length > 0) {
        recommendations = destFiltered;
      }
    }

    // Filter by budget
    if (maxBudget && maxBudget > 0) {
      recommendations = recommendations.filter(
        (h) => h.pricePerNight <= maxBudget
      );
    }

    // Generate personalized reasoning for each recommendation
    const enriched = recommendations.slice(0, 5).map((hotel, index) => {
      const reasons: string[] = [];

      if (hotel.allergySafetyScore >= 9) {
        reasons.push("Exceptional allergy safety score of " + hotel.allergySafetyScore + "/10");
      } else if (hotel.allergySafetyScore >= 8) {
        reasons.push("Strong allergy safety measures with a score of " + hotel.allergySafetyScore + "/10");
      }

      if (allergies && allergies.length > 0) {
        reasons.push(
          "Certified safe for all " + allergies.length + " of your allergy types"
        );
      }

      if (hotel.certifications.length >= 5) {
        reasons.push(
          "Holds " + hotel.certifications.length + " independent allergy certifications"
        );
      }

      if (hotel.allergies.includes("electromagnetic")) {
        reasons.push("Offers EHS/electromagnetic sensitivity accommodations");
      }

      if (hotel.allergies.includes("chemical")) {
        reasons.push("Full MCS (Multiple Chemical Sensitivity) protocols in place");
      }

      return {
        ...hotel,
        rank: index + 1,
        reasons,
      };
    });

    return NextResponse.json({
      success: true,
      query: { allergies, destination, maxBudget },
      totalFound: recommendations.length,
      recommendations: enriched,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
