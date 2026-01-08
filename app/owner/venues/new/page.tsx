"use client";

import VenueForm from "@/components/admin/VenueForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddVenuePage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="mb-8">
        <Link href="/owner/venues">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 mb-4 pl-0 hover:bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke List Venue
            </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Venue Baru</h1>
        <p className="text-gray-600">Lengkapi informasi untuk mendaftarkan lapangan baru.</p>
      </div>

      <VenueForm mode="create" />
    </div>
  );
}
