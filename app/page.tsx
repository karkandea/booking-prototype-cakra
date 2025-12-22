"use client";

import Image from "next/image";
import { MapPin, Clock, Star, ChevronRight, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";
import { fields, formatCurrency } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 bg-emerald-100 text-emerald-700 border-emerald-200">
              <Zap className="w-3 h-3 mr-1" />
              Booking Instan & Mudah
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                Booking Lapangan
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Jadi Lebih Mudah
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10">
              Platform booking lapangan olahraga terpercaya. Pilih jadwal, bayar online, dan main tanpa ribet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105">
                  Book Now
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { label: "Lapangan Aktif", value: "3+" },
              { label: "Booking/Bulan", value: "500+" },
              { label: "Pelanggan Puas", value: "98%" },
              { label: "Jam Operasional", value: "14 Jam" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Kenapa Pilih Kami?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Kami menyediakan pengalaman booking yang mudah dan cepat
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Booking Instan",
                description: "Pilih jadwal dan langsung booking tanpa perlu menunggu konfirmasi",
              },
              {
                icon: Shield,
                title: "Pembayaran Aman",
                description: "Transaksi aman dengan berbagai metode pembayaran",
              },
              {
                icon: Users,
                title: "Support 24/7",
                description: "Tim kami siap membantu kapanpun Anda butuhkan",
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fields Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Lapangan Tersedia</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
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
                    <Badge className="bg-emerald-600 text-white">
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
                    <div className="text-2xl font-bold text-emerald-600">{formatCurrency(field.pricePerHour)}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      per jam
                    </div>
                  </div>
                  <Link href={`/booking?field=${field.id}`}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Book Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-blue-50 border border-emerald-200 shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Siap Booking Sekarang?</h2>
            <p className="text-gray-600 mb-8">
              Jangan sampai kehabisan jadwal. Booking sekarang dan nikmati pengalaman bermain terbaik!
            </p>
            <Link href="/booking">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25">
                Mulai Booking
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
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
