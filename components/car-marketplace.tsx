"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Search, X, ChevronDown, Truck, CarIcon, Bike, Facebook, Instagram, Twitter } from "lucide-react"
import VehicleDetails from "./vehicle-details"
import LocationPage from "./location-page"
import { vehicleService } from "@/lib/vehicle-service"
import type { Vehicle } from "@/lib/data"
import { useUser } from "@/components/UserContext"
import { Header } from "./ui/header"
import { VehicleCard } from "./ui/vehicle-card"

// Common South African car make abbreviations
const MAKE_ABBREVIATIONS: Record<string, string> = {
  vw: "Volkswagen",
  bmw: "BMW",
  merc: "Mercedes Benz",
  benz: "Mercedes Benz",
  toy: "Toyota",
  ford: "Ford",
  chev: "Chevrolet",
  caddy: "Cadillac",
  audi: "Audi",
  tata: "Tata Motors",
  maz: "Mazda",
  suz: "Suzuki",
  hyundai: "Hyundai",
  kia: "Kia",
  ren: "Renault",
  nissan: "Nissan",
  honda: "Honda",
  opel: "Opel",
  fiat: "Fiat",
  jeep: "Jeep",
  jag: "Jaguar",
  landy: "Land Rover",
  lr: "Land Rover",
  lex: "Lexus",
  dacia: "Dacia",
  mini: "MINI",
}

