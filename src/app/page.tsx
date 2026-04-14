"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Gauge, Zap, User, Bike, Globe, Wind, ChevronDown,
  Mountain, Sun, CloudSnow,
  GaugeCircle, ChevronRight, Menu, X, Battery, Cog, Road,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ============================================================
// TYPES
// ============================================================

type RidingMode = "Off" | "Eco" | "Tour" | "eMTB" | "Sport" | "Turbo";
type DriveUnit = "Urban Drive" | "City Drive Plus" | "Performance Line" | "Performance CX" | "Cargo Line" | "Speed Drive";
type BatteryCapacity = 300 | 400 | 500 | 545 | 625 | 750;
type BicycleType = "City Bike" | "Trekking Bike" | "MTB" | "eMTB" | "Road/Gravel" | "Cargo Bike";
type TireType = "Road (slick)" | "City (hybrid)" | "Gravel" | "MTB Cross Country" | "MTB Enduro";
type ShiftingSystem = "Derailleur" | "Hub Gear";
type Terrain = "Flat" | "Slight Inclines" | "Hilly" | "Mountainous";
type RoadSurface = "Good Asphalt" | "Poor Asphalt" | "Gravel/Forest" | "Dirt/Fields" | "Soft Forest";
type WindCondition = "Windless" | "Light Breeze" | "Moderate Wind" | "Very Windy" | "Stormy";
type Season = "Spring" | "Summer" | "Autumn" | "Winter";
type Unit = "km" | "miles";

interface Config {
  speed: number;
  ridingMode: RidingMode;
  weight: number;
  cadence: number;
  driveUnit: DriveUnit;
  battery: BatteryCapacity;
  bikeType: BicycleType;
  tireType: TireType;
  shifting: ShiftingSystem;
  terrain: Terrain;
  surface: RoadSurface;
  wind: WindCondition;
  season: Season;
  stopAndGo: number;
  unit: Unit;
}

// ============================================================
// DEFAULT CONFIG
// ============================================================

const DEFAULT_CONFIG: Config = {
  speed: 25,
  ridingMode: "Eco",
  weight: 100,
  cadence: 75,
  driveUnit: "Performance Line",
  battery: 500,
  bikeType: "Trekking Bike",
  tireType: "City (hybrid)",
  shifting: "Derailleur",
  terrain: "Flat",
  surface: "Good Asphalt",
  wind: "Light Breeze",
  season: "Summer",
  stopAndGo: 2,
  unit: "km",
};

// ============================================================
// OPTIONS DATA
// ============================================================

const DRIVE_UNITS: { id: DriveUnit; icon: React.ReactNode; desc: string }[] = [
  { id: "Urban Drive", icon: <CityIcon />, desc: "Urban" },
  { id: "City Drive Plus", icon: <BuildingIcon />, desc: "City+" },
  { id: "Performance Line", icon: <Zap className="w-4 h-4" />, desc: "Perf." },
  { id: "Performance CX", icon: <BoltIcon />, desc: "Perf CX" },
  { id: "Cargo Line", icon: <CargoIcon />, desc: "Cargo" },
  { id: "Speed Drive", icon: <SpeedIcon />, desc: "Speed" },
];

const BATTERY_OPTIONS: BatteryCapacity[] = [300, 400, 500, 545, 625, 750];
const BICYCLE_TYPES: { id: BicycleType; emoji: string }[] = [
  { id: "City Bike", emoji: "🏙️" },
  { id: "Trekking Bike", emoji: "🚴" },
  { id: "MTB", emoji: "⛰️" },
  { id: "eMTB", emoji: "🏔️" },
  { id: "Road/Gravel", emoji: "🏁" },
  { id: "Cargo Bike", emoji: "📦" },
];

const TIRE_TYPES: { id: TireType; emoji: string }[] = [
  { id: "Road (slick)", emoji: "🛣️" },
  { id: "City (hybrid)", emoji: "🏘️" },
  { id: "Gravel", emoji: "🪨" },
  { id: "MTB Cross Country", emoji: "🌲" },
  { id: "MTB Enduro", emoji: "🏔️" },
];

const TERRAIN_OPTIONS: { id: Terrain; emoji: string }[] = [
  { id: "Flat", emoji: "━" },
  { id: "Slight Inclines", emoji: "╱" },
  { id: "Hilly", emoji: "\/\/" },
  { id: "Mountainous", emoji: "⌄⌄" },
];

