"use client";

import { useVenue } from "@/context/VenueContext";
import { formatCurrency } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, MapPin, Users, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function VenuesPage() {
  const { venues, deleteVenue } = useVenue();

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Venue</h1>
          <p className="text-gray-600">Kelola daftar lapangan dan fasilitas.</p>
        </div>
        <Link href="/owner/venues/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Tambah Venue Baru
            </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((field) => (
          <Card key={field.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col p-0 gap-0">
            <div className="relative aspect-video bg-gray-100">
               <Image 
                src={field.image || "/field-1.png"} 
                alt={field.name}
                fill
                className="object-cover"
               />
               <div className="absolute top-2 right-2">
                 <Badge className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur shadow-sm">
                    Active
                 </Badge>
               </div>
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-gray-900">{field.name}</CardTitle>
              <CardDescription className="flex items-center text-gray-500 text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {field.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-gray-600">Harga per sesi</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(field.pricePerHour)}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {field.facilities?.slice(0, 3).map((fac, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-200">
                            {fac}
                        </Badge>
                    ))}
                    {(field.facilities?.length || 0) > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-500">
                            +{(field.facilities?.length || 0) - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-3 border-t border-gray-100 flex gap-2">
                <Link href={`/owner/venues/${field.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 h-9 text-sm">
                        <Edit className="w-3.5 h-3.5 mr-2" />
                        Edit
                    </Button>
                </Link>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 h-9 text-sm">
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Venue <strong>{field.name}</strong> akan dihapus permanen dari daftar.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteVenue(field.id)} className="bg-red-600 hover:bg-red-700">
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