export default function CarMarketplace() {
  const router = useRouter()
  const { user, setUser } = useUser()
  const [search, setSearch] = useState("")
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [isSearchPage, setIsSearchPage] = useState(true)
  const [savedCars, setSavedCars] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTerms, setSelectedTerms] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [bodyType, setBodyType] = useState("")
  const [showBodyTypes, setShowBodyTypes] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const engineCapacityRef = useRef<HTMLDivElement>(null)

  // State for Engine Capacity Slider
  const [engineCapacityRange, setEngineCapacityRange] = useState<[number, number]>([1.0, 8.0])
  const [showEngineCapacitySlider, setShowEngineCapacitySlider] = useState(false)
  const [currentSliderEngineValues, setCurrentSliderEngineValues] = useState<[number, number]>([1.0, 8.0])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setShowBodyTypes(false)
      }
      if (engineCapacityRef.current && !engineCapacityRef.current.contains(event.target as Node)) {
        if (showEngineCapacitySlider) {
          setEngineCapacityRange(currentSliderEngineValues)
          setShowEngineCapacitySlider(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showEngineCapacitySlider, currentSliderEngineValues])

  // Helper function to format raw price string to "R X XXX.XX" for display
  const formatPriceForDisplay = (rawValue: string | number | undefined | null): string => {
    if (rawValue === undefined || rawValue === null || String(rawValue).trim() === "") {
      return "R 0.00"
    }

    let numericString = String(rawValue).replace(/[^\d.]/g, "")

    if (numericString.startsWith(".")) {
      numericString = "0" + numericString
    }

    const parts = numericString.split(".")
    let integerPart = parts[0]
    let decimalPart = parts.length > 1 ? parts[1] : ""

    if (integerPart === "" && decimalPart !== "") {
      integerPart = "0"
    }

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")

    if (decimalPart.length === 0) {
      decimalPart = "00"
    } else if (decimalPart.length === 1) {
      decimalPart += "0"
    } else if (decimalPart.length > 2) {
      decimalPart = decimalPart.substring(0, 2)
    }
    return `R ${formattedInteger || "0"}.${decimalPart}`
  }

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const result = await vehicleService.getVehicles()
        const vehicles = result.vehicles || []
        setAllVehicles(vehicles)
        setFilteredVehicles(vehicles)
      } catch (error) {
        console.error("Failed to fetch vehicles:", error)
        setAllVehicles([])
        setFilteredVehicles([])
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  const generateSuggestions = (input: string) => {
    if (!input.trim() || !Array.isArray(allVehicles)) {
      setSuggestions([])
      return
    }

    const lowerInput = input.toLowerCase()
    const uniqueSuggestions = new Set<string>()
    const abbrFull = MAKE_ABBREVIATIONS[lowerInput]

    allVehicles.forEach((vehicle) => {
      if (
        vehicle.make.toLowerCase().includes(lowerInput) ||
        (abbrFull && vehicle.make.toLowerCase() === abbrFull.toLowerCase())
      ) {
        uniqueSuggestions.add(vehicle.make)
      }
      const modelTerm = `${vehicle.make} ${vehicle.model}`
      if (
        modelTerm.toLowerCase().includes(lowerInput) ||
        (abbrFull && modelTerm.toLowerCase().includes(abbrFull.toLowerCase()))
      ) {
        uniqueSuggestions.add(modelTerm)
      }
      if (vehicle.variant) {
        const variantTerm = `${vehicle.make} ${vehicle.model} ${vehicle.variant}`
        if (
          variantTerm.toLowerCase().includes(lowerInput) ||
          (abbrFull && variantTerm.toLowerCase().includes(abbrFull.toLowerCase()))
        ) {
          uniqueSuggestions.add(variantTerm)
        }
      }
    })

    if (abbrFull && !uniqueSuggestions.has(abbrFull)) {
      uniqueSuggestions.add(abbrFull)
    }

    const filteredSuggestions = [...uniqueSuggestions].filter((s) => !selectedTerms.includes(s))
    setSuggestions(filteredSuggestions.slice(0, 5))
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    generateSuggestions(value)
    setShowSuggestions(true)
  }

  const removeSelectedTerm = (term: string) => {
    setSelectedTerms(selectedTerms.filter((t) => t !== term))
  }

  const handleSearch = () => {
    const minPriceInput = document.getElementById("min-price-input") as HTMLInputElement
    const maxPriceInput = document.getElementById("max-price-input") as HTMLInputElement
    const locationSelect = document.getElementById("location-select") as HTMLSelectElement
    const fuelTypeSelect = document.getElementById("fuel-type-select") as HTMLSelectElement
    const transmissionSelect = document.getElementById("transmission-select") as HTMLSelectElement
    const minYearSelect = document.getElementById("min-year-select") as HTMLSelectElement
    const maxYearSelect = document.getElementById("max-year-select") as HTMLSelectElement
    const minMileageInput = document.getElementById("min-mileage-input") as HTMLInputElement
    const maxMileageInput = document.getElementById("max-mileage-input") as HTMLInputElement

    const queryParams = new URLSearchParams()

    if (selectedTerms.length > 0) queryParams.set("query", selectedTerms.join(" "))
    if (minPriceInput?.value) queryParams.set("minPrice", minPriceInput.value.replace(/\D/g, ""))
    if (maxPriceInput?.value) queryParams.set("maxPrice", maxPriceInput.value.replace(/\D/g, ""))
    if (locationSelect?.value) queryParams.set("province", locationSelect.value)
    if (bodyType) queryParams.set("bodyType", bodyType)
    if (minYearSelect?.value) queryParams.set("minYear", minYearSelect.value)
    if (maxYearSelect?.value) queryParams.set("maxYear", maxYearSelect.value)
    if (minMileageInput?.value) queryParams.set("minMileage", minMileageInput.value.replace(/\D/g, ""))
    if (maxMileageInput?.value) queryParams.set("maxMileage", maxMileageInput.value.replace(/\D/g, ""))
    if (fuelTypeSelect?.value && fuelTypeSelect.value !== "All") queryParams.set("fuelType", fuelTypeSelect.value)
    if (transmissionSelect?.value && transmissionSelect.value !== "All")
      queryParams.set("transmission", transmissionSelect.value)
    queryParams.set("engineCapacityMin", engineCapacityRange[0].toFixed(1))
    queryParams.set("engineCapacityMax", engineCapacityRange[1].toFixed(1))

    router.push(`/results?${queryParams.toString()}`)
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (!selectedTerms.includes(suggestion)) {
      setSelectedTerms([...selectedTerms, suggestion])
    }
    setSearchTerm("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  const formatEngineCapacityDisplay = (range: [number, number]): string => {
    if (range[0] === 1.0 && range[1] === 8.0) {
      return "All"
    }
    return `${range[0].toFixed(1)}L - ${range[1].toFixed(1)}L`
  }

  const handleApplyEngineCapacity = () => {
    setEngineCapacityRange(currentSliderEngineValues)
    setShowEngineCapacitySlider(false)
  }

  const handleMinEngineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = Number.parseFloat(e.target.value)
    if (isNaN(newMin)) newMin = 1.0
    newMin = Math.max(1.0, Math.min(newMin, 8.0))
    setCurrentSliderEngineValues((prev) => [newMin, Math.max(newMin, prev[1])])
  }

  const handleMaxEngineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = Number.parseFloat(e.target.value)
    if (isNaN(newMax)) newMax = 8.0
    newMax = Math.min(8.0, Math.max(newMax, 1.0))
    setCurrentSliderEngineValues((prev) => [Math.min(newMax, prev[0]), newMax])
  }

  const handleSliderValueChange = (newValues: number[]) => {
    setCurrentSliderEngineValues(newValues as [number, number])
  }

  const bodyTypes = [
    { name: "All body types", icon: CarIcon },
    { name: "Sedan", icon: CarIcon },
    { name: "SUV", icon: CarIcon },
    { name: "Truck", icon: Truck },
    { name: "Motorcycle", icon: Bike },
    { name: "Hatchback", icon: CarIcon },
    { name: "Convertible", icon: CarIcon },
  ]

  const handleSaveCar = (vehicle: Vehicle) => {
    setSavedCars((prevSavedCars) => {
      const alreadySaved = prevSavedCars.some((car) => car.id === vehicle.id)
      if (alreadySaved) {
        return prevSavedCars.filter((car) => car.id !== vehicle.id)
      } else {
        return [...prevSavedCars, vehicle]
      }
    })
  }

  const handleSignOut = () => {
    setUser(null)
    router.push("/home")
  }

  // Navigation handlers using Next.js routing
  const navigationHandlers = {
    onLoginClick: () => router.push("/login"),
    onDashboardClick: () => router.push("/dashboard"),
    onGoHome: () => {
      setIsSearchPage(true)
      setSelectedVehicle(null)
      setSelectedProvince(null)
    },
    onShowAllCars: () => {
      setFilteredVehicles(allVehicles)
      setIsSearchPage(false)
      setSelectedVehicle(null)
      setSelectedProvince(null)
    },
    onGoToSellPage: () => router.push("/upload-vehicle"),
    onSignOut: handleSignOut,
  }

  // Routing Logic
  if (selectedProvince) {
    return (
      <>
        <Header user={user} {...navigationHandlers} />
        <div className="pt-16 md:pt-20">
          <LocationPage
            province={selectedProvince}
            vehicles={allVehicles}
            onBack={() => setSelectedProvince(null)}
            user={user}
            {...navigationHandlers}
          />
        </div>
      </>
    )
  }

  if (selectedVehicle) {
    return (
      <>
        <Header user={user} {...navigationHandlers} />
        <div className="pt-16 md:pt-20">
          <VehicleDetails
            vehicle={selectedVehicle}
            onBack={() => setSelectedVehicle(null)}
            user={user}
            savedCars={savedCars}
            onSaveCar={handleSaveCar}
          />
        </div>
      </>
    )
  }

  // Main Search Page or Results Page
  return (
    <div className="min-h-screen bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]">
      <Header user={user} {...navigationHandlers} transparent={isSearchPage} />

      {isSearchPage ? (
        // Search Page View
        <div className="flex flex-col">
          {/* Hero Search Section */}
          <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-white dark:from-[#182218] to-[var(--light-bg)] dark:to-[var(--dark-bg)]">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#3E5641] dark:text-white">
                Find Your Perfect Car
              </h1>
              <p className="text-xl opacity-80 text-[#6F7F69] dark:text-gray-300">
                Search from thousands of vehicles across South Africa
              </p>
            </div>

            {/* Search Card */}
            <div className="bg-white dark:bg-[#1F2B20] p-6 md:p-8 rounded-2xl shadow-xl max-w-3xl w-full border border-[#9FA791]/20 dark:border-[#4A4D45]/20">
              {/* Search Input with Suggestions */}
              <div className="mb-4 relative" ref={searchRef}>
                <label htmlFor="search-input" className="sr-only">
                  Search Make, Model and Variant
                </label>
                <div className="flex flex-wrap items-center gap-2 p-3 border border-[#9FA791] dark:border-[#4A4D45] rounded-lg focus-within:border-[#FF6700] dark:focus-within:border-[#FF7D33] mb-2 bg-white dark:bg-[#2A352A]">
                  {selectedTerms.map((term, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-[#FFF8E0] dark:bg-[#3E5641] px-3 py-1.5 rounded-full text-sm text-[#3E5641] dark:text-white"
                    >
                      <span>{term}</span>
                      <button
                        onClick={() => removeSelectedTerm(term)}
                        className="ml-2 hover:text-[#FF6700] dark:hover:text-[#FF7D33] focus:outline-none"
                        aria-label={`Remove ${term}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <input
                    id="search-input"
                    type="text"
                    placeholder={selectedTerms.length > 0 ? "" : "Search Make, Model, Variant..."}
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    className="flex-1 min-w-[150px] px-2 py-1 focus:outline-none bg-transparent text-[#3E5641] dark:text-white placeholder-[#6F7F69] dark:placeholder-gray-400"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-20 w-full bg-white dark:bg-[#1F2B20] border border-[#9FA791] dark:border-[#4A4D45] rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-[#FFF8E0] dark:hover:bg-[#2A352A] cursor-pointer text-[#3E5641] dark:text-white"
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                  id="min-price-input"
                  type="number"
                  placeholder="Min Price"
                  className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white placeholder-[#6F7F69] dark:placeholder-gray-400"
                  min="0"
                  step="1000"
                />
                <input
                  id="max-price-input"
                  type="number"
                  placeholder="Max Price"
                  className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white placeholder-[#6F7F69] dark:placeholder-gray-400"
                  min="0"
                  step="1000"
                />
                <select
                  id="location-select"
                  className="w-full px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] appearance-none bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
                  defaultValue=""
                >
                  <option value="">Location (All)</option>
                  <option value="Western Cape">Western Cape</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="North West">North West</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="Limpopo">Limpopo</option>
                </select>
                {/* Body Type Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowBodyTypes(!showBodyTypes)}
                    className="w-full px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] text-left flex justify-between items-center bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
                    aria-haspopup="listbox"
                    aria-expanded={showBodyTypes}
                  >
                    {bodyType || "All body types"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showBodyTypes ? "rotate-180" : ""}`} />
                  </button>

                  {showBodyTypes && (
                    <div
                      className="absolute z-20 w-full bg-white dark:bg-[#1F2B20] border border-[#9FA791] dark:border-[#4A4D45] rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
                      role="listbox"
                    >
                      {bodyTypes.map((type, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-[#FFF8E0] dark:hover:bg-[#2A352A] cursor-pointer flex items-center text-[#3E5641] dark:text-white"
                          onClick={() => {
                            setBodyType(type.name === "All body types" ? "" : type.name)
                            setShowBodyTypes(false)
                          }}
                          role="option"
                          aria-selected={bodyType === type.name}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <type.icon className="w-4 h-4 mr-2 opacity-70" />
                          {type.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* More Options Section */}
              {showMoreOptions && (
                <div
                  id="more-options-section"
                  className="mt-6 border-t border-[#9FA791]/20 dark:border-[#4A4D45]/20 pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Min/Max Year */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="min-year-select"
                        className="mb-1 font-medium text-sm text-[#6F7F69] dark:text-gray-300"
                      >
                        Min Year
                      </label>
                      <select
                        id="min-year-select"
                        className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
                      >
                        <option value="">Any</option>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="max-year-select"
                        className="mb-1 font-medium text-sm text-[#6F7F69] dark:text-gray-300"
                      >
                        Max Year
                      </label>
                      <select
                        id="max-year-select"
                        className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
                      >
                        <option value="">Any</option>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Min/Max Mileage */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="min-mileage-input"
                        className="mb-1 font-medium text-sm text-[#6F7F69] dark:text-gray-300"
                      >
                        Min Mileage
                      </label>
                      <input
                        id="min-mileage-input"
                        type="number"
                        placeholder="e.g., 10000"
                        min="0"
                        step="1000"
                        className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white placeholder-[#6F7F69] dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="max-mileage-input"
                        className="mb-1 font-medium text-sm text-[#6F7F69] dark:text-gray-300"
                      >
                        Max Mileage
                      </label>
                      <input
                        id="max-mileage-input"
                        type="number"
                        placeholder="e.g., 100000"
                        min="0"
                        step="1000"
                        className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white placeholder-[#6F7F69] dark:placeholder-gray-400"
                      />
                    </div>
                    {/* Fuel Type */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="fuel-type-select"
                        className="mb-1 font-medium text-sm text-[#6F7F69] dark:text-gray-300"
                      >
                        Fuel Type
                      </label>
                      <select
                        id="fuel-type-select"
                        className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
                      >
                        <option value="All">All</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    {/* Engine Capacity Slider */}
                    <div className="relative flex flex-col" ref={engineCapacityRef}>
                      <label className="mb-1 font-medium text-sm text-[#6F7F69] dark:text-gray-300">
                        Engine Capacity
                      </label>
                      <button
                        onClick={() => {
                          setCurrentSliderEngineValues(engineCapacityRange)
                          setShowEngineCapacitySlider(!showEngineCapacitySlider)
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] text-left flex justify-between items-center bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
                        aria-haspopup="true"
                        aria-expanded={showEngineCapacitySlider}
                      >
                        {formatEngineCapacityDisplay(engineCapacityRange)}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${showEngineCapacitySlider ? "rotate-180" : ""}`}
                        />
                      </button>

                      {showEngineCapacitySlider && (
                        <div className="absolute z-30 mt-1 w-full md:w-[320px] bg-white dark:bg-[#1F2B20] border border-[#9FA791] dark:border-[#4A4D45] rounded-lg shadow-xl p-5 top-full right-0 md:left-0 md:right-auto">
                          <div className="mb-4 text-center">
                            <span className="font-bold text-xl text-[#3E5641] dark:text-white">
                              {currentSliderEngineValues[0].toFixed(1)}L
                            </span>
                            <span className="text-xl text-[#6F7F69] dark:text-gray-400"> - </span>
                            <span className="font-bold text-xl text-[#3E5641] dark:text-white">
                              {currentSliderEngineValues[1].toFixed(1)}L
                            </span>
                          </div>

                          <SliderPrimitive.Root
                            value={currentSliderEngineValues}
                            onValueChange={handleSliderValueChange}
                            min={1.0}
                            max={8.0}
                            step={0.1}
                            minStepsBetweenThumbs={0}
                            className="relative flex w-full touch-none select-none items-center h-10"
                          >
                            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#9FA791]/40 dark:bg-[#4A4D45]/60">
                              <SliderPrimitive.Range className="absolute h-full bg-[#FF6700] dark:bg-[#FF7D33]" />
                            </SliderPrimitive.Track>
                            {[0, 1].map((thumbIndex) => (
                              <SliderPrimitive.Thumb
                                key={thumbIndex}
                                aria-label={thumbIndex === 0 ? "Minimum engine capacity" : "Maximum engine capacity"}
                                className="block h-6 w-6 rounded-full border-2 border-[#FF6700] dark:border-[#FF7D33] bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6700]/50 dark:focus-visible:ring-[#FF7D33]/50 focus-visible:ring-offset-2 cursor-grab active:cursor-grabbing"
                              />
                            ))}
                          </SliderPrimitive.Root>

                          <div className="mt-5 flex gap-4">
                            <input
                              id="min-engine-input"
                              type="number"
                              value={currentSliderEngineValues[0].toFixed(1)}
                              onChange={handleMinEngineInputChange}
                              min="1.0"
                              max="8.0"
                              step="0.1"
                              className="w-full px-3 py-2 rounded-md border border-[#9FA791] dark:border-[#4A4D45] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white text-sm focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33]"
                              placeholder="Min L"
                            />
                            <input
                              id="max-engine-input"
                              type="number"
                              value={currentSliderEngineValues[1].toFixed(1)}
                              onChange={handleMaxEngineInputChange}
                              min="1.0"
                              max="8.0"
                              step="0.1"
                              className="w-full px-3 py-2 rounded-md border border-[#9FA791] dark:border-[#4A4D45] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white text-sm focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33]"
                              placeholder="Max L"
                            />
                          </div>

                          <button
                            onClick={handleApplyEngineCapacity}
                            className="mt-5 w-full bg-[#FF6700] text-white dark:bg-[#FF7D33] px-4 py-2.5 rounded-lg hover:bg-[#FF6700]/90 dark:hover:bg-[#FF7D33]/90 transition-colors font-medium text-sm"
                          >
                            Apply Range
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Transmission */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="transmission-select"
                        className="mb-1 font-medium text-sm text-[#6F7F69] dark:text-gray-300"
                      >
                        Transmission
                      </label>
                      <select
                        id="transmission-select"
                        className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
                      >
                        <option value="All">All</option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                    {/* Condition */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="condition-select"
                        className="mb-1 font-medium text-sm text-[#6F7F69] dark:text-gray-300"
                      >
                        Condition
                      </label>
                      <select
                        id="condition-select"
                        className="px-4 py-3 rounded-lg border border-[#9FA791] dark:border-[#4A4D45] focus:outline-none focus:border-[#FF6700] dark:focus:border-[#FF7D33] bg-white dark:bg-[#2A352A] text-[#3E5641] dark:text-white"
                      >
                        <option value="All">All</option>
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="border border-[#FF6700] text-[#FF6700] dark:border-[#FF7D33] dark:text-[#FF7D33] px-4 py-3 rounded-lg w-full sm:w-auto sm:flex-1 hover:bg-[#FFF8E0] dark:hover:bg-[#2A352A] transition-colors font-medium"
                  aria-controls="more-options-section"
                  aria-expanded={showMoreOptions}
                >
                  {showMoreOptions ? "Fewer Options" : "More Options"}
                </button>
                <button
                  onClick={handleSearch}
                  className="bg-[#FF6700] text-white dark:bg-[#FF7D33] px-4 py-3 rounded-lg w-full sm:w-auto sm:flex-[2] hover:bg-[#FF6700]/90 dark:hover:bg-[#FF7D33]/90 transition-colors flex items-center justify-center font-medium"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Cars
                </button>
              </div>
            </div>
          </div>

          {/* Featured Vehicles Section */}
          <div className="py-16 px-4 bg-white dark:bg-[#1F2B20]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-[#3E5641] dark:text-white">Featured Vehicles</h2>
                <p className="text-lg opacity-80 max-w-2xl mx-auto text-[#6F7F69] dark:text-gray-300">
                  Discover our handpicked selection of premium vehicles available across South Africa
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6700]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Display all vehicles as featured */}
                  {Array.isArray(allVehicles) && allVehicles.length > 0 ? (
                    allVehicles.map((vehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        onViewDetails={() => router.push(`/vehicle-details/${vehicle.id}`)}
                        isSaved={savedCars.some((saved) => saved.id === vehicle.id)}
                        onToggleSave={() => handleSaveCar(vehicle)}
                        isLoggedIn={!!user}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-lg text-[#6F7F69] dark:text-gray-300">No vehicles available at the moment.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center mt-12">
                <button
                  onClick={() => router.push("/results")}
                  className="bg-[#3E5641] dark:bg-[#4A4D45] text-white px-6 py-3 rounded-lg hover:bg-[#3E5641]/90 dark:hover:bg-[#4A4D45]/90 transition-colors font-medium"
                >
                  View All Vehicles
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-[#3E5641] dark:bg-[#1F2B20] py-8 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#FF6700] dark:text-[#FF7D33]">imoto</h3>
                  <p className="text-sm text-gray-300">The simplest way to buy or sell your car in South Africa.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-gray-200">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => {
                          setIsSearchPage(true)
                          window.scrollTo(0, 0)
                        }}
                        className="text-sm text-gray-300 hover:text-[#FF7D33] text-left"
                      >
                        Buy a Car
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => router.push("/upload-vehicle")}
                        className="text-sm text-gray-300 hover:text-[#FF7D33] text-left"
                      >
                        Sell a Car
                      </button>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-gray-300 hover:text-[#FF7D33]">
                        Value My Car
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-gray-300 hover:text-[#FF7D33]">
                        Car Finance
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-gray-200">About Us</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-sm text-gray-300 hover:text-[#FF7D33]">
                        Our Story
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-gray-300 hover:text-[#FF7D33]">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-gray-300 hover:text-[#FF7D33]">
                        Press
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-[#FF7D33]">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-gray-200">Connect With Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-300 hover:text-[#FF7D33]">
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-[#FF7D33]">
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-[#FF7D33]">
                      <Twitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[#576B55]/50 dark:border-[#2A352A]/50 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} imoto. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      ) : null}
    </div>
  )
}
