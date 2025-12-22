"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Calendar, User, CreditCard, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { dummyBookings, fields, formatCurrency } from "@/lib/data";
import { Booking } from "@/lib/types";

export default function OwnerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const stats = {
    total: dummyBookings.length,
    paid: dummyBookings.filter((b) => b.paymentStatus === "paid").length,
    pending: dummyBookings.filter((b) => b.paymentStatus === "pending" || b.paymentStatus === "partial").length,
    revenue: dummyBookings.filter((b) => b.paymentStatus === "paid").reduce((acc, b) => acc + b.totalPrice, 0),
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600">Kelola booking dan lihat status pembayaran</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-gray-500 text-sm">Total Booking</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600">{stats.paid}</div>
              <p className="text-gray-500 text-sm">Booking Lunas</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-gray-500 text-sm">Menunggu Bayar</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.revenue)}</div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking List */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-gray-900">Daftar Booking</CardTitle>
                <CardDescription>Lihat dan kelola semua booking yang masuk</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari booking..."
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
                    <TableHead className="text-gray-600">ID</TableHead>
                    <TableHead className="text-gray-600">Nama</TableHead>
                    <TableHead className="text-gray-600">Lapangan</TableHead>
                    <TableHead className="text-gray-600">Jadwal</TableHead>
                    <TableHead className="text-gray-600">Total</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-mono text-sm text-emerald-600">{booking.id}</TableCell>
                      <TableCell>
                        <div className="text-gray-900">{booking.userName}</div>
                        <div className="text-xs text-gray-500">{booking.userEmail}</div>
                      </TableCell>
                      <TableCell className="text-gray-700">{getField(booking.fieldId)?.name}</TableCell>
                      <TableCell>
                        <div className="text-gray-900">{new Date(booking.date).toLocaleDateString("id-ID")}</div>
                        <div className="text-xs text-gray-500">{booking.time} ({booking.duration} jam)</div>
                      </TableCell>
                      <TableCell className="text-gray-900 font-medium">{formatCurrency(booking.totalPrice)}</TableCell>
                      <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBooking(booking)}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Tidak ada booking yang ditemukan
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-gray-900">
                Detail Booking
                {selectedBooking && (
                  <Badge className="bg-emerald-600 text-white ml-2">{selectedBooking.id}</Badge>
                )}
              </DialogTitle>
              <DialogDescription>Informasi lengkap booking dan barcode verifikasi</DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Informasi Customer
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nama</span>
                      <span className="text-gray-900">{selectedBooking.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="text-gray-900">{selectedBooking.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Telepon</span>
                      <span className="text-gray-900">{selectedBooking.userPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Detail Booking
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lapangan</span>
                      <span className="text-gray-900">{getField(selectedBooking.fieldId)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tanggal</span>
                      <span className="text-gray-900">{new Date(selectedBooking.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Waktu</span>
                      <span className="text-gray-900">{selectedBooking.time} ({selectedBooking.duration} jam)</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pembayaran
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Metode</span>
                      <span className="text-gray-900">{selectedBooking.paymentMethod === "full" ? "Bayar Penuh" : "DP 50%"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      {getStatusBadge(selectedBooking.paymentStatus)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="text-emerald-600 font-bold">{formatCurrency(selectedBooking.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Barcode */}
                <div className="p-6 rounded-lg bg-white border border-gray-200">
                  <div className="flex flex-col items-center">
                    <div className="flex items-end space-x-0.5 h-16">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-900"
                          style={{
                            width: Math.random() > 0.5 ? "3px" : "1px",
                            height: `${50 + Math.random() * 30}%`,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-gray-900 font-mono text-sm mt-2">{selectedBooking.barcode}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Booking dibuat: {new Date(selectedBooking.createdAt).toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
