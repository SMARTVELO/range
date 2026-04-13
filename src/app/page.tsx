"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Search, MapPin, Calendar, Users, Shield, ShieldCheck, ShieldAlert,
  Star, Heart, ChevronLeft, Filter, X, Check, Award,
  Wind, Droplets, Sparkles, Trees, Bug, Zap, Leaf, PawPrint,
  Building2, Bed, Coffee, Wifi, Car, Dumbbell, Waves, UtensilsCrossed,
  Clock, AlertTriangle, Navigation, MessageSquare,
  ChevronDown, Menu,
  ArrowRight, Hotel, DoorOpen, Fan, Stethoscope, Pill,
  MountainSnow, Sun,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type AllergyType =
  | "fragrance"
  | "chemical"
  | "dustMite"
  | "mold"
  | "latex"
  | "electromagnetic"
  | "essentialOils"
  | "smoke"
  | "petDander";

type Certification =
  | "fragrance-free"
  | "chemical-free"
  | "organic"
  | "allergen-tested"
  | "eco-friendly"
  | "hypoallergenic";

interface AllergyTypeInfo {
  id: AllergyType;
  label: string;
  germanLabel: string;
  icon: React.ReactNode;
  description: string;
}

interface RoomType {
  id: string;
  name: string;
  maxGuests: number;
  pricePerNight: number;
  features: string[];
  allergyFeatures: string[];
  available: boolean;
  image: string;
}

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  allergyType?: AllergyType;
  title: string;
  content: string;
}

interface AllergyInfo {
  certifications: Certification[];
  cleaningProducts: string[];
  roomMaterials: string[];
  airQuality: string[];
  foodOptions: string[];
  emergencyInfo: {
    nearestHospital: string;
    distanceToHospital: string;
    allergyProtocols: string[];
  };
  specialNotes: string;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  stars: number;
  pricePerNight: number;
  allergySafetyScore: number;
  certifications: Certification[];
  allergies: AllergyType[];
  description: string;
  amenities: string[];
  allergyInfo: AllergyInfo;
  rooms: RoomType[];
  reviews: Review[];
  image: string;
  gradient: string;
  imageIcon: React.ReactNode;
}

type View = "hero" | "search" | "detail";
type DetailTab = "overview" | "allergy" | "rooms" | "reviews" | "location";

// ============================================================
// MOCK DATA
// ============================================================

const ALLERGY_TYPES: AllergyTypeInfo[] = [
  { id: "fragrance", label: "Fragrance/Perfume", germanLabel: "Duftstoffallergie", icon: <Sparkles className="w-4 h-4" />, description: "Sensitivity to perfumes, scented products, air fresheners" },
  { id: "chemical", label: "Chemical Sensitivity (MCS)", germanLabel: "MCS", icon: <Droplets className="w-4 h-4" />, description: "Multiple Chemical Sensitivity to cleaning products, paints, etc." },
  { id: "dustMite", label: "Dust Mite Allergy", germanLabel: "Hausstaubmilbenallergie", icon: <Bug className="w-4 h-4" />, description: "Allergic reaction to dust mites and their waste products" },
  { id: "mold", label: "Mold Allergy", germanLabel: "Schimmelpilzallergie", icon: <Leaf className="w-4 h-4" />, description: "Sensitivity to mold spores and damp environments" },
  { id: "latex", label: "Latex Allergy", germanLabel: "Latexallergie", icon: <ShieldAlert className="w-4 h-4" />, description: "Allergic reaction to natural rubber latex products" },
  { id: "electromagnetic", label: "Electromagnetic Sensitivity", germanLabel: "EHS", icon: <Zap className="w-4 h-4" />, description: "Electromagnetic hypersensitivity (EHS) to WiFi, cell signals, etc." },
  { id: "essentialOils", label: "Essential Oils", germanLabel: "Ätherische Öle", icon: <Trees className="w-4 h-4" />, description: "Sensitivity to essential oils and aromatherapy products" },
  { id: "smoke", label: "Smoke Sensitivity", germanLabel: "Rauchempfindlichkeit", icon: <Wind className="w-4 h-4" />, description: "Sensitivity to tobacco smoke and other forms of smoke" },
  { id: "petDander", label: "Pet Dander", germanLabel: "Tierhaarallergie", icon: <PawPrint className="w-4 h-4" />, description: "Allergic reaction to pet dander, saliva, and urine" },
];