const SURFACE_OPTIONS: { id: RoadSurface; emoji: string }[] = [
  { id: "Good Asphalt", emoji: "✨" },
  { id: "Poor Asphalt", emoji: "🔸" },
  { id: "Gravel/Forest", emoji: "🪨" },
  { id: "Dirt/Fields", emoji: "🌾" },
  { id: "Soft Forest", emoji: "🌿" },
];

const WIND_OPTIONS: { id: WindCondition; emoji: string }[] = [
  { id: "Windless", emoji: "😌" },
  { id: "Light Breeze", emoji: "🍃" },
  { id: "Moderate Wind", emoji: "💨" },
  { id: "Very Windy", emoji: "🌀" },
  { id: "Stormy", emoji: "🌪️" },
];

const SEASON_OPTIONS: { id: Season; emoji: string; color: string }[] = [
  { id: "Spring", emoji: "🌸", color: "text-pink-500" },
  { id: "Summer", emoji: "☀️", color: "text-amber-500" },
  { id: "Autumn", emoji: "🍂", color: "text-orange-500" },
  { id: "Winter", emoji: "❄️", color: "text-blue-400" },
];

const RIDING_MODES: { id: RidingMode; color: string; power: number }[] = [
  { id: "Off", color: "bg-gray-400", power: 0 },
  { id: "Eco", color: "bg-green-500", power: 50 },
  { id: "Tour", color: "bg-emerald-500", power: 65 },
  { id: "eMTB", color: "bg-cyan-500", power: 80 },
  { id: "Sport", color: "bg-orange-500", power: 90 },
  { id: "Turbo", color: "bg-red-500", power: 100 },
];

const STOP_GO_LABELS = ["Rarely", "Occasionally", "Sometimes", "Frequently", "Very frequently"];

// ============================================================
// MINI ICON COMPONENTS
// ============================================================

function CityIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="8" width="6" height="12" rx="1" />
      <rect x="10" y="4" width="6" height="16" rx="1" />
      <rect x="17" y="6" width="6" height="14" rx="1" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
    </svg>
  );
}

function CargoIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="6" width="22" height="12" rx="2" />
      <circle cx="6" cy="20" r="2" />
      <circle cx="18" cy="20" r="2" />
      <line x1="8" y1="6" x2="8" y2="20" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h7l-2 8 9-12h-7l2-8z" />
      <line x1="20" y1="8" x2="20" y2="14" />
    </svg>
  );
}

// ============================================================
// CUSTOM SLIDER COMPONENT
// ============================================================

function SVSlider({
  value,
  onChange,
  min,
  max,
  step,
  label,
  unit,
  hint,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit: string;
  hint?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const pct = ((value - min) / (max - min)) * 100;

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clickPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      let rawVal = min + clickPct * (max - min);
      rawVal = Math.round(rawVal / step) * step;
      onChange(Math.max(min, Math.min(max, rawVal)));
    },
    [min, max, step, onChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clickPct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      let rawVal = min + clickPct * (max - min);
      rawVal = Math.round(rawVal / step) * step;
      onChange(Math.max(min, Math.min(max, rawVal)));
    },
    [dragging, min, max, step, onChange]
  );

  const handleMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-[#1A1A2E]">{label}</label>
        <span className="text-sm font-bold text-[#0D4F4F]">
          {value} {unit}
        </span>
      </div>
      <div
        ref={trackRef}
        className="sv-slider-track cursor-pointer relative h-2 rounded-full bg-[#e2e8f0] w-full"
        onClick={handleTrackClick}
        onMouseDown={() => setDragging(true)}
      >
        <div className="sv-slider-fill absolute top-0 left-0 h-full rounded-full" style={{ width: `${pct}%` }} />
        <div
          className="sv-slider-thumb absolute top-1/2 -translate-y-1/2 z-10"
          style={{ left: `calc(${pct}% - 11px)` }}
        />
      </div>
      {hint && <p className="text-xs text-[#64748b] mt-1.5">{hint}</p>}
    </div>
  );
}

// ============================================================
// SELECT CARD COMPONENT
// ============================================================

