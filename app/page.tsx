"use client";

import Image from "next/image";
import { MapPin, Clock, Star, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { fields, formatCurrency } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Booking Instan & Mudah</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <span className="text-gray-900 block mb-2">Booking Lapangan</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">
              Jadi Lebih Mudah
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Platform booking lapangan olahraga terpercaya. Pilih jadwal, bayar online,
            dan main tanpa ribet.
          </p>

          {/* CTA */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button
              size="lg"
              onClick={() => document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all cursor-pointer"
            >
              Book Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Fields Section */}
      <section id="venues" className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Lapangan Tersedia</h2>
            {/* Optional: Add Filter/View All controls here if needed */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fields.map((field, index) => (
              <Link key={field.id} href={`/venue/${field.id}`}>
                <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden p-0 gap-0">
                  <div className="aspect-video relative">
                    <Image
                      src={`/field-${index + 1}.png`}
                      alt={field.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge className="text-white border-none" style={{ backgroundColor: theme.primary }}>
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-gray-900">{field.name}</CardTitle>
                    <CardDescription className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {field.location}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 pb-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{field.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {field.facilities.slice(0, 3).map((facility) => (
                        <Badge key={facility} variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between p-6 pt-0">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: theme.primary }}>{formatCurrency(field.pricePerHour)}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        per sesi
                      </div>
                    </div>
                    <Button className="text-white" style={{ backgroundColor: theme.primary }}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2025 Sports Field Booking Platform. Prototype Demo. v1.0.1
          </p>
        </div>
      </footer>
    </div>
  );
}
