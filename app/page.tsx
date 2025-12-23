"use client";

import Image from "next/image";
import { MapPin, Clock, Star, ChevronRight, Zap } from "lucide-react";
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
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-40 shadow-2xl" style={{ backgroundColor: theme.accent }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 border-none" style={{ backgroundColor: theme.accent, color: theme.primary }}>
              <Zap className="w-3 h-3 mr-1" />
              Booking Instan & Mudah
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                Booking Lapangan
              </span>
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to r, ${theme.primary}, ${theme.secondary}, ${theme.primary})` }}>
                Jadi Lebih Mudah
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10">
              Platform booking lapangan olahraga terpercaya. Pilih jadwal, bayar online, dan main tanpa ribet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button size="lg" className="text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105" style={{ backgroundColor: theme.primary, boxShadow: `0 10px 15px -3px ${theme.primary}40` }}>
                  Book Now
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

            </div>
          </div>
          
        </div>
      </section>


      {/* Fields Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: theme.textPrimary }}>Lapangan Tersedia</h2>
            <p style={{ color: theme.textSecondary }} className="max-w-xl mx-auto">
              Pilih lapangan yang sesuai dengan kebutuhan Anda
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fields.map((field, index) => (
              <Card key={field.id} className="bg-white border-gray-200 overflow-hidden group hover:border-emerald-300 hover:shadow-xl transition-all">
                <div className="aspect-video relative overflow-hidden">
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
                
                <CardHeader>
                  <CardTitle className="text-gray-900">{field.name}</CardTitle>
                  <CardDescription className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {field.location}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{field.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {field.facilities.slice(0, 3).map((facility) => (
                      <Badge key={facility} variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold" style={{ color: theme.primary }}>{formatCurrency(field.pricePerHour)}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      per jam
                    </div>
                  </div>
                  <Link href={`/booking?field=${field.id}`}>
                    <Button className="text-white" style={{ backgroundColor: theme.primary }}>
                      Book Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2025 Sports Field Booking Platform. Prototype Demo.
          </p>
        </div>
      </footer>
    </div>
  );
}