function SelectCard({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`sv-select-card ${active ? "active" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ============================================================
// RANGE CALCULATION ALGORITHM
// ============================================================

function calculateRange(config: Config): number {
  const {
    speed, ridingMode, weight, cadence,
    driveUnit, battery, bikeType, tireType, shifting,
    terrain, surface, wind, season, stopAndGo, unit,
  } = config;

  // Motor base consumption (Wh/km)
  const motorEfficiency: Record<DriveUnit, number> = {
    "Urban Drive": 6.5,
    "City Drive Plus": 7.0,
    "Performance Line": 7.5,
    "Performance CX": 8.5,
    "Cargo Line": 9.0,
    "Speed Drive": 8.0,
  };

  // Riding mode multiplier on consumption
  const modeMultiplier: Record<RidingMode, number> = {
    "Off": 0,
    "Eco": 0.6,
    "Tour": 0.8,
    "eMTB": 1.0,
    "Sport": 1.2,
    "Turbo": 1.5,
  };

  if (ridingMode === "Off") return 0;

  const baseConsumption = motorEfficiency[driveUnit];

  // Weight factor (normalized to 100kg = 1.0)
  const weightFactor = 0.7 + 0.006 * weight; // 100kg → 1.3, 70kg → 1.12, 150kg → 1.6

  // Speed factor (exponential - air resistance)
  const speedFactor = Math.pow(speed / 25, 1.8); // 25km/h → 1.0

  // Terrain factor
  const terrainFactor: Record<Terrain, number> = {
    "Flat": 1.0,
    "Slight Inclines": 1.15,
    "Hilly": 1.35,
    "Mountainous": 1.65,
  };

  // Surface factor
  const surfaceFactor: Record<RoadSurface, number> = {
    "Good Asphalt": 1.0,
    "Poor Asphalt": 1.08,
    "Gravel/Forest": 1.2,
    "Dirt/Fields": 1.35,
    "Soft Forest": 1.5,
  };

  // Wind factor
  const windFactor: Record<WindCondition, number> = {
    "Windless": 1.0,
    "Light Breeze": 1.08,
    "Moderate Wind": 1.2,
    "Very Windy": 1.38,
    "Stormy": 1.55,
  };

  // Season/temperature factor
  const seasonFactor: Record<Season, number> = {
    "Spring": 1.0,
    "Summer": 0.95, // optimal temperature
    "Autumn": 1.05,
    "Winter": 1.25, // cold reduces battery capacity
  };

  // Cadence factor (optimal around 80)
  const cadenceDeviation = Math.abs(cadence - 80) / 80;
  const cadenceFactor = 1 + cadenceDeviation * 0.15;

  // Stop-and-go factor
  const stopGoFactor = 1 + (stopAndGo - 1) * 0.08;

  // Tire type factor
  const tireFactor: Record<TireType, number> = {
    "Road (slick)": 1.0,
    "City (hybrid)": 1.06,
    "Gravel": 1.15,
    "MTB Cross Country": 1.22,
    "MTB Enduro": 1.35,
  };

  // Shifting factor
  const shiftingFactor = shifting === "Hub Gear" ? 1.05 : 1.0;

  // Bike type aerodynamics
  const bikeAeroFactor: Record<BicycleType, number> = {
    "City Bike": 1.12,
    "Trekking Bike": 1.06,
    "MTB": 1.15,
    "eMTB": 1.18,
    "Road/Gravel": 0.95,
    "Cargo Bike": 1.25,
  };

  // Total consumption per km
  const totalConsumption =
    baseConsumption *
    modeMultiplier[ridingMode] *
    weightFactor *
    speedFactor *
    terrainFactor[terrain] *
    surfaceFactor[surface] *
    windFactor[wind] *
    seasonFactor[season] *
    cadenceFactor *
    stopGoFactor *
    tireFactor[tireType] *
    shiftingFactor *
    bikeAeroFactor[bikeType];

  // Range in km
  let rangeKm = battery / totalConsumption;

  // Convert to miles if needed
  if (unit === "miles") {
    rangeKm = rangeKm * 0.621371;
  }

  return Math.round(Math.max(0, rangeKm));
}

// ============================================================
// RIDER VISUALIZATION
// ============================================================

// Deterministic pseudo-random values based on index (avoids Math.random in render)
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const WIND_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  top: 15 + pseudoRandom(i * 3) * 60,
  delay: i * 0.3 + pseudoRandom(i * 3 + 1) * 0.5,
  duration: 1.5 + pseudoRandom(i * 3 + 2) * 1.5,
}));

const SNOW_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  left: 5 + pseudoRandom(i * 4 + 100) * 90,
  delay: i * 0.4 + pseudoRandom(i * 4 + 101) * 2,
  duration: 3 + pseudoRandom(i * 4 + 102) * 3,
  size: 8 + pseudoRandom(i * 4 + 103) * 8,
}));

const LEAF_PARTICLES = Array.from({ length: 5 }, (_, i) => ({
  left: 10 + pseudoRandom(i * 3 + 200) * 80,
  delay: i * 0.6 + pseudoRandom(i * 3 + 201) * 2,
  duration: 4 + pseudoRandom(i * 3 + 202) * 3,
  emoji: ["🍂", "🍁", "🍃"][i % 3],
}));

function RiderVisualization({ config }: { config: Config }) {
  const { wind, season, ridingMode, terrain } = config;
  const pedalClass =
    ridingMode === "Off"
      ? ""
      : ridingMode === "Eco"
        ? "pedal-eco"
        : ridingMode === "Tour"
          ? "pedal-tour"
          : ridingMode === "eMTB"
            ? "pedal-emtb"
            : ridingMode === "Sport"
              ? "pedal-sport"
              : "pedal-turbo";

  const terrainClass =
    terrain === "Flat"
      ? "terrain-flat"
      : terrain === "Slight Inclines"
        ? "terrain-slight"
        : terrain === "Hilly"
          ? "terrain-hilly"
          : "terrain-mountain";

  const seasonClass =
    season === "Spring"
      ? "season-spring"
      : season === "Summer"
        ? "season-summer"
        : season === "Autumn"
          ? "season-autumn"
          : "season-winter";

  const windLevel =
    wind === "Windless"
      ? 0
      : wind === "Light Breeze"
        ? 2
        : wind === "Moderate Wind"
          ? 4
          : wind === "Very Windy"
            ? 6
            : 8;

  const isWinter = season === "Winter";
  const isAutumn = season === "Autumn";

  return (
    <div className={`relative w-full h-48 md:h-64 rounded-2xl overflow-hidden ${terrainClass} ${seasonClass} bg-gradient-to-b from-sky-100 to-white`}>
      {/* Sky gradient based on season */}
      <div className="absolute inset-0 pointer-events-none">
        {isWinter && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-200/40 to-blue-100/20" />
        )}
        {season === "Summer" && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 to-transparent" />
        )}
      </div>

      {/* Sun/Moon */}
      <div className="absolute top-4 right-6">
        {season === "Winter" ? (
          <CloudSnow className="w-8 h-8 text-blue-300/60" />
        ) : (
          <Sun className="w-8 h-8 text-amber-400/70" />
        )}
      </div>

      {/* Wind particles */}
      {windLevel > 0 && WIND_PARTICLES.slice(0, windLevel).map((p, i) => (
        <div
          key={`wind-${i}`}
          className="wind-particle"
          style={{
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${20 + windLevel * 3}px`,
          }}
        />
      ))}

      {/* Snow particles */}
      {isWinter && SNOW_PARTICLES.map((p, i) => (
        <div
          key={`snow-${i}`}
          className="snowflake"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
          }}
        >
          ❄
        </div>
      ))}

      {/* Leaf particles */}
      {isAutumn && LEAF_PARTICLES.map((p, i) => (
        <div
          key={`leaf-${i}`}
          className="leaf-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Rider image */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 ${pedalClass}`}>
        <img
          src="/smartvelo/rider.png"
          alt="eBike Rider"
          className="h-28 md:h-36 object-contain drop-shadow-lg"
          draggable={false}
        />
      </div>

      {/* Ground line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0D4F4F]/30 to-transparent" />

      {/* Mode indicator */}
      <div className="absolute bottom-2 right-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${RIDING_MODES.find(m => m.id === ridingMode)?.color || "bg-gray-400"}`}
        >
          {ridingMode}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function SmartVeloPage() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("rider");
  const calcRef = useRef<HTMLDivElement>(null);

  const updateConfig = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const range = useMemo(() => calculateRange(config), [config]);

  const scrollToCalc = useCallback(() => {
    calcRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Gauge calculation
  const maxRange = 250;
  const gaugePct = Math.min((range / maxRange) * 100, 100);
  const gaugeCircumference = 2 * Math.PI * 70; // radius=70
  const gaugeOffset = gaugeCircumference - (gaugePct / 100) * gaugeCircumference;

  // Previous range for animation
  const [displayRange, setDisplayRange] = useState(range);
  useEffect(() => {
    const timer = setTimeout(() => setDisplayRange(range), 50);
    return () => clearTimeout(timer);
  }, [range]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ====== NAVIGATION BAR ====== */}
      <nav className="sticky top-0 z-50 bg-[#0D4F4F] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/smartvelo/logo.png"
                alt="SmartVelo"
                className="h-9 w-auto"
                draggable={false}
              />
              <span className="text-xl font-bold tracking-tight hidden sm:inline">
                Smart<span className="text-[#00E676]">Velo</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Range Assistant", href: "#calculator" },
                { label: "About", href: "#how-it-works" },
                { label: "Fleet", href: "#fleet" },
                { label: "Contact", href: "#contact" },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-[#00E676] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0D4F4F]/95 border-t border-white/10">
            <div className="px-4 py-3 space-y-2">
              {[
                { label: "Range Assistant", href: "#calculator" },
                { label: "About", href: "#how-it-works" },
                { label: "Fleet", href: "#fleet" },
                { label: "Contact", href: "#contact" },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm text-white/80 hover:text-[#00E676] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ====== HERO SECTION ====== */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[500px]">
          <img
            src="/smartvelo/hero.png"
            alt="SmartVelo eBike"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D4F4F]/70 via-[#0D4F4F]/50 to-[#0D4F4F]/80" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Range <span className="text-[#00E676]">Assistant</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-8">
              Calculate how far your e-bike can take you. Customize your riding profile and get a precise range estimate.
            </p>
            <button
              onClick={scrollToCalc}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00E676] hover:bg-[#00C853] text-[#0D4F4F] font-bold rounded-full transition-all hover:shadow-lg hover:shadow-[#00E676]/25 hover:scale-105 active:scale-95"
            >
              Start Calculating
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ====== RANGE CALCULATOR SECTION ====== */}
      <section id="calculator" ref={calcRef} className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* ====== LEFT SIDE: Result + Quick Controls ====== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Range Gauge Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Gauge className="w-5 h-5 text-[#0D4F4F]" />
                <h2 className="text-lg font-bold text-[#0D4F4F]">Estimated Range</h2>
              </div>

              {/* Circular Gauge */}
              <div className="flex justify-center mb-4">
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    {/* Background circle */}
                    <circle
                      cx="80" cy="80" r="70"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    {/* Filled circle */}
                    <circle
                      cx="80" cy="80" r="70"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={gaugeCircumference}
                      strokeDashoffset={gaugeOffset}
                      className="transition-all duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0D4F4F" />
                        <stop offset="100%" stopColor="#00E676" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      key={displayRange}
                      className="text-4xl md:text-5xl font-extrabold text-[#0D4F4F] range-number-animate"
                    >
                      {displayRange}
                    </span>
                    <span className="text-sm text-[#64748b] font-medium mt-1">
                      {config.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Unit Toggle */}
              <div className="flex justify-center mb-2">
                <div className="inline-flex items-center bg-[#F5F7FA] rounded-full p-1">
                  <button
                    onClick={() => updateConfig("unit", "km")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${config.unit === "km" ? "bg-[#0D4F4F] text-white shadow-sm" : "text-[#64748b] hover:text-[#0D4F4F]"}`}
                  >
                    km
                  </button>
                  <button
                    onClick={() => updateConfig("unit", "miles")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${config.unit === "miles" ? "bg-[#0D4F4F] text-white shadow-sm" : "text-[#64748b] hover:text-[#0D4F4F]"}`}
                  >
                    miles
                  </button>
                </div>
              </div>

              {config.ridingMode === "Off" && (
                <p className="text-center text-sm text-orange-500 font-medium mt-2">
                  Motor is off — pedal power only
                </p>
              )}
            </div>

            {/* Average Speed Slider */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
              <div className="flex items-center gap-2 mb-4">
                <GaugeCircle className="w-5 h-5 text-[#0D4F4F]" />
                <h3 className="text-sm font-bold text-[#0D4F4F]">Average Speed</h3>
              </div>
              <SVSlider
                value={config.speed}
                onChange={(v) => updateConfig("speed", v)}
                min={15}
                max={45}
                step={1}
                label="Speed"
                unit="km/h"
              />
            </div>

            {/* Riding Mode Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[#0D4F4F]" />
                <h3 className="text-sm font-bold text-[#0D4F4F]">Riding Mode</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {RIDING_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => updateConfig("ridingMode", mode.id)}
                    className={`relative flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all border-2 ${
                      config.ridingMode === mode.id
                        ? "border-[#00E676] bg-[#00E676]/10 text-[#0D4F4F]"
                        : "border-[#e2e8f0] text-[#64748b] hover:border-[#00BCD4] hover:text-[#0D4F4F]"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${mode.color} ${config.ridingMode === mode.id ? "ring-2 ring-[#00E676]/40" : ""}`} />
                    {mode.id}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#64748b]">
                <span>Less power</span>
                <span>More power</span>
              </div>
            </div>

            {/* Rider Visualization */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-4 overflow-hidden">
              <RiderVisualization config={config} />
            </div>
          </div>

          {/* ====== RIGHT SIDE: Tabbed Configuration ====== */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-4 md:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Tab Headers */}
                <TabsList className="w-full mb-6 bg-[#F5F7FA] rounded-xl p-1">
                  <TabsTrigger value="rider" className="flex-1 flex items-center justify-center gap-2 rounded-lg text-sm py-2.5">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Rider</span>
                  </TabsTrigger>
                  <TabsTrigger value="ebike" className="flex-1 flex items-center justify-center gap-2 rounded-lg text-sm py-2.5">
                    <Bike className="w-4 h-4" />
                    <span className="hidden sm:inline">eBike</span>
                  </TabsTrigger>
                  <TabsTrigger value="environment" className="flex-1 flex items-center justify-center gap-2 rounded-lg text-sm py-2.5">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">Environment</span>
                  </TabsTrigger>
                </TabsList>

                {/* ===== RIDER TAB ===== */}
                <TabsContent value="rider">
                  <div className="space-y-8">
                    {/* Total Weight */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#0D4F4F]/10 flex items-center justify-center">
                          <span className="text-base">⚖️</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1A1A2E]">Total Weight</h4>
                          <p className="text-xs text-[#64748b]">Rider + bike + cargo</p>
                        </div>
                      </div>
                      <SVSlider
                        value={config.weight}
                        onChange={(v) => updateConfig("weight", v)}
                        min={50}
                        max={200}
                        step={1}
                        label="Total weight"
                        unit="kg"
                      />
                      <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
                        <span>50 kg (light rider)</span>
                        <span>200 kg (heavy cargo)</span>
                      </div>
                    </div>

                    {/* Cadence */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#00E676]/10 flex items-center justify-center">
                          <span className="text-base">🚴</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1A1A2E]">Cadence</h4>
                          <p className="text-xs text-[#64748b]">Pedaling cadence</p>
                        </div>
                      </div>
                      <SVSlider
                        value={config.cadence}
                        onChange={(v) => updateConfig("cadence", v)}
                        min={40}
                        max={120}
                        step={5}
                        label="Cadence"
                        unit="RPM"
                        hint="Most riders average 70-90 RPM. Optimal efficiency is around 80 RPM."
                      />
                      <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
                        <span>40 RPM</span>
                        <span>120 RPM</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* ===== eBIKE TAB ===== */}
                <TabsContent value="ebike">
                  <div className="space-y-6">
                    {/* Drive Unit */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Cog className="w-4 h-4 text-[#0D4F4F]" />
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Drive Unit / Motor</h4>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {DRIVE_UNITS.map(du => (
                          <SelectCard
                            key={du.id}
                            active={config.driveUnit === du.id}
                            onClick={() => updateConfig("driveUnit", du.id)}
                          >
                            <div className="flex flex-col items-center gap-1.5 py-1">
                              <span className="text-[#0D4F4F]">{du.icon}</span>
                              <span className="text-[10px] sm:text-xs leading-tight">{du.desc}</span>
                            </div>
                          </SelectCard>
                        ))}
                      </div>
                    </div>

                    {/* Battery Capacity */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Battery className="w-4 h-4 text-[#0D4F4F]" />
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Battery Capacity</h4>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {BATTERY_OPTIONS.map(wh => (
                          <SelectCard
                            key={wh}
                            active={config.battery === wh}
                            onClick={() => updateConfig("battery", wh as BatteryCapacity)}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs sm:text-sm font-bold">{wh}</span>
                              <span className="text-[10px] text-[#64748b]">Wh</span>
                            </div>
                          </SelectCard>
                        ))}
                      </div>
                    </div>

                    {/* Bicycle Type */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Bike className="w-4 h-4 text-[#0D4F4F]" />
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Bicycle Type</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BICYCLE_TYPES.map(bt => (
                          <SelectCard
                            key={bt.id}
                            active={config.bikeType === bt.id}
                            onClick={() => updateConfig("bikeType", bt.id)}
                          >
                            <span className="mr-1.5">{bt.emoji}</span>
                            {bt.id}
                          </SelectCard>
                        ))}
                      </div>
                    </div>

                    {/* Tire Type */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Road className="w-4 h-4 text-[#0D4F4F]" />
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Tire Type</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TIRE_TYPES.map(tt => (
                          <SelectCard
                            key={tt.id}
                            active={config.tireType === tt.id}
                            onClick={() => updateConfig("tireType", tt.id)}
                          >
                            <span className="mr-1.5">{tt.emoji}</span>
                            <span className="text-xs">{tt.id}</span>
                          </SelectCard>
                        ))}
                      </div>
                    </div>

                    {/* Shifting System */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">⚙️</span>
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Shifting System</h4>
                      </div>
                      <div className="flex gap-2">
                        {(["Derailleur", "Hub Gear"] as ShiftingSystem[]).map(s => (
                          <button
                            key={s}
                            onClick={() => updateConfig("shifting", s)}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                              config.shifting === s
                                ? "border-[#00E676] bg-[#00E676]/10 text-[#0D4F4F]"
                                : "border-[#e2e8f0] text-[#64748b] hover:border-[#00BCD4]"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-[#94a3b8] mt-2">Hub gears are slightly less efficient but require less maintenance</p>
                    </div>
                  </div>
                </TabsContent>

                {/* ===== ENVIRONMENT TAB ===== */}
                <TabsContent value="environment">
                  <div className="space-y-6">
                    {/* Terrain */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Mountain className="w-4 h-4 text-[#0D4F4F]" />
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Terrain</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TERRAIN_OPTIONS.map(t => (
                          <SelectCard
                            key={t.id}
                            active={config.terrain === t.id}
                            onClick={() => updateConfig("terrain", t.id)}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-lg font-mono text-[#0D4F4F]">{t.emoji}</span>
                              <span className="text-xs">{t.id}</span>
                            </div>
                          </SelectCard>
                        ))}
                      </div>
                    </div>

                    {/* Road Surface */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Road className="w-4 h-4 text-[#0D4F4F]" />
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Road Surface</h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SURFACE_OPTIONS.map(s => (
                          <SelectCard
                            key={s.id}
                            active={config.surface === s.id}
                            onClick={() => updateConfig("surface", s.id)}
                          >
                            <span className="mr-1">{s.emoji}</span>
                            <span className="text-xs">{s.id}</span>
                          </SelectCard>
                        ))}
                      </div>
                    </div>

                    {/* Wind */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Wind className="w-4 h-4 text-[#0D4F4F]" />
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Wind Conditions</h4>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {WIND_OPTIONS.map(w => (
                          <SelectCard
                            key={w.id}
                            active={config.wind === w.id}
                            onClick={() => updateConfig("wind", w.id)}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-base">{w.emoji}</span>
                              <span className="text-[10px] sm:text-xs">{w.id}</span>
                            </div>
                          </SelectCard>
                        ))}
                      </div>
                    </div>

                    {/* Season */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sun className="w-4 h-4 text-[#0D4F4F]" />
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Season</h4>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {SEASON_OPTIONS.map(s => (
                          <SelectCard
                            key={s.id}
                            active={config.season === s.id}
                            onClick={() => updateConfig("season", s.id)}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xl">{s.emoji}</span>
                              <span className="text-xs font-medium">{s.id}</span>
                            </div>
                          </SelectCard>
                        ))}
                      </div>
                      <p className="text-[10px] text-[#94a3b8] mt-2">Temperature affects battery performance. Cold weather reduces capacity.</p>
                    </div>

                    {/* Stop-and-Go Frequency */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">🚦</span>
                        <h4 className="text-sm font-bold text-[#1A1A2E]">Stop-and-Go Frequency</h4>
                      </div>
                      <SVSlider
                        value={config.stopAndGo}
                        onChange={(v) => updateConfig("stopAndGo", v)}
                        min={1}
                        max={5}
                        step={1}
                        label="Frequency"
                        unit={`/5 — ${STOP_GO_LABELS[config.stopAndGo - 1]}`}
                      />
                      <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
                        <span>Rarely (open roads)</span>
                        <span>Very frequently (city traffic)</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS SECTION ====== */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D4F4F] mb-3">
              How It Works
            </h2>
            <p className="text-[#64748b] max-w-2xl mx-auto">
              Our range calculator considers three key factor groups to give you a realistic estimate of your e-bike&apos;s range.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Rider Factors */}
            <div className="bg-[#F5F7FA] rounded-2xl p-6 sv-card-hover">
              <div className="w-12 h-12 rounded-xl bg-[#0D4F4F] flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#0D4F4F] mb-2">Rider Factors</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Your total weight (rider + bike + cargo) and pedaling cadence directly impact energy consumption.
                Heavier loads require more power, and optimal cadence (around 80 RPM) maximizes efficiency.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[#64748b]">
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Total weight affects rolling resistance</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Cadence impacts motor efficiency</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Average speed affects aerodynamic drag</li>
              </ul>
            </div>

            {/* Bike Factors */}
            <div className="bg-[#F5F7FA] rounded-2xl p-6 sv-card-hover">
              <div className="w-12 h-12 rounded-xl bg-[#0D4F4F] flex items-center justify-center mb-4">
                <Bike className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#0D4F4F] mb-2">eBike Factors</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                The motor type, battery capacity, bicycle type, tire selection, and shifting system all influence
                how efficiently energy is converted into distance traveled.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[#64748b]">
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Battery capacity is the primary range factor</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Motor efficiency varies by drive unit</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Tire type affects rolling resistance</li>
              </ul>
            </div>

            {/* Environment Factors */}
            <div className="bg-[#F5F7FA] rounded-2xl p-6 sv-card-hover">
              <div className="w-12 h-12 rounded-xl bg-[#0D4F4F] flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#0D4F4F] mb-2">Environmental Factors</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                Terrain, road surface, wind, season, and traffic conditions significantly impact your real-world range.
                Cold temperatures and headwinds can reduce range by 20-40%.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[#64748b]">
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Hills dramatically increase energy use</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Cold weather reduces battery capacity</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#00E676]" /> Stop-and-go traffic drains battery faster</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FLEET SECTION ====== */}
      <section id="fleet" className="py-16 md:py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D4F4F] mb-3">
              Our Fleet
            </h2>
            <p className="text-[#64748b] max-w-2xl mx-auto">
              From urban commuters to mountain adventurers — SmartVelo has the perfect e-bike for every journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "SmartVelo City", desc: "Perfect for daily commutes. Lightweight and agile with a 500Wh battery.", emoji: "🏙️", range: "Up to 120 km" },
              { name: "SmartVelo Tour", desc: "Built for long-distance adventures. Comfortable with extended range.", emoji: "🚴", range: "Up to 150 km" },
              { name: "SmartVelo eMTB", desc: "Conquer any trail. Powerful CX motor with full-suspension frame.", emoji: "🏔️", range: "Up to 90 km" },
              { name: "SmartVelo Cargo", desc: "Haul anything. Cargo Line motor with 750Wh battery for heavy loads.", emoji: "📦", range: "Up to 80 km" },
              { name: "SmartVelo Speed", desc: "Speed pedelec up to 45 km/h. For fast commuters.", emoji: "⚡", range: "Up to 100 km" },
              { name: "SmartVelo Gravel", desc: "On-road and off-road versatility. Lightweight gravel e-bike.", emoji: "🛤️", range: "Up to 130 km" },
            ].map(bike => (
              <div key={bike.name} className="bg-white rounded-2xl p-6 sv-card-hover border border-[#e2e8f0]">
                <div className="text-4xl mb-4">{bike.emoji}</div>
                <h3 className="text-lg font-bold text-[#0D4F4F] mb-1">{bike.name}</h3>
                <p className="text-sm text-[#64748b] mb-3 leading-relaxed">{bike.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-full">
                  <Zap className="w-3 h-3" />
                  {bike.range}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer id="contact" className="bg-[#0D4F4F] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/smartvelo/logo.png" alt="SmartVelo" className="h-8 w-auto" draggable={false} />
                <span className="text-lg font-bold">
                  Smart<span className="text-[#00E676]">Velo</span>
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                SmartVelo Mobility — Making e-bike range estimation simple and accurate for every rider.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#calculator" className="hover:text-[#00E676] transition-colors">Range Assistant</a></li>
                <li><a href="#how-it-works" className="hover:text-[#00E676] transition-colors">How It Works</a></li>
                <li><a href="#fleet" className="hover:text-[#00E676] transition-colors">Our Fleet</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>info@smartvelo-mobility.com</li>
                <li>+49 30 123 456 78</li>
                <li>Berlin, Germany</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} SmartVelo Mobility. All rights reserved.
            </p>
            <p className="text-xs text-white/40">
              Range estimates are approximate. Actual range may vary based on real-world conditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
