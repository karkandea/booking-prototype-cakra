"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useVenue } from "@/context/VenueContext";
import { dummyBookings } from "@/lib/data";
import Timeline from "@/components/admin/schedule/Timeline";
import OperatingHoursModal from "@/components/admin/schedule/OperatingHoursModal";
import { OperatingHours, ScheduleBlock, Court } from "@/lib/schedule-types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Helper to generate mock courts for a venue
const generateCourtsProxy = (venueName: string, count: number): Court[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `court-${i + 1}`,
    name: `Lapangan ${i + 1}`
  }));
};

export default function SchedulePage() {
  const { venues } = useVenue();
  const [selectedVenueId, setSelectedVenueId] = useState<string>(venues[0]?.id || "");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Local state for operating hours & blocks (Mock persistence would go here)
  const [operatingHours, setOperatingHours] = useState<OperatingHours>({
    open: 8,
    close: 22,
    isClosed: false
  });
  const [isOpHoursModalOpen, setIsOpHoursModalOpen] = useState(false);

  // Initialize blocks with some dummy data
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([
    { id: "b1", fieldId: "court-1", startHour: 10, duration: 2, status: "booked", title: "Booked", bookingId: "BK-001" },
    { id: "b2", fieldId: "court-2", startHour: 14, duration: 1, status: "maintenance", title: "Repairs" }
  ]);

  const selectedVenue = venues.find(v => v.id === selectedVenueId);

  // Dynamically generate courts based on the selected venue's totalCourts
  const courts = useMemo(() => {
    if (!selectedVenue) return [];
    return generateCourtsProxy(selectedVenue.name, selectedVenue.totalCourts || 1);
  }, [selectedVenue]);

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  if (venues.length === 0) {
    return <div className="p-8">Belum ada venue. Silahkan tambah venue terlebih dahulu.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600">Atur ketersediaan dan jam operasional lapangan.</p>
        </div>

        <div className="flex gap-6 items-end">
          <div className="space-y-2">
            <span className="text-sm font-bold text-gray-700">Lokasi/Lapangan:</span>
            <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
              <SelectTrigger className="w-[220px] bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 font-semibold text-gray-900">
                <SelectValue placeholder="Pilih Venue" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {venues.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-bold text-gray-700">Tanggal</span>
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-gray-300 h-10 shadow-sm">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDateChange(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium w-36 text-center text-gray-900">
                {format(currentDate, "d MMM yyyy", { locale: id })}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDateChange(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Maintenance</span>
          </div>
        </div>

        <Button variant="outline" className="gap-2" onClick={() => setIsOpHoursModalOpen(true)}>
          <Settings className="w-4 h-4" />
          Atur Jam Operasional
        </Button>
      </div>

      {/* Main Timeline Card */}
      <Card className="border-gray-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <Timeline
            courts={courts}
            operatingHours={operatingHours}
            blocks={blocks}
            onBlockChange={setBlocks}
          />
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 italic">
          * Catatan: Klik tabel waktu di atas untuk mengatur dan menentukan blok slot lapangan
        </p>
      </div>

      {/* Modals */}
      <OperatingHoursModal
        isOpen={isOpHoursModalOpen}
        onClose={() => setIsOpHoursModalOpen(false)}
        currentHours={operatingHours}
        onSave={setOperatingHours}
      />
    </div>
  );
}
