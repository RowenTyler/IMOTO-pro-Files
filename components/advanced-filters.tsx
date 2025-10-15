"use client"

import type React from "react" //test

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface AdvancedFiltersProps {
  filters: any
  onFilterChange: (filters: any) => void
}

const bodyTypes = ["Sedan", "SUV", "Truck", "Motorcycle", "Hatchback", "Convertible"]
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"]
const provinces = [
  "Western Cape",
  "Gauteng",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Limpopo",
]
const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

export default function AdvancedFilters({ filters, onFilterChange }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalFilters((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setLocalFilters((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: string) => {
    setLocalFilters((prev: any) => {
      const existing: string[] = prev[name] || []
      const newValues = existing.includes(value) ? existing.filter((v) => v !== value) : [...existing, value]
      return { ...prev, [name]: newValues }
    })
  }

  const handleSliderChange = (values: number[]) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      engineCapacityMin: values[0].toFixed(1),
      engineCapacityMax: values[1].toFixed(1),
    }))
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
  }

  const handleResetFilters = () => {
    const resetState = {
      query: "",
      minPrice: "",
      maxPrice: "",
      province: "",
      bodyType: [],
      minYear: "",
      maxYear: "",
      minMileage: "",
      maxMileage: "",
      fuelType: [],
      transmission: "",
      engineCapacityMin: "1.0",
      engineCapacityMax: "8.0",
    }
    setLocalFilters(resetState)
    onFilterChange(resetState)
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Advanced Filters</h3>
      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5", "item-6"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Keywords</AccordionTrigger>
          <AccordionContent>
            <Input
              name="query"
              placeholder="e.g., Toyota Corolla"
              value={localFilters.query}
              onChange={handleInputChange}
              className="w-full"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Input
              name="minPrice"
              type="number"
              placeholder="Min Price"
              value={localFilters.minPrice}
              onChange={handleInputChange}
            />
            <Input
              name="maxPrice"
              type="number"
              placeholder="Max Price"
              value={localFilters.maxPrice}
              onChange={handleInputChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <Select value={localFilters.province} onValueChange={(value) => handleSelectChange("province", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Body Type</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {bodyTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`body-${type}`}
                  checked={localFilters.bodyType.includes(type)}
                  onCheckedChange={() => handleCheckboxChange("bodyType", type)}
                />
                <Label htmlFor={`body-${type}`}>{type}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Year & Mileage</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={localFilters.minYear} onValueChange={(value) => handleSelectChange("minYear", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Min Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={localFilters.maxYear} onValueChange={(value) => handleSelectChange("maxYear", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Max Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input
                name="minMileage"
                type="number"
                placeholder="Min Mileage"
                value={localFilters.minMileage}
                onChange={handleInputChange}
              />
              <Input
                name="maxMileage"
                type="number"
                placeholder="Max Mileage"
                value={localFilters.maxMileage}
                onChange={handleInputChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>Specifications</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label className="font-semibold">Fuel Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {fuelTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fuel-${type}`}
                      checked={localFilters.fuelType.includes(type)}
                      onCheckedChange={() => handleCheckboxChange("fuelType", type)}
                    />
                    <Label htmlFor={`fuel-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-semibold">Transmission</Label>
              <Select
                value={localFilters.transmission}
                onValueChange={(value) => handleSelectChange("transmission", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold">
                Engine: {localFilters.engineCapacityMin}L - {localFilters.engineCapacityMax}L
              </Label>
              <Slider
                value={[
                  Number.parseFloat(localFilters.engineCapacityMin),
                  Number.parseFloat(localFilters.engineCapacityMax),
                ]}
                onValueChange={handleSliderChange}
                min={1}
                max={8}
                step={0.1}
                className="mt-2"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 flex flex-col gap-2">
        <Button onClick={handleApplyFilters} className="w-full bg-orange-500 hover:bg-orange-600">
          Apply Filters
        </Button>
        <Button onClick={handleResetFilters} variant="outline" className="w-full bg-transparent">
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
