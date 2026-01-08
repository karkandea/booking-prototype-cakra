"use client";

import VenueForm from "@/components/admin/VenueForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useVenue } from "@/context/VenueContext";

export default function EditVenuePage() {
  const params = useParams();
  const { getVenue } = useVenue();
  const venueId = params.id as string;
  const venue = getVenue(venueId);

  if (!venue) {
    // In a real app we might fetch here, but for now context is the source
    // If refreshed on this page without persistence, it might be empty if we didn't implement localStorage
    // But we did implement localStorage in Context, so it should be fine.
    // If not found, show 404
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-gray-900">Venue Tidak Ditemukan</h2>
             <Link href="/owner/venues" className="mt-4 text-emerald-600 hover:underline">
                Kembali ke List Venue
            </Link>
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="mb-8">
        <Link href="/owner/venues">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 mb-4 pl-0 hover:bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke List Venue
            </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Venue</h1>
        <p className="text-gray-600">Update informasi untuk <span className="font-semibold">{venue.name}</span></p>
      </div>

      <VenueForm mode="edit" initialData={venue} />
    </div>
  );
}