const CERTIFICATION_LABELS: Record<Certification, { label: string; icon: React.ReactNode }> = {
  "fragrance-free": { label: "Fragrance-Free", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  "chemical-free": { label: "Chemical-Free", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  "organic": { label: "Organic Certified", icon: <Leaf className="w-3.5 h-3.5" /> },
  "allergen-tested": { label: "Allergen Tested", icon: <Shield className="w-3.5 h-3.5" /> },
  "eco-friendly": { label: "Eco-Friendly", icon: <Trees className="w-3.5 h-3.5" /> },
  "hypoallergenic": { label: "Hypoallergenic", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Free WiFi": <Wifi className="w-4 h-4" />,
  "Free Parking": <Car className="w-4 h-4" />,
  "Fitness Center": <Dumbbell className="w-4 h-4" />,
  "Spa": <Waves className="w-4 h-4" />,
  "Restaurant": <UtensilsCrossed className="w-4 h-4" />,
  "Room Service": <Coffee className="w-4 h-4" />,
  "Swimming Pool": <Waves className="w-4 h-4" />,
  "24/7 Front Desk": <Clock className="w-4 h-4" />,
};

const HOTELS: Hotel[] = [
  {
    id: "1",
    name: "Pure Air Hotel Berlin",
    location: "Friedrichstraße 120, Berlin-Mitte",
    city: "Berlin",
    country: "Germany",
    stars: 5,
    pricePerNight: 220,
    allergySafetyScore: 10,
    certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
    allergies: ["fragrance", "chemical", "dustMite", "mold", "essentialOils", "smoke"],
    description: "Berlin's premier allergy-safe hotel, located in the heart of Mitte. Pure Air Hotel was designed from the ground up with allergy sufferers in mind, featuring advanced air filtration systems, organic materials throughout, and a dedicated allergy concierge service. Our award-winning restaurant offers a fully customizable allergen-free menu.",
    amenities: ["Free WiFi", "Free Parking", "Fitness Center", "Spa", "Restaurant", "Room Service", "24/7 Front Desk"],
    allergyInfo: {
      certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
      cleaningProducts: ["Ecover Zero", "Seventh Generation Free & Clear", "Steam cleaning only", "Microfiber systems"],
      roomMaterials: ["Solid oak hardwood floors", "Organic cotton bedding (GOTS certified)", "Low-VOC painted walls", "No wallpaper", "Natural stone bathrooms", "Organic cotton towels"],
      airQuality: ["Medical-grade HEPA H13 filters in every room", "Central fresh air ventilation system", "No air fresheners anywhere", "CO2 monitors in every room", "Radon mitigation system", "Humidity control 40-50%"],
      foodOptions: ["Fully allergen-free kitchen", "Separate prep areas for major allergens", "Organic ingredients primarily", "Detailed ingredient lists for all dishes", "Vegan & vegetarian options", "Gluten-free, dairy-free, nut-free menus available"],
      emergencyInfo: { nearestHospital: "Charité - Universitätsmedizin Berlin", distanceToHospital: "1.2 km", allergyProtocols: ["Staff trained in anaphylaxis response", "EpiPens available at front desk", "Allergy action plans on file", "Direct line to allergy clinic", "Ambulance pre-notification system"] },
      specialNotes: "This hotel has been specifically designed and built for maximum allergy safety. All rooms are electromagnetically shielded as an optional upgrade. We have a dedicated 'safe wing' with enhanced air filtration for guests with severe MCS."
    },
    rooms: [
      { id: "r1-1", name: "Pure Comfort Room", maxGuests: 2, pricePerNight: 220, features: ["King bed", "City view", "Rain shower"], allergyFeatures: ["HEPA air purifier", "Hardwood floors", "Organic bedding", "No carpet", "Openable windows", "Fragrance-free amenities"], available: true, image: "from-amber-100 to-orange-100" },
      { id: "r1-2", name: "Safe Haven Suite", maxGuests: 3, pricePerNight: 320, features: ["King bed + sofa bed", "Panoramic view", "Separate living area", "Kitchenette"], allergyFeatures: ["Enhanced HEPA H14 filtration", "Solid wood floors", "Organic cotton everything", "Private kitchen with allergen-free utensils", "Electromagnetic shielding available", "Dedicated fresh air system"], available: true, image: "from-green-50 to-emerald-100" },
      { id: "r1-3", name: "Family Safe Room", maxGuests: 4, pricePerNight: 280, features: ["Queen bed + bunk beds", "Garden view", "Extra space"], allergyFeatures: ["HEPA air purifier x2", "Hardwood floors", "Dust mite-proof mattress encasings", "Organic bedding", "Hypoallergenic toys available"], available: true, image: "from-sky-50 to-blue-100" },
    ],
    reviews: [
      { id: "rv1-1", author: "Anna K.", date: "2025-11-15", rating: 10, allergyType: "fragrance", title: "Finally, a hotel I can breathe in!", content: "As someone with severe fragrance sensitivity, I've struggled for years to find safe accommodations. Pure Air Hotel Berlin exceeded all expectations. No lingering scents, truly clean air, and the staff was incredibly knowledgeable." },
      { id: "rv1-2", author: "Thomas M.", date: "2025-10-22", rating: 9, allergyType: "chemical", title: "MCS-friendly paradise", content: "I traveled with my wife who has MCS and we were both impressed. The room had no chemical smells at all. The steam cleaning really makes a difference. Will definitely return." },
      { id: "rv1-3", author: "Maria S.", date: "2025-09-30", rating: 10, allergyType: "dustMite", title: "No sneezing for a whole week!", content: "The dust mite-proof encasings and HEPA filters made all the difference. I slept better here than at home. The organic cotton bedding was incredibly comfortable." },
      { id: "rv1-4", author: "James L.", date: "2025-08-18", rating: 8, allergyType: "mold", title: "Clean, dry, and mold-free", content: "The humidity control system is excellent. No musty smells anywhere, and I could feel the difference in air quality immediately. Only wish the breakfast had more variety." },
      { id: "rv1-5", author: "Sophie R.", date: "2025-07-05", rating: 10, allergyType: "essentialOils", title: "No hidden aromatherapy!", content: "So many 'natural' hotels use essential oils everywhere. Not Pure Air. They truly understand that natural doesn't mean safe for everyone. The allergen-free restaurant was outstanding." },
    ],
    image: "/hotels/berlin.png",
    gradient: "from-blue-600 to-blue-800",
    imageIcon: <Building2 className="w-16 h-16 text-white/30" />,
  },
  {
    id: "2",
    name: "Green Haven Amsterdam",
    location: "Keizersgracht 450, Amsterdam-Centrum",
    city: "Amsterdam",
    country: "Netherlands",
    stars: 4,
    pricePerNight: 185,
    allergySafetyScore: 9,
    certifications: ["fragrance-free", "organic", "allergen-tested", "eco-friendly"],
    allergies: ["fragrance", "dustMite", "mold", "essentialOils", "smoke", "petDander"],
    description: "A charming boutique hotel along the iconic Keizersgracht canal, Green Haven Amsterdam combines Dutch elegance with comprehensive allergy-safe practices. Our 18th-century building has been completely renovated with modern allergy-safe materials while preserving its historic character.",
    amenities: ["Free WiFi", "Restaurant", "Room Service", "Canal view terrace", "Bicycle rental", "24/7 Front Desk"],
    allergyInfo: {
      certifications: ["fragrance-free", "organic", "allergen-tested", "eco-friendly"],
      cleaningProducts: ["Method Free + Clear", "Ecover products", "Steam cleaning", "Vinegar-based solutions"],
      roomMaterials: ["Engineered hardwood floors", "Organic cotton bedding", "Low-VOC paint", "No carpet in rooms", "Natural stone and tile bathrooms"],
      airQuality: ["HEPA filters in all rooms", "Natural ventilation with openable windows", "No air fresheners", "Dehumidifiers available", "Indoor plants for natural air purification (hypoallergenic species only)"],
      foodOptions: ["Allergen-free breakfast options", "Lactose-free milk and gluten-free bread available", "Organic coffee and tea", "Nut-free kitchen preparation area", "Custom meals prepared on request"],
      emergencyInfo: { nearestHospital: "Amsterdam UMC, locatie AMC", distanceToHospital: "3.5 km", allergyProtocols: ["First aid trained staff", "EpiPens at reception", "Allergy info cards in Dutch and English", "Taxi service arrangement to hospital"] },
      specialNotes: "Our building's age means some rooms have varying humidity levels - please request our 'dry rooms' if you have mold sensitivity. The canal-side rooms have excellent natural ventilation."
    },
    rooms: [
      { id: "r2-1", name: "Canal View Room", maxGuests: 2, pricePerNight: 185, features: ["Queen bed", "Canal view", "Sitting area"], allergyFeatures: ["HEPA air purifier", "Hardwood floors", "Organic bedding", "Openable windows"], available: true, image: "from-emerald-100 to-teal-100" },
      { id: "r2-2", name: "Garden Room", maxGuests: 2, pricePerNight: 165, features: ["Queen bed", "Garden view", "Private entrance"], allergyFeatures: ["HEPA air purifier", "Hardwood floors", "Organic bedding", "Ground floor access", "Enhanced dehumidifier"], available: true, image: "from-lime-50 to-green-100" },
      { id: "r2-3", name: "Golden Age Suite", maxGuests: 3, pricePerNight: 265, features: ["King bed", "Canal panorama", "Separate dining", "Historic details"], allergyFeatures: ["Dual HEPA filtration", "Hardwood floors", "Organic cotton bedding", "Private air purification system", "No historic wallpapers (replicated with paint)"], available: false, image: "from-amber-50 to-yellow-100" },
    ],
    reviews: [
      { id: "rv2-1", author: "Linda V.", date: "2025-12-01", rating: 9, allergyType: "fragrance", title: "Beautiful and safe", content: "Stunning canal views and absolutely no fragrance in the air. The staff even removed a floral arrangement from the lobby when they saw my allergy band. Thoughtful and professional." },
      { id: "rv2-2", author: "Peter de J.", date: "2025-11-10", rating: 8, allergyType: "dustMite", title: "Very good, minor issues", content: "The anti-dust mite measures are excellent. Only giving 8 because the historic wooden beams collect some dust in the higher areas, but the HEPA filters handled it well." },
      { id: "rv2-3", author: "Claire D.", date: "2025-10-15", rating: 10, allergyType: "smoke", title: "Smoke-free bliss", content: "Completely smoke-free property, even outdoors near entrances. As a smoke-sensitive person, this was such a relief. The garden room was perfect." },
      { id: "rv2-4", author: "Hans W.", date: "2025-09-20", rating: 9, allergyType: "petDander", title: "No pets, no problem", content: "Strict no-pet policy is enforced, which is exactly what I needed. The room was spotless and I had zero allergy symptoms during my stay." },
    ],
    image: "/hotels/amsterdam.png",
    gradient: "from-emerald-500 to-teal-700",
    imageIcon: <Building2 className="w-16 h-16 text-white/30" />,
  },
  {
    id: "3",
    name: "Nordic Clean Hotel",
    location: "Nytorv 15, Indre By",
    city: "Copenhagen",
    country: "Denmark",
    stars: 5,
    pricePerNight: 295,
    allergySafetyScore: 10,
    certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
    allergies: ["fragrance", "chemical", "dustMite", "mold", "latex", "essentialOils", "smoke", "petDander", "electromagnetic"],
    description: "Scandinavian design meets allergy science at Nordic Clean Hotel. Located in Copenhagen's picturesque old town, this purpose-built hotel features cutting-edge air purification, non-toxic materials throughout, and even offers EHS-friendly rooms with reduced electromagnetic exposure.",
    amenities: ["Free WiFi", "Free Parking", "Fitness Center", "Spa", "Restaurant", "Sauna", "24/7 Front Desk"],
    allergyInfo: {
      certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
      cleaningProducts: ["Nilfisk steam systems", "NorClean products", "Baking soda & vinegar", "ENJO cleaning fibers"],
      roomMaterials: ["FSC-certified solid birch floors", "Organic cotton & linen bedding", "Mineral-based paint", "No wallpaper anywhere", "Porcelain & natural stone bathrooms", "Latex-free everything"],
      airQuality: ["HEPA H14 + activated carbon filtration", "Demand-controlled ventilation (DCV)", "Radon protection", "CO2/VOC continuous monitoring", "Negative ion generators in common areas", "No HVAC fragrances"],
      foodOptions: ["100% organic restaurant", "All 14 EU allergens clearly labeled", "Separate allergen-free preparation kitchen", "Raw vegan options", "Homeopathy-friendly menu available", "All cooking done in stainless steel (no Teflon)"],
      emergencyInfo: { nearestHospital: "Rigshospitalet", distanceToHospital: "2.1 km", allergyProtocols: ["All staff allergy-first-aid certified", "Emergency allergy kit in every floor", "Direct protocol with Rigshospitalet allergy department", "Guest allergy profiles stored securely", "24/7 nurse hotline"] },
      specialNotes: "We offer dedicated EHS rooms with shielded electrical wiring, Ethernet-only internet (no WiFi in room), and analog phone. Please request when booking. Our spa uses only fragrance-free organic products."
    },
    rooms: [
      { id: "r3-1", name: "Nordic Standard", maxGuests: 2, pricePerNight: 295, features: ["Queen bed", "City view", "Rain shower"], allergyFeatures: ["HEPA H14 purifier", "Birch hardwood floors", "Organic linen bedding", "Openable windows", "Latex-free pillows available"], available: true, image: "from-slate-100 to-gray-200" },
      { id: "r3-2", name: "EHS Safe Room", maxGuests: 2, pricePerNight: 350, features: ["Queen bed", "Courtyard view", "Ethernet internet", "Analog phone"], allergyFeatures: ["Electromagnetic shielding", "No WiFi in room", "Fiber optic connections", "Hardwood floors", "Organic bedding", "Battery-powered clock"], available: true, image: "from-violet-50 to-purple-100" },
      { id: "r3-3", name: "Scandinavian Suite", maxGuests: 3, pricePerNight: 420, features: ["King bed + daybed", "Full kitchen", "Separate living area"], allergyFeatures: ["Full HEPA + carbon filtration", "Solid wood throughout", "Organic everything", "Allergen-free kitchen utensils", "Built-in air quality display", "Low-EMF electrical"], available: true, image: "from-cyan-50 to-sky-100" },
    ],
    reviews: [
      { id: "rv3-1", author: "Erik N.", date: "2025-11-28", rating: 10, allergyType: "electromagnetic", title: "The only hotel I can stay at", content: "As someone with severe EHS, I've essentially stopped traveling. Nordic Clean's EHS room changed everything. Shielded room, no WiFi, fiber internet. I had zero symptoms for the first time away from home in years." },
      { id: "rv3-2", author: "Ingrid B.", date: "2025-11-05", rating: 10, allergyType: "fragrance", title: "Pure Scandinavian excellence", content: "Everything about this hotel is thoughtful and safe. The organic restaurant is Michelin-worthy, the air quality is hospital-grade, and the staff truly understands allergies." },
      { id: "rv3-3", author: "Michael T.", date: "2025-10-12", rating: 9, allergyType: "latex", title: "Latex-free peace of mind", content: "Finally a hotel that takes latex allergies seriously. No latex gloves, latex-free mattresses, even the yoga mats in the gym are latex-free. Attention to detail is remarkable." },
    ],
    image: "/hotels/copenhagen.png",
    gradient: "from-slate-600 to-slate-800",
    imageIcon: <Hotel className="w-16 h-16 text-white/30" />,
  },
  {
    id: "4",
    name: "Alpine Pure Lodge",
    location: "Bahnhofstrasse 28, Zürich-City",
    city: "Zurich",
    country: "Switzerland",
    stars: 5,
    pricePerNight: 310,
    allergySafetyScore: 9,
    certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "hypoallergenic"],
    allergies: ["fragrance", "chemical", "dustMite", "mold", "latex", "essentialOils"],
    description: "Swiss precision meets allergy care at Alpine Pure Lodge. Located on Zurich's famous Bahnhofstrasse, our hotel combines luxury with medically-informed allergy protocols developed in collaboration with the University Hospital Zurich's allergy department.",
    amenities: ["Free WiFi", "Free Parking", "Fitness Center", "Spa", "Restaurant", "Concierge", "24/7 Front Desk"],
    allergyInfo: {
      certifications: ["fragrance-free", "chemical-free", "organic", "allergen-tested", "hypoallergenic"],
      cleaningProducts: ["Bio-Circle cleaning system", "Kiehl professional (fragrance-free line)", "Steam-only carpet cleaning", "UV-C surface disinfection"],
      roomMaterials: ["Swiss stone pine hardwood floors", "Organic cotton & new wool bedding", "Mineral paint (A+ emission class)", "No wallpaper", "Granite bathrooms", "Merino wool blankets"],
      airQuality: ["Swiss-made HEPA filtration systems", "Alpine fresh air intake system", "No air fresheners", "Allergy-tested room fragrances (none used)", "Individual room humidity control", "Air quality display in each room"],
      foodOptions: ["Swiss organic cuisine", "Full allergen matrix for every dish", "Separate gluten-free bakery section", "Lactose-free, nut-free, egg-free options", "Medical diet accommodation", "Room fridge for personal allergen-free foods"],
      emergencyInfo: { nearestHospital: "Universitätsspital Zürich (USZ)", distanceToHospital: "0.8 km", allergyProtocols: ["Medical advisory board", "Staff trained by USZ allergy dept.", "Emergency medication at reception", "Guest medical file storage", "Direct line to USZ emergency"] },
      specialNotes: "We offer a pre-arrival consultation where you can discuss your specific needs with our allergy concierge. Medical certificates for travel insurance available upon request."
    },
    rooms: [
      { id: "r4-1", name: "Classic Pure Room", maxGuests: 2, pricePerNight: 310, features: ["Queen bed", "City view", "Marble bathroom"], allergyFeatures: ["HEPA filtration", "Stone pine floors", "Organic cotton bedding", "Openable windows", "Individual climate control"], available: true, image: "from-rose-50 to-pink-100" },
      { id: "r4-2", name: "Swiss Pine Suite", maxGuests: 2, pricePerNight: 390, features: ["King bed", "Limmat river view", "Living area"], allergyFeatures: ["Swiss stone pine (naturally hypoallergenic)", "Enhanced HEPA system", "Organic new wool bedding", "Private air purifier", "Anti-allergy pillow menu"], available: true, image: "from-red-50 to-orange-100" },
      { id: "r4-3", name: "Medical Suite", maxGuests: 2, pricePerNight: 450, features: ["King bed", "Enhanced medical features", "Extra space"], allergyFeatures: ["Hospital-grade HEPA + UV", "Sealed room option", "Medical air monitoring", "Emergency response station in-room", "All latex-free medical supplies", "Direct nurse call button"], available: true, image: "from-indigo-50 to-blue-100" },
    ],
    reviews: [
      { id: "rv4-1", author: "Karin H.", date: "2025-12-05", rating: 10, allergyType: "chemical", title: "Swiss precision for allergies", content: "The collaboration with University Hospital Zurich shows. Every detail is medically considered. The air quality display in the room gave me such peace of mind." },
      { id: "rv4-2", author: "Robert F.", date: "2025-11-18", rating: 9, allergyType: "mold", title: "Perfect for mold allergy", content: "The Swiss stone pine floors are naturally mold-resistant. The humidity control is excellent. I usually wake up congested at hotels but not here." },
      { id: "rv4-3", author: "Elena P.", date: "2025-10-25", rating: 10, allergyType: "fragrance", title: "Luxury without the scent", content: "So many luxury hotels overwhelm you with fragrances. Alpine Pure proves you can have five-star luxury without any scent at all. The Swiss pine suite smelled naturally wonderful." },
    ],
    image: "/hotels/zurich.png",
    gradient: "from-red-600 to-rose-800",
    imageIcon: <MountainSnow className="w-16 h-16 text-white/30" />,
  },
  {
    id: "5",
    name: "Safe Suites Vienna",
    location: "Mariahilfer Straße 78, Mariahilf",
    city: "Vienna",
    country: "Austria",
    stars: 4,
    pricePerNight: 155,
    allergySafetyScore: 8,
    certifications: ["fragrance-free", "allergen-tested", "eco-friendly", "hypoallergenic"],
    allergies: ["fragrance", "dustMite", "mold", "essentialOils", "smoke"],
    description: "A modern, design-forward hotel on Vienna's famous shopping street. Safe Suites offers well-appointed rooms with strong allergy-safe protocols at a more accessible price point. Perfect for travelers who want reliable allergy safety without breaking the bank.",
    amenities: ["Free WiFi", "Breakfast buffet", "Fitness Center", "Laundry service", "24/7 Front Desk"],
    allergyInfo: {
      certifications: ["fragrance-free", "allergen-tested", "eco-friendly", "hypoallergenic"],
      cleaningProducts: ["Frosch products", "Steam cleaning", "Microfiber systems", "Baking soda paste for tough stains"],
      roomMaterials: ["Laminate hardwood floors (low-emission)", "Organic cotton bedding", "Low-VOC paint", "Tile bathrooms", "No carpet in bedrooms"],
      airQuality: ["HEPA filters in bedrooms", "Openable windows in all rooms", "No air fresheners", "Regular ventilation cycles", "Dehumidifiers on request"],
      foodOptions: ["Allergen-free breakfast options daily", "Gluten-free bread and cereal", "Lactose-free milk and yogurt", "Nut-free table available", "Fresh fruit and vegetable juices"],
      emergencyInfo: { nearestHospital: "AKH Wien - Allgemeines Krankenhaus der Stadt Wien", distanceToHospital: "4.2 km", allergyProtocols: ["Basic first aid trained staff", "EpiPens at reception", "Emergency phone numbers in room", "Taxi arrangement service"] },
      specialNotes: "While our allergy safety measures are robust, this is a budget-friendly option. For severe MCS or EHS, we recommend our partner hotel Nordic Clean in Copenhagen for enhanced protocols."
    },
    rooms: [
      { id: "r5-1", name: "Safe Standard", maxGuests: 2, pricePerNight: 155, features: ["Double bed", "City view", "Shower"], allergyFeatures: ["HEPA filter", "Hardwood floors", "Organic cotton bedding", "Openable windows"], available: true, image: "from-violet-100 to-purple-100" },
      { id: "r5-2", name: "Safe Plus Room", maxGuests: 2, pricePerNight: 195, features: ["Queen bed", "Quiet courtyard view", "Bathtub"], allergyFeatures: ["HEPA filter", "Hardwood floors", "Enhanced organic bedding", "Openable windows", "Mini fridge for allergen-free foods"], available: true, image: "from-fuchsia-50 to-pink-100" },
      { id: "r5-3", name: "Safe Family Room", maxGuests: 4, pricePerNight: 230, features: ["Queen bed + sofa bed", "Extra space", "Courtyard view"], allergyFeatures: ["Two HEPA filters", "Hardwood floors", "Organic bedding for all beds", "Dust mite covers available", "Hypoallergenic stuffed animals for kids"], available: true, image: "from-orange-50 to-amber-100" },
    ],
    reviews: [
      { id: "rv5-1", author: "Markus A.", date: "2025-11-22", rating: 8, allergyType: "dustMite", title: "Good value allergy-safe option", content: "For the price, the allergy measures are impressive. HEPA filters, organic bedding, and no fragrances. Not quite as thorough as the premium hotels but great for the price." },
      { id: "rv5-2", author: "Julia W.", date: "2025-10-30", rating: 7, allergyType: "fragrance", title: "Mostly good, lobby had a faint scent", content: "The room was perfect - no scents at all. But the lobby had a very faint cleaning product smell that I noticed. Room was great though, would stay again and ask for a room far from the lobby." },
      { id: "rv5-3", author: "Günter S.", date: "2025-09-14", rating: 9, allergyType: "smoke", title: "Smoke-free and proud", content: "Excellent smoke-free policy, enforced strictly. Great location on Mariahilfer Straße. Breakfast had good allergen-free options." },
    ],
    image: "/hotels/vienna.png",
    gradient: "from-violet-600 to-purple-800",
    imageIcon: <Building2 className="w-16 h-16 text-white/30" />,
  },
  {
    id: "6",
    name: "Bio Hotel Salzburg",
    location: "Linzer Gasse 22, Altstadt",
    city: "Salzburg",
    country: "Austria",
    stars: 4,
    pricePerNight: 175,
    allergySafetyScore: 9,
    certifications: ["fragrance-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
    allergies: ["fragrance", "chemical", "dustMite", "mold", "essentialOils", "petDander"],
    description: "Nestled in Salzburg's beautiful old town, Bio Hotel is Austria's first fully organic-certified hotel. Every aspect from the breakfast to the building materials is organic and allergy-tested. Wake up to views of the Alps and the sound of silence (no air fresheners!).",
    amenities: ["Free WiFi", "Organic breakfast", "Garden terrace", "Library", "24/7 Front Desk", "Bicycle rental"],
    allergyInfo: {
      certifications: ["fragrance-free", "organic", "allergen-tested", "eco-friendly", "hypoallergenic"],
      cleaningProducts: ["Sonett products", "Homemade vinegar cleaners", "Steam only", "Beeswax wood polish"],
      roomMaterials: ["Reclaimed oak floors", "Organic cotton & hemp bedding", "Clay plaster walls (naturally breathable)", "No wallpaper", "Natural stone bathrooms", "Organic wool carpets (tested and approved)"],
      airQuality: ["HEPA + natural clay wall air purification", "Cross ventilation design", "No air fresheners", "Indoor air quality tested quarterly", "Salt lamps in common areas"],
      foodOptions: ["100% organic breakfast buffet", "Full allergen labeling", "Separate gluten-free station", "Raw milk alternatives (oat, rice, coconut)", "Organic herbal teas", " Homemade jams and muesli"],
      emergencyInfo: { nearestHospital: "Universitätsklinikum Salzburg (PMU)", distanceToHospital: "2.5 km", allergyProtocols: ["Organic-certified allergy response protocol", "EpiPens available", "Staff trained in natural allergy management", "Partnership with local homeopathic clinic"] },
      specialNotes: "Our clay plaster walls naturally regulate humidity and purify air - a traditional Austrian building technique perfect for allergy sufferers. Some rooms have small organic wool area rugs, please specify if you prefer no textiles."
    },
    rooms: [
      { id: "r6-1", name: "Bio Classic", maxGuests: 2, pricePerNight: 175, features: ["Queen bed", "Old town view", "Shower"], allergyFeatures: ["Clay plaster walls (natural air purifier)", "Oak floors", "Organic cotton bedding", "Openable windows"], available: true, image: "from-lime-100 to-green-100" },
      { id: "r6-2", name: "Alpine Organic Suite", maxGuests: 3, pricePerNight: 250, features: ["King bed + reading nook", "Alpine view", "Private balcony"], allergyFeatures: ["Enhanced clay plaster", "Solid oak throughout", "Organic hemp bedding option", "Private balcony for fresh air", "Salt lamp", "No rugs option"], available: true, image: "from-teal-50 to-cyan-100" },
      { id: "r6-3", name: "Garden Room", maxGuests: 2, pricePerNight: 160, features: ["Double bed", "Garden view", "Ground floor"], allergyFeatures: ["Clay plaster walls", "Oak floors", "Organic bedding", "Direct garden access", "No rugs"], available: true, image: "from-emerald-50 to-green-100" },
    ],
    reviews: [
      { id: "rv6-1", author: "Birgit K.", date: "2025-11-30", rating: 10, allergyType: "essentialOils", title: "Organic and truly safe", content: "I react to many 'natural' products because they contain essential oils. Bio Hotel understands this distinction perfectly. Everything is organic but essential-oil-free. The clay walls are amazing." },
      { id: "rv6-2", author: "Stefan L.", date: "2025-10-28", rating: 9, allergyType: "chemical", title: "Clay walls are magic", content: "The clay plaster walls genuinely make a difference in air quality. My MCS symptoms were minimal throughout my stay. The organic breakfast was divine." },
      { id: "rv6-3", author: "Petra M.", date: "2025-09-05", rating: 8, allergyType: "dustMite", title: "Charming and safe", content: "Beautiful old town location with solid allergy measures. The only minor thing is the old building means slightly less consistent temperature control, but the air quality is excellent." },
    ],
    image: "/hotels/salzburg.png",
    gradient: "from-green-600 to-emerald-800",
    imageIcon: <Trees className="w-16 h-16 text-white/30" />,
  },
  {
    id: "7",
    name: "Clean Air Boutique Paris",
    location: "Rue du Faubourg Saint-Honoré 145, 8th Arr.",
    city: "Paris",
    country: "France",
    stars: 4,
    pricePerNight: 240,
    allergySafetyScore: 8,
    certifications: ["fragrance-free", "allergen-tested", "hypoallergenic"],
    allergies: ["fragrance", "dustMite", "mold", "latex", "smoke"],
    description: "An elegant allergy-safe boutique hotel in Paris's prestigious 8th arrondissement. Clean Air Boutique proves that French luxury and allergy safety can go hand in hand. Walking distance to the Champs-Élysées with comprehensive air filtration and fragrance-free protocols.",
    amenities: ["Free WiFi", "Breakfast", "Bar", "Concierge", "Laundry service", "24/7 Front Desk"],
    allergyInfo: {
      certifications: ["fragrance-free", "allergen-tested", "hypoallergenic"],
      cleaningProducts: ["Eau Ecarlate (fragrance-free)", "Steam cleaning", "French-made hypoallergenic products", "Dry steam for upholstery"],
      roomMaterials: ["French oak parquet floors", "Organic cotton bedding (French manufacture)", "Low-emission paint", "No wallpaper", "Marble bathrooms"],
      airQuality: ["HEPA H13 filtration", "Paris air pollution - enhanced carbon filtration", "Openable windows", "No air fresheners", "Optional room ionizer"],
      foodOptions: ["Allergen-free French breakfast", "Croissants from gluten-free bakery", "Lactose-free options", "Fresh squeezed juices", "Vegan patisserie options"],
      emergencyInfo: { nearestHospital: "Hôpital Européen Georges-Pompidou", distanceToHospital: "3.8 km", allergyProtocols: ["Bilingual emergency protocols (FR/EN)", "EpiPens available", "SAMU pre-hospital notification", "Allergy emergency plan per guest"] },
      specialNotes: "Due to Paris's air quality, we run enhanced carbon filtration to handle urban pollution. Rooms facing the courtyard have cleaner air than street-facing rooms - please mention when booking."
    },
    rooms: [
      { id: "r7-1", name: "Parisian Pure Room", maxGuests: 2, pricePerNight: 240, features: ["Queen bed", "Courtyard view", "Marble bathroom"], allergyFeatures: ["HEPA + carbon filter", "Oak parquet floors", "Organic cotton bedding", "Soundproof windows (also block pollution)"], available: true, image: "from-pink-50 to-rose-100" },
      { id: "r7-2", name: "Champs-Élysées Suite", maxGuests: 2, pricePerNight: 340, features: ["King bed", "Champs-Élysées view", "Separate living", "Mini bar"], allergyFeatures: ["Enhanced dual filtration", "Oak floors throughout", "Premium organic bedding", "Air quality display", "Allergen-free mini bar items"], available: true, image: "from-blue-50 to-indigo-100" },
      { id: "r7-3", name: "Executive Clean Room", maxGuests: 2, pricePerNight: 280, features: ["Queen bed", "City view", "Work desk"], allergyFeatures: ["HEPA + carbon filter", "Oak floors", "Organic bedding", "Latex-free office supplies"], available: true, image: "from-gray-50 to-slate-100" },
    ],
    reviews: [
      { id: "rv7-1", author: "Marie-Claire D.", date: "2025-12-02", rating: 9, allergyType: "fragrance", title: "Paris without the perfume", content: "As a French woman with Duftstoffallergie, it's ironic that Paris is one of the hardest cities for me. Clean Air Boutique is an oasis. No perfumes anywhere, and the courtyard room blocks the city pollution." },
      { id: "rv7-2", author: "Jean-Pierre M.", date: "2025-11-15", rating: 8, allergyType: "latex", title: "Latex-free luxury", content: "Beautiful hotel with thoughtful latex-free protocols. The front desk even had latex-free gloves for handling luggage. The gluten-free croissants were surprisingly good!" },
    ],
    image: "/hotels/paris.png",
    gradient: "from-pink-600 to-rose-800",
    imageIcon: <Building2 className="w-16 h-16 text-white/30" />,
  },
  {
    id: "8",
    name: "Oasis Libre Barcelona",
    location: "Passeig de Gràcia 92, Eixample",
    city: "Barcelona",
    country: "Spain",
    stars: 4,
    pricePerNight: 165,
    allergySafetyScore: 8,
    certifications: ["fragrance-free", "eco-friendly", "allergen-tested", "hypoallergenic"],
    allergies: ["fragrance", "dustMite", "mold", "essentialOils", "smoke", "petDander"],
    description: "A vibrant, allergy-safe hotel on Barcelona's famous Passeig de Gràcia. Oasis Libre offers Mediterranean warmth with comprehensive allergy protection. Our rooftop terrace provides fresh sea breezes and our kitchen specializes in allergen-free Catalan cuisine.",
    amenities: ["Free WiFi", "Rooftop terrace", "Restaurant", "Outdoor pool", "24/7 Front Desk"],
    allergyInfo: {
      certifications: ["fragrance-free", "eco-friendly", "allergen-tested", "hypoallergenic"],
      cleaningProducts: ["Ecodis products", "Steam cleaning", "Natural enzyme cleaners", "Microfiber"],
      roomMaterials: ["Ceramic tile floors (Mediterranean style)", "Organic cotton bedding", "Mineral-based paint", "No carpet", "Natural stone bathrooms"],
      airQuality: ["HEPA filtration", "Sea breeze ventilation (openable windows)", "No air fresheners", "Dehumidifiers (important in Barcelona's humidity)", "Mold prevention treatments"],
      foodOptions: ["Allergen-free Mediterranean cuisine", "Separate allergen-free cooking station", "Fresh seafood with allergen protocols", "Gluten-free paella available", "Organic local produce", "Dairy-free alternatives"],
      emergencyInfo: { nearestHospital: "Hospital Clínic de Barcelona", distanceToHospital: "1.5 km", allergyProtocols: ["Spanish and English allergy protocols", "EpiPens at reception", "Direct coordination with Hospital Clínic allergy dept.", "Guest allergy wristbands available"] },
      specialNotes: "Barcelona's humidity can be challenging for mold-allergic guests. We recommend our upper floor rooms which have better ventilation and lower humidity. The rooftop terrace has naturally lower allergen levels due to open air."
    },
    rooms: [
      { id: "r8-1", name: "Mediterranean Room", maxGuests: 2, pricePerNight: 165, features: ["Double bed", "City view", "Shower"], allergyFeatures: ["HEPA filter", "Ceramic tile floors", "Organic cotton bedding", "Openable windows", "Dehumidifier available"], available: true, image: "from-orange-100 to-amber-100" },
      { id: "r8-2", name: "Sea Breeze Room", maxGuests: 2, pricePerNight: 195, features: ["Queen bed", "Partial sea view", "Balcony"], allergyFeatures: ["HEPA filter", "Ceramic floors", "Organic bedding", "Private balcony for fresh air", "Enhanced dehumidifier"], available: true, image: "from-cyan-50 to-sky-100" },
      { id: "r8-3", name: "Gaudí Suite", maxGuests: 3, pricePerNight: 280, features: ["King bed + sofa bed", "Passeig de Gràcia view", "Separate dining"], allergyFeatures: ["Dual HEPA filtration", "Ceramic throughout", "Premium organic bedding", "Dedicated air purification", "Humidity-controlled environment"], available: true, image: "from-yellow-50 to-orange-100" },
    ],
    reviews: [
      { id: "rv8-1", author: "Carmen R.", date: "2025-11-25", rating: 8, allergyType: "mold", title: "Good mold prevention", content: "Barcelona's humidity usually triggers my mold allergy, but Oasis Libre handles it well with dehumidifiers and good ventilation. The upper floor room was much better than ground level." },
      { id: "rv8-2", author: "David S.", date: "2025-10-18", rating: 9, allergyType: "fragrance", title: "Mediterranean hospitality, allergy-safe", content: "Wonderful staff who really understand allergies. The allergen-free paella was delicious! The rooftop terrace was my favorite spot - fresh air and beautiful views." },
      { id: "rv8-3", author: "Ana B.", date: "2025-09-22", rating: 7, allergyType: "dustMite", title: "Good but ceramic floors are cold", content: "The allergy measures are solid - HEPA filters, organic bedding, no carpet. But the ceramic floors were quite cold in November. Bring slippers! Overall a good experience." },
    ],
    image: "/hotels/barcelona.png",
    gradient: "from-orange-500 to-red-600",
    imageIcon: <Sun className="w-16 h-16 text-white/30" />,
  },
  {
    id: "9",
    name: "Lufthafen Free Frankfurt",
    location: "Hamburger Allee 45, Gutleutviertel",
    city: "Frankfurt",
    country: "Germany",
    stars: 3,
    pricePerNight: 110,
    allergySafetyScore: 7,
    certifications: ["fragrance-free", "allergen-tested"],
    allergies: ["fragrance", "dustMite", "smoke", "petDander"],
    description: "A practical, budget-friendly allergy-safe hotel near Frankfurt Hauptbahnhof. Lufthafen Free offers reliable basic allergy protection at an accessible price, perfect for business travelers or those on a shorter stay who need essential allergy safety features.",
    amenities: ["Free WiFi", "Breakfast", "24/7 Front Desk", "Laundry facilities"],
    allergyInfo: {
      certifications: ["fragrance-free", "allergen-tested"],
      cleaningProducts: ["Frosch products", "Steam cleaning for rooms", "Standard hypoallergenic disinfectants"],
      roomMaterials: ["Laminate floors", "Organic cotton bedding", "Standard low-VOC paint", "Tile bathrooms"],
      airQuality: ["HEPA filters in rooms", "Openable windows", "No air fresheners in rooms"],
      foodOptions: ["Allergen-free bread options at breakfast", "Lactose-free milk available", "Gluten-free cereal", "Fresh fruit"],
      emergencyInfo: { nearestHospital: "Universitätsklinikum Frankfurt", distanceToHospital: "2.0 km", allergyProtocols: ["Basic first aid trained staff", "EpiPens at reception"] },
      specialNotes: "This is a budget option with essential allergy safety measures. For severe or multiple allergies, we recommend our premium partners Pure Air Berlin or Nordic Clean Copenhagen."
    },
    rooms: [
      { id: "r9-1", name: "Free Standard", maxGuests: 2, pricePerNight: 110, features: ["Double bed", "City view", "Shower"], allergyFeatures: ["HEPA filter", "Laminate floors", "Organic cotton bedding", "Openable windows"], available: true, image: "from-gray-50 to-slate-100" },
      { id: "r9-2", name: "Free Business", maxGuests: 1, pricePerNight: 130, features: ["Single bed", "Work desk", "Quiet room"], allergyFeatures: ["HEPA filter", "Laminate floors", "Organic cotton bedding", "Enhanced air filtration"], available: true, image: "from-blue-50 to-sky-100" },
    ],
    reviews: [
      { id: "rv9-1", author: "Frank B.", date: "2025-11-20", rating: 7, allergyType: "fragrance", title: "Basic but reliable", content: "Good for a budget option. No scents in the room, HEPA filter working. The breakfast allergen options are limited but the staff was accommodating." },
      { id: "rv9-2", author: "Sarah T.", date: "2025-10-10", rating: 6, allergyType: "smoke", title: "Smoke-free room but hallway smell", content: "The room itself was fine, but occasionally I could smell smoke from the designated smoking area outside. Not ideal for severe smoke sensitivity." },
    ],
    image: "/hotels/frankfurt.png",
    gradient: "from-gray-500 to-slate-700",
    imageIcon: <Building2 className="w-16 h-16 text-white/30" />,
  },
  {
    id: "10",
    name: "Thermal Safe Budapest",
    location: "Andrássy út 58, Terézváros",
    city: "Budapest",
    country: "Hungary",
    stars: 4,
    pricePerNight: 140,
    allergySafetyScore: 8,
    certifications: ["fragrance-free", "eco-friendly", "allergen-tested", "hypoallergenic"],
    allergies: ["fragrance", "chemical", "dustMite", "mold", "essentialOils", "smoke"],
    description: "Experience Budapest's famous thermal culture in an allergy-safe environment. Thermal Safe Budapest is located on the elegant Andrássy Avenue and offers specially filtered thermal water experiences, fragrance-free spa treatments, and comprehensive room allergy protection.",
    amenities: ["Free WiFi", "Spa (fragrance-free)", "Restaurant", "Thermal bath access", "Breakfast", "24/7 Front Desk"],
    allergyInfo: {
      certifications: ["fragrance-free", "eco-friendly", "allergen-tested", "hypoallergenic"],
      cleaningProducts: ["Ecover Zero", "Hungarian natural cleaning products", "Steam cleaning", "UV-C sanitization"],
      roomMaterials: ["Hardwood floors", "Organic cotton bedding (Hungarian manufacture)", "Low-VOC paint", "No carpet", "Natural stone bathrooms"],
      airQuality: ["HEPA filtration in all rooms", "Openable windows", "No air fresheners", "Thermal spring ventilation component", "Humidity balanced by thermal system"],
      foodOptions: ["Allergen-free Hungarian breakfast", "Gluten-free lángos available", "Dairy-free tokaji wine alternatives", "Organic Hungarian honey and jams", "Separate allergen-free prep area"],
      emergencyInfo: { nearestHospital: "Semmelweis Egyetem Klinikai Központ", distanceToHospital: "1.8 km", allergyProtocols: ["Bilingual protocols (HU/EN)", "EpiPens at reception", "Partnership with Semmelweis allergy clinic", "Allergy alert card system"] },
      specialNotes: "Our spa uses only fragrance-free organic products and filtered thermal water. The thermal experience is excellent for respiratory allergies but please consult your doctor first if you have severe sensitivities to minerals."
    },
    rooms: [
      { id: "r10-1", name: "Thermal Comfort", maxGuests: 2, pricePerNight: 140, features: ["Queen bed", "Avenue view", "Shower"], allergyFeatures: ["HEPA filter", "Hardwood floors", "Organic cotton bedding", "Openable windows"], available: true, image: "from-amber-50 to-yellow-100" },
      { id: "r10-2", name: "Danube View Suite", maxGuests: 3, pricePerNight: 220, features: ["King bed + sofa", "Danube view", "Separate living"], allergyFeatures: ["Enhanced HEPA filtration", "Hardwood throughout", "Premium organic bedding", "Private air purifier", "Thermal spring mineral bath (fragrance-free)"], available: true, image: "from-sky-50 to-blue-100" },
      { id: "r10-3", name: "Heritage Room", maxGuests: 2, pricePerNight: 160, features: ["Queen bed", "Courtyard view", "Period details"], allergyFeatures: ["HEPA filter", "Hardwood floors", "Organic bedding", "Openable windows", "No chemical restoration materials"], available: true, image: "from-rose-50 to-pink-100" },
    ],
    reviews: [
      { id: "rv10-1", author: "Attila N.", date: "2025-12-03", rating: 9, allergyType: "chemical", title: "Thermal water heaven", content: "The fragrance-free thermal spa is incredible. My skin conditions from MCS actually improved during my stay. The filtered thermal water in the room was a lovely touch." },
      { id: "rv10-2", author: "Zsófia K.", date: "2025-11-12", rating: 8, allergyType: "fragrance", title: "Great Budapest stay", content: "Beautiful location on Andrássy Avenue, excellent allergy measures, and the Hungarian breakfast with allergen-free options was delicious. Would recommend." },
      { id: "rv10-3", author: "Peter H.", date: "2025-10-20", rating: 8, allergyType: "mold", title: "Thermal ventilation helps", content: "The thermal ventilation system keeps humidity very well controlled. No mold issues at all, which is impressive for a city with so many older buildings. Good value." },
    ],
    image: "/hotels/budapest.png",
    gradient: "from-amber-500 to-orange-700",
    imageIcon: <Waves className="w-16 h-16 text-white/30" />,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getAllergyById(id: AllergyType): AllergyTypeInfo | undefined {
  return ALLERGY_TYPES.find((a) => a.id === id);
}

function getSafetyColor(score: number): string {
  if (score >= 9) return "bg-emerald-500 text-white";
  if (score >= 7) return "bg-yellow-500 text-white";
  return "bg-red-500 text-white";
}

function getSafetyLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good";
  return "Limited";
}

function formatPrice(price: number): string {
  return `€${price}`;
}

function StarRating({ stars, size = "sm" }: { stars: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

function SafetyScoreBadge({ score }: { score: number }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-bold ${getSafetyColor(score)}`}>
      <ShieldCheck className="w-4 h-4" />
      {score}/10
    </div>
  );
}

// ============================================================
// ICON FIX: MountainSnow and Sun not in lucide-react, use alternatives
// ============================================================
// Already imported - MountainSnow and Sun ARE in lucide-react

// ============================================================
// COMPONENTS
// ============================================================

// --- NAVBAR ---
function Navbar({ onLogoClick }: { onLogoClick: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#003580] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Shield className="w-7 h-7 text-[#f5ba42]" />
            <span className="text-xl font-bold tracking-tight">SafeStay</span>
          </button>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <button className="hover:text-[#f5ba42] transition-colors">Hotels</button>
            <button className="hover:text-[#f5ba42] transition-colors">Allergy Guide</button>
            <button className="hover:text-[#f5ba42] transition-colors">Certifications</button>
            <button className="hover:text-[#f5ba42] transition-colors">Community</button>
            <button className="bg-[#f5ba42] text-[#003580] font-semibold px-4 py-2 rounded hover:bg-[#e5a832] transition-colors">
              Sign In
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button className="block w-full text-left py-2 hover:text-[#f5ba42]">Hotels</button>
            <button className="block w-full text-left py-2 hover:text-[#f5ba42]">Allergy Guide</button>
            <button className="block w-full text-left py-2 hover:text-[#f5ba42]">Certifications</button>
            <button className="block w-full text-left py-2 hover:text-[#f5ba42]">Community</button>
            <button className="block w-full bg-[#f5ba42] text-[#003580] font-semibold px-4 py-2 rounded mt-2">
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// --- HERO SECTION ---
function HeroSection({ onSearch }: { onSearch: (destination: string, allergies: AllergyType[]) => void }) {
  const [destination, setDestination] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState<AllergyType[]>([]);
  const [showAllergyPicker, setShowAllergyPicker] = useState(false);

  const toggleAllergy = (id: AllergyType) => {
    setSelectedAllergies((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    onSearch(destination, selectedAllergies);
  };

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="relative text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003580] via-[#004a9f] to-[#00264d]" />
        <div className="absolute inset-0 opacity-20">
          <img src="/hotels/hero.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Find Your <span className="text-[#f5ba42]">Safe</span> Stay
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              The first booking platform designed specifically for travelers with allergies.
              Certified allergy-safe hotels across Europe.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-t-lg p-4 sm:p-6 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
                {/* Destination */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Destination
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2.5 focus-within:border-[#003580] focus-within:ring-1 focus-within:ring-[#003580]">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="City or hotel name"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Check-in Date
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2.5 focus-within:border-[#003580] focus-within:ring-1 focus-within:ring-[#003580]">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="date"
                      className="w-full outline-none text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Check-out Date
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2.5 focus-within:border-[#003580] focus-within:ring-1 focus-within:ring-[#003580]">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="date"
                      className="w-full outline-none text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Guests
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2.5">
                    <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <select className="w-full outline-none text-sm text-gray-900 bg-transparent">
                      <option>1</option>
                      <option>2</option>
                      <option selected>3</option>
                      <option>4</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergy Profile Bar */}
            <div className="bg-[#00264d] rounded-b-lg p-4 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={() => setShowAllergyPicker(!showAllergyPicker)}
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors flex-shrink-0"
                >
                  <Shield className="w-5 h-5 text-[#f5ba42]" />
                  <span className="font-semibold text-sm">
                    Allergy Profile {selectedAllergies.length > 0 && `(${selectedAllergies.length} selected)`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAllergyPicker ? "rotate-180" : ""}`} />
                </button>

                <div className="flex-1 w-full">
                  {selectedAllergies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedAllergies.map((id) => {
                        const allergy = getAllergyById(id);
                        return allergy ? (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 bg-[#f5ba42]/20 text-[#f5ba42] px-2.5 py-1 rounded-full text-xs font-medium border border-[#f5ba42]/30"
                          >
                            {allergy.icon}
                            {allergy.label}
                            <button
                              onClick={() => toggleAllergy(id)}
                              className="ml-0.5 hover:bg-[#f5ba42]/30 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {showAllergyPicker && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
                      {ALLERGY_TYPES.map((allergy) => (
                        <button
                          key={allergy.id}
                          onClick={() => toggleAllergy(allergy.id)}
                          className={`flex items-start gap-2 p-2.5 rounded-lg text-left transition-all text-sm ${
                            selectedAllergies.includes(allergy.id)
                              ? "bg-[#f5ba42]/20 border border-[#f5ba42]/40"
                              : "hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className={`mt-0.5 flex-shrink-0 ${selectedAllergies.includes(allergy.id) ? "text-[#f5ba42]" : "text-white/50"}`}>
                            {allergy.icon}
                          </div>
                          <div>
                            <div className={`font-medium ${selectedAllergies.includes(allergy.id) ? "text-[#f5ba42]" : "text-white/80"}`}>
                              {allergy.label}
                            </div>
                            <div className="text-white/40 text-xs">{allergy.germanLabel}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSearch}
                  className="flex-shrink-0 bg-[#f5ba42] hover:bg-[#e5a832] text-[#003580] font-bold px-6 sm:px-8 py-3 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 40C1248 36.7 1344 33.3 1392 31.7L1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-white py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "500+", label: "Certified Hotels" },
              { number: "50K+", label: "Safe Stays" },
              { number: "9 Types", label: "Allergies Covered" },
              { number: "4.8/5", label: "Guest Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-[#003580]">{stat.number}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
            How SafeStay Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "1. Set Your Allergy Profile",
                desc: "Select your specific allergies and sensitivities. We use this to match you with truly safe accommodations.",
              },
              {
                icon: <Search className="w-8 h-8" />,
                title: "2. Find Certified Hotels",
                desc: "Browse hotels with verified allergy certifications, detailed safety scores, and transparent allergen information.",
              },
              {
                icon: <Check className="w-8 h-8" />,
                title: "3. Book with Confidence",
                desc: "Every listing includes detailed allergy protocols, materials used, and reviews from guests with similar allergies.",
              },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#003580]/10 text-[#003580] mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Hotels */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Top-Rated Allergy-Safe Hotels
          </h2>
          <p className="text-center text-gray-500 mb-8">Vetted and certified by our allergy specialists</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOTELS.filter((h) => h.allergySafetyScore >= 9).slice(0, 3).map((hotel) => (
              <FeaturedHotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </div>

      {/* Allergy Types Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
            Allergies We Cover
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Including conditions that aren&apos;t always medically recognized
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALLERGY_TYPES.map((allergy) => (
              <div
                key={allergy.id}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#003580]/10 text-[#003580] rounded-lg">
                    {allergy.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{allergy.label}</div>
                    <div className="text-xs text-gray-400">{allergy.germanLabel}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{allergy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#00264d] text-white/70 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#f5ba42]" />
                <span className="font-bold text-white">SafeStay</span>
              </div>
              <p className="text-xs leading-relaxed">
                The first booking platform designed specifically for travelers with allergies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Company</h4>
              <div className="space-y-2 text-xs">
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Careers</div>
                <div className="hover:text-white cursor-pointer">Press</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Resources</h4>
              <div className="space-y-2 text-xs">
                <div className="hover:text-white cursor-pointer">Allergy Guide</div>
                <div className="hover:text-white cursor-pointer">Certifications</div>
                <div className="hover:text-white cursor-pointer">Partner Hotels</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Support</h4>
              <div className="space-y-2 text-xs">
                <div className="hover:text-white cursor-pointer">Help Center</div>
                <div className="hover:text-white cursor-pointer">Contact Us</div>
                <div className="hover:text-white cursor-pointer">Privacy Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs">
            © 2025 SafeStay. All rights reserved. Making travel safe for everyone.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeaturedHotelCard({ hotel, onClick }: { hotel: Hotel; onClick?: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer" onClick={onClick}>
      <div className="h-44 relative overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 right-3">
          <SafetyScoreBadge score={hotel.allergySafetyScore} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{hotel.name}</h3>
          <StarRating stars={hotel.stars} size="sm" />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="w-3 h-3" />
          {hotel.city}, {hotel.country}
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {hotel.allergies.slice(0, 3).map((a) => {
            const info = getAllergyById(a);
            return info ? (
              <span key={a} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">
                {info.icon}
                <span className="hidden sm:inline">{info.label}</span>
                <span className="sm:hidden">{info.germanLabel}</span>
              </span>
            ) : null;
          })}
          {hotel.allergies.length > 3 && (
            <span className="text-xs text-gray-400 px-1">+{hotel.allergies.length - 3}</span>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatPrice(hotel.pricePerNight)}</span>
            <span className="text-xs text-gray-500">/night</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{(hotel.reviews.reduce((s, r) => s + r.rating, 0) / hotel.reviews.length).toFixed(1)}</span>
            <span>({hotel.reviews.length})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SEARCH RESULTS VIEW ---
function SearchResultsView({
  hotels,
  selectedAllergies,
  onHotelSelect,
  onBack,
}: {
  hotels: Hotel[];
  selectedAllergies: AllergyType[];
  onHotelSelect: (hotel: Hotel) => void;
  onBack: () => void;
}) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [starFilter, setStarFilter] = useState<number>(0);
  const [certFilters, setCertFilters] = useState<Certification[]>([]);
  const [sortBy, setSortBy] = useState<"safety" | "price" | "rating">("safety");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleCert = (cert: Certification) => {
    setCertFilters((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const filteredHotels = useMemo(() => {
    return hotels
      .filter((h) => {
        if (selectedAllergies.length > 0) {
          return selectedAllergies.every((a) => h.allergies.includes(a));
        }
        return true;
      })
      .filter((h) => h.pricePerNight >= priceRange[0] && h.pricePerNight <= priceRange[1])
      .filter((h) => (starFilter > 0 ? h.stars >= starFilter : true))
      .filter((h) => certFilters.length === 0 || certFilters.every((c) => h.certifications.includes(c)))
      .sort((a, b) => {
        if (sortBy === "safety") return b.allergySafetyScore - a.allergySafetyScore;
        if (sortBy === "price") return a.pricePerNight - b.pricePerNight;
        return (b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length) -
               (a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length);
      });
  }, [hotels, selectedAllergies, priceRange, starFilter, certFilters, sortBy]);

  const filterSidebarContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Sort By</h3>
        <div className="space-y-2">
          {[
            { value: "safety" as const, label: "Safety Score" },
            { value: "price" as const, label: "Price: Low to High" },
            { value: "rating" as const, label: "Guest Rating" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="sort"
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value)}
                className="accent-[#003580]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Price Per Night</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>€{priceRange[0]}</span>
          <input
            type="range"
            min={0}
            max={500}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="flex-1 accent-[#003580]"
          />
          <span>€{priceRange[1]}</span>
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Star Rating</h3>
        <div className="space-y-2">
          {[3, 4, 5].map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="stars"
                checked={starFilter === s}
                onChange={() => setStarFilter(s === starFilter ? 0 : s)}
                className="accent-[#003580]"
              />
              <div className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < s - 2 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span>{s}+ Stars</span>
            </label>
          ))}
        </div>
      </div>

      {/* Allergy Certifications */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Certifications</h3>
        <div className="space-y-2">
          {Object.entries(CERTIFICATION_LABELS).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={certFilters.includes(key as Certification)}
                onChange={() => toggleCert(key as Certification)}
                className="accent-[#003580] rounded"
              />
              <span className="text-gray-700">{val.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {selectedAllergies.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Your Allergies</h3>
          <div className="flex flex-wrap gap-1.5">
            {selectedAllergies.map((a) => {
              const info = getAllergyById(a);
              return info ? (
                <span key={a} className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-medium">
                  {info.icon}
                  {info.label}
                </span>
              ) : null;
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">Showing only hotels certified safe for all your allergies</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-[#003580] hover:underline mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {filteredHotels.length} allergy-safe hotel{filteredHotels.length !== 1 ? "s" : ""} found
              </h1>
              {selectedAllergies.length > 0 && (
                <p className="text-sm text-gray-500">
                  Filtered for: {selectedAllergies.map((a) => getAllergyById(a)?.label).join(", ")}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 border border-gray-200 sticky top-20">
              {filterSidebarContent}
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-5 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {filterSidebarContent}
              </div>
            </div>
          )}

          {/* Hotel Cards Grid */}
          <main className="flex-1">
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels match your filters</h3>
                <p className="text-sm text-gray-500">Try adjusting your allergy profile or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={() => onHotelSelect(hotel)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function HotelCard({ hotel, onSelect }: { hotel: Hotel; onSelect: () => void }) {
  const avgRating = hotel.reviews.reduce((s, r) => s + r.rating, 0) / hotel.reviews.length;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
      onClick={onSelect}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-64 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <button
            className="absolute top-3 left-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          {hotel.allergySafetyScore >= 9 && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-[#008009] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" />
                Top Rated
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#003580] transition-colors">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating stars={hotel.stars} />
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>
            <SafetyScoreBadge score={hotel.allergySafetyScore} />
          </div>

          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{hotel.description}</p>

          {/* Allergy Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.certifications.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 bg-[#008009]/10 text-[#008009] px-2 py-0.5 rounded-full text-xs font-medium">
                {CERTIFICATION_LABELS[c].icon}
                {CERTIFICATION_LABELS[c].label}
              </span>
            ))}
          </div>

          {/* Allergies covered */}
          <div className="flex flex-wrap gap-1 mb-3">
            {hotel.allergies.slice(0, 4).map((a) => {
              const info = getAllergyById(a);
              return info ? (
                <span key={a} className="inline-flex items-center gap-0.5 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                  {info.icon}
                  <span className="hidden sm:inline">{info.label}</span>
                </span>
              ) : null;
            })}
            {hotel.allergies.length > 4 && (
              <span className="text-xs text-gray-400">+{hotel.allergies.length - 4} more</span>
            )}
          </div>

          {/* Bottom */}
          <div className="flex items-end justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-xl font-bold text-gray-900">{formatPrice(hotel.pricePerNight)}</span>
                <span className="text-xs text-gray-500">/night</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400">({hotel.reviews.length} reviews)</span>
              </div>
            </div>
            <button className="bg-[#003580] hover:bg-[#00264d] text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HOTEL DETAIL VIEW ---
function HotelDetailView({
  hotel,
  onBack,
  onBook,
}: {
  hotel: Hotel;
  onBack: () => void;
  onBook: (hotel: Hotel, room: RoomType) => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [liked, setLiked] = useState(false);

  const avgRating = hotel.reviews.reduce((s, r) => s + r.rating, 0) / hotel.reviews.length;

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "allergy", label: "Allergy Info" },
    { id: "rooms", label: "Rooms" },
    { id: "reviews", label: "Reviews" },
    { id: "location", label: "Location" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative">
        <div className="h-56 sm:h-72 md:h-80 overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Like button */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow transition-colors"
        >
          <Heart className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
        </button>

        {/* Hotel name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{hotel.name}</h1>
          <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
            <MapPin className="w-4 h-4" />
            {hotel.city}, {hotel.country}
          </div>
        </div>
      </div>

      {/* Hotel Header Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <SafetyScoreBadge score={hotel.allergySafetyScore} />
                <StarRating stars={hotel.stars} size="md" />
              </div>
              <div className="text-sm text-gray-500 mb-2">
                {hotel.location}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{avgRating.toFixed(1)}</span>/10 · {hotel.reviews.length} reviews
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(hotel.pricePerNight)}
                <span className="text-sm font-normal text-gray-500">/night</span>
              </div>
              <div className="text-xs text-gray-400">Taxes & fees included</div>
            </div>
          </div>

          {/* Certifications bar */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {hotel.certifications.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 bg-[#008009]/10 text-[#008009] px-3 py-1.5 rounded-full text-xs font-semibold">
                {CERTIFICATION_LABELS[c].icon}
                {CERTIFICATION_LABELS[c].label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#003580] text-[#003580]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.id === "allergy" && (
                  <span className="ml-1.5 bg-[#008009] text-white text-xs px-1.5 py-0.5 rounded-full">★</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-6 pb-16">
          {activeTab === "overview" && <OverviewTab hotel={hotel} onBook={onBook} />}
          {activeTab === "allergy" && <AllergyTab hotel={hotel} />}
          {activeTab === "rooms" && <RoomsTab hotel={hotel} onBook={onBook} />}
          {activeTab === "reviews" && <ReviewsTab hotel={hotel} />}
          {activeTab === "location" && <LocationTab hotel={hotel} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ hotel, onBook }: { hotel: Hotel; onBook: (h: Hotel, r: RoomType) => void }) {
  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">About this hotel</h2>
        <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {hotel.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <span className="text-[#003580]">{AMENITY_ICONS[amenity] || <Check className="w-4 h-4" />}</span>
              <span className="text-sm text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Allergy Quick Summary */}
      <div className="bg-[#008009]/5 border border-[#008009]/20 rounded-xl p-5">
        <h2 className="text-lg font-bold text-[#008009] mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Allergy Safety Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Safe for:</h3>
            <div className="flex flex-wrap gap-1.5">
              {hotel.allergies.map((a) => {
                const info = getAllergyById(a);
                return info ? (
                  <span key={a} className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    <Check className="w-3 h-3" />
                    {info.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Certifications:</h3>
            <div className="flex flex-wrap gap-1.5">
              {hotel.certifications.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  <Award className="w-3 h-3" />
                  {CERTIFICATION_LABELS[c].label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => document.querySelector('[data-tab="allergy"]')?.dispatchEvent(new MouseEvent('click'))}
          className="mt-3 text-sm text-[#008009] font-semibold hover:underline flex items-center gap-1"
        >
          View detailed allergy information <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Book */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Available Rooms</h2>
        <div className="space-y-3">
          {hotel.rooms.filter(r => r.available).slice(0, 2).map((room) => (
            <div key={room.id} className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{room.name}</h3>
                <p className="text-xs text-gray-500">{room.maxGuests} guests · {room.features.join(", ")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900">{formatPrice(room.pricePerNight)}<span className="text-xs font-normal text-gray-500">/night</span></span>
                <button
                  onClick={() => onBook(hotel, room)}
                  className="bg-[#f5ba42] hover:bg-[#e5a832] text-[#003580] font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AllergyTab({ hotel }: { hotel: Hotel }) {
  const { allergyInfo } = hotel;

  const sections = [
    {
      icon: <Award className="w-5 h-5" />,
      title: "Certifications",
      items: allergyInfo.certifications.map((c) => CERTIFICATION_LABELS[c].label),
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Cleaning Products Used",
      items: allergyInfo.cleaningProducts,
    },
    {
      icon: <DoorOpen className="w-5 h-5" />,
      title: "Room Materials & Furnishings",
      items: allergyInfo.roomMaterials,
    },
    {
      icon: <Fan className="w-5 h-5" />,
      title: "Air Quality Measures",
      items: allergyInfo.airQuality,
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      title: "Food & Dietary Options",
      items: allergyInfo.foodOptions,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#008009]/10 to-emerald-50 rounded-xl p-5 border border-[#008009]/20">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-[#008009]" />
          <h2 className="text-lg font-bold text-gray-900">Allergy Safety Information</h2>
        </div>
        <p className="text-sm text-gray-600">
          Detailed allergy protocols and safety measures for <strong>{hotel.name}</strong>.
          This information is verified by our allergy specialists and updated regularly.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Safety Score:</span>
          <SafetyScoreBadge score={hotel.allergySafetyScore} />
          <span className="text-sm text-gray-500">({getSafetyLabel(hotel.allergySafetyScore)})</span>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 border-b border-gray-200">
            <span className="text-[#003580]">{section.icon}</span>
            <h3 className="font-semibold text-gray-900">{section.title}</h3>
          </div>
          <div className="p-5">
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#008009] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* Emergency Info */}
      <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-red-100 border-b border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-800">Emergency Information</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <Stethoscope className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Nearest Hospital</div>
              <div className="text-sm text-gray-600">{allergyInfo.emergencyInfo.nearestHospital}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Navigation className="w-3 h-3" />
                {allergyInfo.emergencyInfo.distanceToHospital} away
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-2">Allergy Emergency Protocols</div>
            <ul className="space-y-1.5">
              {allergyInfo.emergencyInfo.allergyProtocols.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Special Notes */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Special Notes from the Hotel</h3>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">{allergyInfo.specialNotes}</p>
      </div>

      {/* Guest with similar allergies */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 border-b border-gray-200">
          <MessageSquare className="w-5 h-5 text-[#003580]" />
          <h3 className="font-semibold text-gray-900">What Guests with Similar Allergies Say</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {hotel.reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-sm text-gray-900">{review.author}</span>
                  {review.allergyType && (
                    <span className="ml-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-xs">
                      {getAllergyById(review.allergyType)?.icon}
                      {getAllergyById(review.allergyType)?.label}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <h4 className="font-semibold text-sm text-gray-800 mb-1">{review.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-3">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomsTab({ hotel, onBook }: { hotel: Hotel; onBook: (h: Hotel, r: RoomType) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900">Available Rooms</h2>
      {hotel.rooms.map((room) => (
        <div
          key={room.id}
          className={`bg-white rounded-xl border ${room.available ? "border-gray-200" : "border-gray-100 opacity-60"} overflow-hidden`}
        >
          {/* Room Image Placeholder */}
          <div className={`h-40 bg-gradient-to-r ${room.image} flex items-center justify-center`}>
            <Bed className="w-12 h-12 text-gray-400/50" />
          </div>

          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{room.name}</h3>
                  {!room.available && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      Sold Out
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {room.maxGuests} guests</span>
                  <span>·</span>
                  <span>{room.features.join(" · ")}</span>
                </div>

                {/* Allergy Features */}
                <div>
                  <h4 className="text-xs font-semibold text-[#008009] uppercase tracking-wide mb-1.5">Allergy Features</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {room.allergyFeatures.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 bg-[#008009]/10 text-[#008009] px-2 py-0.5 rounded-full text-xs">
                        <ShieldCheck className="w-3 h-3" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right sm:text-right flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">{formatPrice(room.pricePerNight)}</div>
                <div className="text-xs text-gray-400 mb-3">per night</div>
                {room.available && (
                  <button
                    onClick={() => onBook(hotel, room)}
                    className="bg-[#003580] hover:bg-[#00264d] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors w-full sm:w-auto"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab({ hotel }: { hotel: Hotel }) {
  const [filterAllergy, setFilterAllergy] = useState<AllergyType | "all">("all");

  const filteredReviews = filterAllergy === "all"
    ? hotel.reviews
    : hotel.reviews.filter((r) => r.allergyType === filterAllergy);

  const avgRating = hotel.reviews.reduce((s, r) => s + r.rating, 0) / hotel.reviews.length;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#003580]">{avgRating.toFixed(1)}</div>
            <div className="flex gap-0.5 justify-center mt-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">{hotel.reviews.length} reviews</div>
          </div>
          <div className="flex-1">
            {[10, 8, 6, 4, 2].map((score) => {
              const count = hotel.reviews.filter((r) => r.rating >= score && r.rating < score + 2).length;
              const pct = hotel.reviews.length > 0 ? (count / hotel.reviews.length) * 100 : 0;
              return (
                <div key={score} className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 w-8">{score}-{score + 1}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500">Filter by allergy:</span>
        <button
          onClick={() => setFilterAllergy("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterAllergy === "all"
              ? "bg-[#003580] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Reviews
        </button>
        {(() => {
          const uniqueAllergyTypes = [...new Set(hotel.reviews.map((rv) => rv.allergyType).filter(Boolean) as AllergyType[])];
          return uniqueAllergyTypes.map((aType) => {
            const info = getAllergyById(aType);
            return info ? (
              <button
                key={aType}
                onClick={() => setFilterAllergy(aType)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  filterAllergy === aType
                    ? "bg-[#003580] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {info.icon}
                {info.label}
              </button>
            ) : null;
          });
        })()}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#003580]/10 flex items-center justify-center text-[#003580] font-bold text-sm">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{review.author}</div>
                  <div className="text-xs text-gray-400">{review.date}</div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${getSafetyColor(review.rating)}`}>
                {review.rating}/10
              </div>
            </div>

            {review.allergyType && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {getAllergyById(review.allergyType)?.icon}
                  Guest with {getAllergyById(review.allergyType)?.label}
                </span>
              </div>
            )}

            <h4 className="font-semibold text-sm text-gray-800 mb-1">{review.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationTab({ hotel }: { hotel: Hotel }) {
  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center border border-gray-300">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-[#003580]/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">{hotel.location}</p>
          <p className="text-xs text-gray-400">{hotel.city}, {hotel.country}</p>
        </div>
      </div>

      {/* Nearby Facilities */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Nearby Facilities</h3>
        <div className="space-y-3">
          {[
            { icon: <Stethoscope className="w-5 h-5" />, name: hotel.allergyInfo.emergencyInfo.nearestHospital, distance: hotel.allergyInfo.emergencyInfo.distanceToHospital, type: "Hospital" },
            { icon: <Building2 className="w-5 h-5" />, name: "City Center", distance: "0.5 km", type: "Landmark" },
            { icon: <Navigation className="w-5 h-5" />, name: "Metro Station", distance: "0.3 km", type: "Transport" },
            { icon: <Coffee className="w-5 h-5" />, name: "Allergy-Friendly Café", distance: "0.2 km", type: "Dining" },
            { icon: <Pill className="w-5 h-5" />, name: "24h Pharmacy", distance: "0.4 km", type: "Pharmacy" },
          ].map((facility) => (
            <div key={facility.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg shadow-sm text-[#003580]">{facility.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                <div className="text-xs text-gray-400">{facility.type}</div>
              </div>
              <div className="text-sm text-[#003580] font-medium">{facility.distance}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Full Address
        </h3>
        <p className="text-sm text-blue-800">{hotel.location}</p>
        <p className="text-sm text-blue-600">{hotel.city}, {hotel.country}</p>
      </div>
    </div>
  );
}

// --- BOOKING MODAL ---
function BookingModal({
  hotel,
  room,
  onClose,
}: {
  hotel: Hotel;
  room: RoomType;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"details" | "confirm" | "success">("details");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const numNights = useMemo(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(1, diff);
    }
    return 1;
  }, [checkIn, checkOut]);

  const totalPrice = room.pricePerNight * numNights;
  const serviceFee = Math.round(totalPrice * 0.05);
  const taxes = Math.round(totalPrice * 0.07);
  const grandTotal = totalPrice + serviceFee + taxes;

  const handleConfirm = () => {
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-bold text-lg text-gray-900">
            {step === "success" ? "Booking Confirmed!" : "Complete Your Booking"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "details" && (
          <div className="p-6 space-y-5">
            {/* Hotel summary */}
            <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">{hotel.name}</h3>
                <p className="text-xs text-gray-500">{room.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <SafetyScoreBadge score={hotel.allergySafetyScore} />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-2">Stay Dates</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#003580] focus:ring-1 focus:ring-[#003580]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#003580] focus:ring-1 focus:ring-[#003580]"
                  />
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-2">Guest Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#003580] focus:ring-1 focus:ring-[#003580]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email *</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#003580] focus:ring-1 focus:ring-[#003580]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Phone</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+49 123 456 789"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#003580] focus:ring-1 focus:ring-[#003580]"
                  />
                </div>
              </div>
            </div>

            {/* Special Allergy Requirements */}
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#008009]" />
                Special Allergy Requirements
              </h3>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Describe any special requirements for your stay... (e.g., 'I need a room on the top floor due to mold sensitivity' or 'Please ensure no essential oil diffusers are used in adjacent rooms')"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#003580] focus:ring-1 focus:ring-[#003580] resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">This will be shared with the hotel to prepare your allergy-safe room</p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">Price Breakdown</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{formatPrice(room.pricePerNight)} × {numNights} night{numNights > 1 ? "s" : ""}</span>
                <span className="text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service fee</span>
                <span className="text-gray-900">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & fees</span>
                <span className="text-gray-900">{formatPrice(taxes)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!guestName || !guestEmail || !checkIn || !checkOut}
              className="w-full bg-[#003580] hover:bg-[#00264d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              Confirm Booking — {formatPrice(grandTotal)}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#008009]/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-[#008009]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your allergy-safe stay at <strong>{hotel.name}</strong> has been booked.
              A confirmation email has been sent to <strong>{guestEmail}</strong>.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hotel</span>
                <span className="font-medium text-gray-900">{hotel.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Room</span>
                <span className="font-medium text-gray-900">{room.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-in</span>
                <span className="font-medium text-gray-900">{checkIn}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-out</span>
                <span className="font-medium text-gray-900">{checkOut}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-gray-900">{formatPrice(grandTotal)}</span>
              </div>
              {specialRequests && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs font-semibold text-[#008009] mb-1">Allergy Requirements Noted</div>
                  <p className="text-xs text-gray-600">{specialRequests}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-left mb-6">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-[#008009]" />
                <span className="text-sm font-semibold text-gray-900">Allergy Safety Guarantee</span>
              </div>
              <p className="text-xs text-gray-600">
                If your room does not meet the stated allergy safety standards, contact us within 2 hours of check-in for a full refund and alternative accommodation.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#003580] hover:bg-[#00264d] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function Home() {
  const [currentView, setCurrentView] = useState<View>("hero");
  const [searchResults, setSearchResults] = useState<Hotel[]>(HOTELS);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [selectedAllergies, setSelectedAllergies] = useState<AllergyType[]>([]);

  const handleSearch = useCallback((destination: string, allergies: AllergyType[]) => {
    setSelectedAllergies(allergies);

    let filtered = HOTELS;

    if (destination.trim()) {
      const lower = destination.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(lower) ||
          h.city.toLowerCase().includes(lower) ||
          h.country.toLowerCase().includes(lower) ||
          h.location.toLowerCase().includes(lower)
      );
    }

    if (allergies.length > 0) {
      filtered = filtered.filter((h) =>
        allergies.every((a) => h.allergies.includes(a))
      );
    }

    setSearchResults(filtered);
    setCurrentView("search");
  }, []);

  const handleHotelSelect = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setCurrentView("detail");
  }, []);

  const handleBook = useCallback((hotel: Hotel, room: RoomType) => {
    setSelectedHotel(hotel);
    setSelectedRoom(room);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setSelectedRoom(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onLogoClick={() => setCurrentView("hero")} />

      {currentView === "hero" && (
        <HeroSection onSearch={handleSearch} />
      )}

      {currentView === "search" && (
        <SearchResultsView
          hotels={searchResults}
          selectedAllergies={selectedAllergies}
          onHotelSelect={handleHotelSelect}
          onBack={() => setCurrentView("hero")}
        />
      )}

      {currentView === "detail" && selectedHotel && (
        <HotelDetailView
          hotel={selectedHotel}
          onBack={() => setCurrentView("search")}
          onBook={handleBook}
        />
      )}

      {selectedHotel && selectedRoom && (
        <BookingModal
          hotel={selectedHotel}
          room={selectedRoom}
          onClose={handleCloseBooking}
        />
      )}
    </div>
  );
}
