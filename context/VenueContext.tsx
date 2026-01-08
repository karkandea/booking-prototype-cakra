"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fields as initialFields } from "@/lib/data";
import { Field } from "@/lib/types";

interface VenueContextType {
  venues: Field[];
  addVenue: (venue: Field) => void;
  updateVenue: (id: string, updatedVenue: Partial<Field>) => void;
  deleteVenue: (id: string) => void;
  getVenue: (id: string) => Field | undefined;
}

const VenueContext = createContext<VenueContextType | undefined>(undefined);

export function VenueProvider({ children }: { children: React.ReactNode }) {
  // Initialize with dummy data
  const [venues, setVenues] = useState<Field[]>(initialFields);

  // Persistence for prototype (optional, good for UX)
  useEffect(() => {
    const saved = localStorage.getItem("vendor_venues");
    if (saved) {
      try {
        setVenues(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load venues", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vendor_venues", JSON.stringify(venues));
  }, [venues]);

  const addVenue = (venue: Field) => {
    setVenues((prev) => [...prev, venue]);
  };

  const updateVenue = (id: string, updatedVenue: Partial<Field>) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedVenue } : v))
    );
  };

  const deleteVenue = (id: string) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
  };

  const getVenue = (id: string) => {
    return venues.find((v) => v.id === id);
  };

  return (
    <VenueContext.Provider value={{ venues, addVenue, updateVenue, deleteVenue, getVenue }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenue() {
  const context = useContext(VenueContext);
  if (context === undefined) {
    throw new Error("useVenue must be used within a VenueProvider");
  }
  return context;
}
