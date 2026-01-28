"use client";

import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
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
      {/* Fields Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: theme.textPrimary }}>Lapangan Tersedia</h2>
            <p style={{ color: theme.textSecondary }} className="max-w-xl mx-auto">
              Pilih lapangan yang sesuai dengan kebutuhan Anda
            </p>
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
