"use client";

import { useParams } from "next/navigation";
import { fields, formatCurrency } from "@/lib/data";
import { notFound } from "next/navigation";
import { ChevronLeft, Share2, Heart, MapPin, Star, Clock, Users, ChevronRight, ChevronLeft as ChevronLeftIcon, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import Image from "next/image";
import { format, addMonths } from "date-fns";

export default function VenueDetailPage() {
  const params = useParams();
  const { theme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  
  // Date and Time picker states
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 11, 25)); // Dec 25, 2025
  const [selectedTime, setSelectedTime] = useState("08.00 - 10.00");
  const [selectedCourt, setSelectedCourt] = useState("Lapangan 1");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isCourtPickerOpen, setIsCourtPickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 2, 1)); // March 2026
  
  // Find the venue by ID
  const venue = fields.find((f) => f.id === params.id);
  
  if (!venue) {
    notFound();
  }

  const images = venue.images || [venue.image];
  const rating = venue.rating || 4.9;
  const openHours = venue.openHours || "08:00 - 22:00";
  const totalCourts = venue.totalCourts || 2;
  const aboutVenue = venue.aboutVenue || venue.description;
  const rules = venue.rules || [];
  const reviews = venue.reviews || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-white">
        {/* Full-screen Image Carousel */}
        <div className="relative h-[50vh] bg-gray-900">
          <Image
            src={images[currentImageIndex]}
            alt={venue.name}
            fill
            className="object-cover"
          />
          
          {/* Overlay Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <Link href="/">
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
            </Link>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                <Share2 className="w-5 h-5 text-gray-900" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Sheet Content */}
        <div className="px-6 py-6 pb-32">
          {/* Handle Bar */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

          {/* Venue Name & Location */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{venue.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{venue.location}</span>
          </div>

          {/* Rating & Status */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{rating}</span>
              <span className="text-sm text-gray-600">({venue.reviews?.length || 15} rating)</span>
            </div>
            <Badge className="border-none text-white" style={{ backgroundColor: theme.primary }}>
              Open Now
            </Badge>
          </div>

          {/* About Venue */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">About Venue</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isAboutExpanded ? aboutVenue : `${aboutVenue.slice(0, 100)}...`}
            </p>
            <button
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="mt-2 font-medium"
              style={{ color: theme.primary }}
            >
              {isAboutExpanded ? "Read less" : "Read more"}
            </button>
          </div>

          {/* Facilities */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Facilities</h2>
            <div className="grid grid-cols-4 gap-4">
              {venue.facilities.slice(0, 4).map((facility, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  >
                    <Users className="w-6 h-6" style={{ color: theme.primary }} />
                  </div>
                  <span className="text-xs text-center text-gray-700 leading-tight">
                    {facility}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-600">TOTAL PRICE</div>
              <div className="text-xl font-bold" style={{ color: theme.primary }}>
                {formatCurrency(venue.pricePerHour)}
                <span className="text-sm text-gray-600 font-normal"> /session</span>
              </div>
            </div>
            <Link 
              href={{
                pathname: "/booking",
                query: { 
                  field: venue.id,
                  date: selectedDate.toISOString(),
                  time: selectedTime,
                  duration: 1
                }
              }} 
              className="flex-1"
            >
              <Button
                size="lg"
                className="w-full text-white rounded-xl"
                style={{ backgroundColor: theme.primary }}
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            Back to Venues
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Carousel */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
                <Image
                  src={images[currentImageIndex]}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
                
                {/* Previous Button */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-all z-10"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-900" />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Venue Header Info */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" style={{ color: theme.primary }} />
                      <span className="text-sm">{venue.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{rating}</span>
                      <span className="text-sm text-gray-600">({venue.reviews?.length || 15} rating)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color: theme.primary }}>
                      {formatCurrency(venue.pricePerHour)}
                    </div>
                    <div className="text-sm text-gray-600">/sesi</div>
                  </div>
                </div>

                {/* About - directly after header */}
                <div>
                  <p className="text-gray-700 text-sm leading-relaxed">{aboutVenue}</p>
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Facilities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {venue.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${theme.primary}20` }}
                      >
                        <Users className="w-5 h-5" style={{ color: theme.primary }} />
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aturan Venue */}
              {rules.length > 0 && (
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Aturan Venue</h2>
                  <div className="space-y-4">
                    {rules.map((rule, index) => (
                      <div key={index} className="flex gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed flex-1">{rule}</p>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-sm font-medium" style={{ color: theme.primary }}>
                    Baca Selengkapnya
                  </button>
                </div>
              )}

              {/* Ulasan */}
              {reviews.length > 0 && (
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Ulasan</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          {review.comment}
                        </p>
                        <button className="text-sm font-medium" style={{ color: theme.primary }}>
                          Show more
                        </button>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">{review.userName}</div>
                          </div>
                          <div className="text-xs text-gray-500">{review.timeAgo}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map((page) => (
                        <button
                          key={page}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                            page === 1
                              ? "text-white shadow-sm"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                          style={page === 1 ? { backgroundColor: theme.primary } : {}}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button className="text-sm font-medium" style={{ color: theme.primary }}>
                      Lihat semua ulasan
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-8 shadow-sm border border-gray-200">
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-1" style={{ color: theme.primary }}>
                    {formatCurrency(venue.pricePerHour)}
                  </div>
                  <div className="text-sm text-gray-600">/sesi</div>
                </div>

                {/* Table-style booking form */}
                <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                  {/* Row 1: KETERSEDIAAN | TANGGAL (2 columns) */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="p-4 border-r border-gray-200">
                      <div className="text-xs font-semibold text-gray-900 mb-1">KETERSEDIAAN</div>
                      <div className="text-sm text-gray-900">2 Jadwal Tersisa</div>
                    </div>
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <div className="p-4 relative cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="text-xs font-semibold text-gray-900 mb-1">TANGGAL</div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-900">
                              {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '25/12/2025'}
                            </div>
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-6" align="start" side="bottom" sideOffset={4}>
                        <div className="relative">
                          <div className="flex gap-8 mb-6">
                            {/* Previous Month Button */}
                            <button
                              onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}
                              className="absolute left-0 top-12 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors z-10"
                            >
                              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* First Month */}
                            <div className="flex-1 min-w-[280px]">
                              <h3 className="text-center font-semibold text-gray-900 mb-4">
                                {format(calendarMonth, 'MMMM yyyy')}
                              </h3>
                              <div className="grid grid-cols-7 gap-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                  <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
                                    {day}
                                  </div>
                                ))}
                                {generateCalendarDays(calendarMonth).map((day, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      if (day.date) {
                                        setSelectedDate(day.date);
                                        setIsDatePickerOpen(false);
                                      }
                                    }}
                                    disabled={!day.isCurrentMonth || day.isPast}
                                    className={`
                                      aspect-square flex items-center justify-center text-sm rounded-full transition-all
                                      ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                                      ${day.isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                                      ${day.isSelected ? 'bg-teal-600 text-white font-semibold' : ''}
                                      ${day.isCurrentMonth && !day.isPast && !day.isSelected ? 'hover:bg-gray-100 text-gray-900' : ''}
                                    `}
                                  >
                                    {day.day}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Second Month */}
                            <div className="flex-1 min-w-[280px]">
                              <h3 className="text-center font-semibold text-gray-900 mb-4">
                                {format(addMonths(calendarMonth, 1), 'MMMM yyyy')}
                              </h3>
                              <div className="grid grid-cols-7 gap-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                  <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
                                    {day}
                                  </div>
                                ))}
                                {generateCalendarDays(addMonths(calendarMonth, 1)).map((day, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      if (day.date) {
                                        setSelectedDate(day.date);
                                        setIsDatePickerOpen(false);
                                      }
                                    }}
                                    disabled={!day.isCurrentMonth || day.isPast}
                                    className={`
                                      aspect-square flex items-center justify-center text-sm rounded-full transition-all
                                      ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                                      ${day.isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                                      ${day.isSelected ? 'bg-teal-600 text-white font-semibold' : ''}
                                      ${day.isCurrentMonth && !day.isPast && !day.isSelected ? 'hover:bg-gray-100 text-gray-900' : ''}
                                    `}
                                  >
                                    {day.day}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Next Month Button */}
                            <button
                              onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                              className="absolute right-0 top-12 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors z-10"
                            >
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>

                          {/* Reset Button */}
                          <div className="flex justify-end">
                            <Button
                              onClick={() => {
                                setSelectedDate(new Date(2025, 11, 25));
                                setIsDatePickerOpen(false);
                              }}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Row 2: WAKTU */}
                  <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                    <PopoverTrigger asChild>
                      <div className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold text-gray-900 mb-1">WAKTU</div>
                            <div className="text-sm text-gray-900">{selectedTime}</div>
                          </div>
                          <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start" side="bottom" sideOffset={4}>
                      <div className="grid grid-cols-4 gap-2" style={{ maxWidth: '600px' }}>
                        {generateTimeSlots().map((slot, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedTime(slot);
                              setIsTimePickerOpen(false);
                            }}
                            className={`
                              py-2 px-3 rounded-lg border text-center text-sm transition-all
                              ${selectedTime === slot 
                                ? 'border-teal-600 bg-teal-50 text-teal-900 font-medium' 
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                              }
                            `}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Row 3: TEMPAT */}
                  {/* Row 3: TEMPAT */}
                  <Popover open={isCourtPickerOpen} onOpenChange={setIsCourtPickerOpen}>
                    <PopoverTrigger asChild>
                      <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold text-gray-900 mb-1">TEMPAT</div>
                            <div className="text-sm text-gray-900">{selectedCourt}</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" side="bottom" sideOffset={4}>
                      <div className="flex flex-col max-h-[300px] overflow-y-auto">
                        {Array.from({ length: venue.totalCourts || 3 }).map((_, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setSelectedCourt(`Lapangan ${i + 1}`);
                              setIsCourtPickerOpen(false);
                            }}
                            className={`
                              flex items-center gap-3 p-3 transition-colors cursor-pointer border-b last:border-0 hover:bg-gray-50
                              ${selectedCourt === `Lapangan ${i + 1}` ? 'bg-teal-50' : 'bg-white'}
                            `}
                          >
                            <div className="relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={images[i % images.length]}
                                alt={`Lapangan ${i + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-medium truncate ${selectedCourt === `Lapangan ${i + 1}` ? 'text-teal-900' : 'text-gray-900'}`}>
                                Lapangan {i + 1}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                Lantai Vinyl • Indoor
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs px-2 flex-shrink-0 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200"
                            >
                              Lihat Detail
                            </Button>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  size="lg"
                  className="w-full text-white rounded-xl shadow-sm"
                  style={{ backgroundColor: theme.primary }}
                  onClick={() => {
                    if (!selectedDate || !selectedTime) {
                      // Basic validation feedback
                      setIsDatePickerOpen(true);
                      return;
                    }
                    const params = new URLSearchParams({
                      field: venue.id,
                      date: selectedDate.toISOString(),
                      time: selectedTime,
                      duration: "1"
                    });
                    window.location.href = `/booking?${params.toString()}`;
                  }}
                >
                  Reservasi
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200 bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500">
              © 2025 Sports Field Booking Platform. Prototype Demo.
            </p>
          </div>
        </footer>
      </div>


    </>
  );
}

// Helper function to generate calendar days
function generateCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Add previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isPast: true,
      isSelected: false,
      date: null,
    });
  }
  
  // Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const isSelected = date.getTime() === new Date(2025, 11, 25).setHours(0, 0, 0, 0);
    
    days.push({
      day,
      isCurrentMonth: true,
      isPast,
      isSelected,
      date,
    });
  }
  
  // Add next month days to complete the grid
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      isPast: false,
      isSelected: false,
      date: null,
    });
  }
  
  return days;
}

// Helper function to generate time slots
function generateTimeSlots() {
  const slots = [];
  for (let hour = 6; hour < 24; hour++) {
    const start = `${hour.toString().padStart(2, '0')}.00`;
    const end = `${(hour + 1).toString().padStart(2, '0')}.00`;
    slots.push(`${start} - ${end}`);
  }
  return slots;
}
