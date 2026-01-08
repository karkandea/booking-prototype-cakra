"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dummyBookings, fields, formatCurrency } from "@/lib/data";
import { Booking } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, Clock, AlertCircle, Eye, Download, Filter } from "lucide-react";

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = dummyBookings.filter((booking) =>
    booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getField = (fieldId: string) => fields.find((f) => f.id === fieldId);

  const getStatusBadge = (status: Booking["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" /> Lunas</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> DP</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertCircle className="w-3 h-3 mr-1" /> Gagal</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Pantau semua reservasi lapangan di sini.</p>
        </div>
        <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
        </Button>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-gray-50 border-gray-200 text-gray-700">All Status</Button>
                <Button variant="outline" size="sm" className="bg-white border-dashed text-gray-500">
                    <Filter className="w-3 h-3 mr-2" /> Filter
                </Button>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari ID, Nama, Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-transparent">
                    <TableHead className="text-gray-600">ID Booking</TableHead>
                    <TableHead className="text-gray-600">Customer</TableHead>
                    <TableHead className="text-gray-600">Lapangan</TableHead>
                    <TableHead className="text-gray-600">Jadwal Main</TableHead>
                    <TableHead className="text-gray-600">Total</TableHead>
                    <TableHead className="text-gray-600">Pembayaran</TableHead>
                    <TableHead className="text-gray-600">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-mono text-sm font-medium text-gray-900">{booking.id}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                        <div className="text-xs text-gray-500">{booking.userPhone}</div>
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">{getField(booking.fieldId)?.name}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString("id-ID")}</div>
                        <div className="text-xs text-gray-500">{booking.time} ({booking.duration} jam)</div>
                      </TableCell>
                      <TableCell className="text-gray-900 font-medium">{formatCurrency(booking.totalPrice)}</TableCell>
                      <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredBookings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Tidak ada booking yang cocok dengan pencarian Anda.
                </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
