"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fields, generateTimeSlots, formatCurrency, generateBookingId } from "@/lib/data";
import { BookingFormData, ScheduleData, Booking, TimeSlot } from "@/lib/types";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";

function BookingContent() {
  const searchParams = useSearchParams();
  const fieldParam = searchParams.get("field");
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({ name: "", email: "", phone: "" });
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    fieldId: fieldParam || fields[0].id,
    date: undefined,
    time: "",
    duration: 1,
  });
  const [paymentMethod, setPaymentMethod] = useState<"full" | "dp">("full");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedField = fields.find((f) => f.id === scheduleData.fieldId) || fields[0];

  useEffect(() => {
    if (scheduleData.date) {
      setTimeSlots(generateTimeSlots(scheduleData.date));
    }
  }, [scheduleData.date]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
    if (!formData.email.trim()) newErrors.email = "Email harus diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Format email tidak valid";
    if (!formData.phone.trim()) newErrors.phone = "Nomor HP harus diisi";
    else if (!/^[0-9]{10,13}$/.test(formData.phone)) newErrors.phone = "Nomor HP tidak valid (10-13 digit)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!scheduleData.date) newErrors.date = "Pilih tanggal booking";
    if (!scheduleData.time) newErrors.time = "Pilih waktu bermain";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handlePayment = (success: boolean) => {
    setPaymentStatus("processing");
    setTimeout(() => {
      if (success) {
        const newBooking: Booking = {
          id: generateBookingId(),
          fieldId: scheduleData.fieldId,
          userName: formData.name,
          userEmail: formData.email,
          userPhone: formData.phone,
          date: scheduleData.date!.toISOString().split("T")[0],
          time: scheduleData.time,
          duration: scheduleData.duration,
          totalPrice: selectedField.pricePerHour * scheduleData.duration * (paymentMethod === "dp" ? 0.5 : 1),
          paymentStatus: paymentMethod === "dp" ? "partial" : "paid",
          paymentMethod,
          createdAt: new Date().toISOString(),
          barcode: `${generateBookingId()}-VERIFIED`,
        };
        setBooking(newBooking);
        setPaymentStatus("success");
        setStep(4);
      } else {
        setPaymentStatus("failed");
      }
    }, 1500);
  };

  const totalPrice = selectedField.pricePerHour * scheduleData.duration;
  const payAmount = paymentMethod === "dp" ? totalPrice * 0.5 : totalPrice;

  const steps = [
    { num: 1, label: "Data Diri", icon: User },
    { num: 2, label: "Jadwal", icon: Calendar },
    { num: 3, label: "Pembayaran", icon: CreditCard },
    { num: 4, label: "Selesai", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Booking Lapangan</h1>
          <p className="text-gray-600">{selectedField.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                step >= s.num ? "bg-emerald-600 border-emerald-600" : "border-gray-300 bg-white"
              }`}>
                <s.icon className={`w-5 h-5 ${step >= s.num ? "text-white" : "text-gray-400"}`} />
              </div>
              <span className={`hidden sm:block ml-2 text-sm ${step >= s.num ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > s.num ? "bg-emerald-600" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: User Details */}
        {step === 1 && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Data Diri</CardTitle>
              <CardDescription>Masukkan data diri Anda untuk melanjutkan booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900 mt-1"
                  placeholder="Masukkan nama lengkap"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900 mt-1"
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700">Nomor HP</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900 mt-1"
                  placeholder="081234567890"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <Button onClick={handleNext} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Lanjut ke Jadwal
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schedule Selection */}
        {step === 2 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Pilih Tanggal</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={scheduleData.date}
                  onSelect={(date) => setScheduleData({ ...scheduleData, date, time: "" })}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border border-gray-200 bg-white"
                />
                {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Pilih Waktu & Durasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-700">Lapangan</Label>
                  <Select
                    value={scheduleData.fieldId}
                    onValueChange={(v) => setScheduleData({ ...scheduleData, fieldId: v })}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {fields.map((f) => (
                        <SelectItem key={f.id} value={f.id} className="text-gray-900">
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {scheduleData.date && (
                  <div>
                    <Label className="text-gray-700">Waktu</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={scheduleData.time === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setScheduleData({ ...scheduleData, time: slot.time })}
                          className={`text-sm ${
                            scheduleData.time === slot.time
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : slot.available
                              ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                              : "border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                    {errors.time && <p className="text-red-500 text-sm mt-2">{errors.time}</p>}
                  </div>
                )}

                <div>
                  <Label className="text-gray-700">Durasi (jam)</Label>
                  <Select
                    value={scheduleData.duration.toString()}
                    onValueChange={(v) => setScheduleData({ ...scheduleData, duration: parseInt(v) })}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {[1, 2, 3, 4].map((d) => (
                        <SelectItem key={d} value={d.toString()} className="text-gray-900">
                          {d} jam
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Harga per jam</span>
                    <span>{formatCurrency(selectedField.pricePerHour)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-emerald-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100">
                    Kembali
                  </Button>
                  <Button onClick={handleNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                    Lanjut ke Pembayaran
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Pembayaran</CardTitle>
              <CardDescription>Pilih metode pembayaran dan simulasikan transaksi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Summary */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Ringkasan Booking</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Lapangan</span>
                    <span className="text-gray-900">{selectedField.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tanggal</span>
                    <span className="text-gray-900">{scheduleData.date?.toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Waktu</span>
                    <span className="text-gray-900">{scheduleData.time} ({scheduleData.duration} jam)</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Nama</span>
                    <span className="text-gray-900">{formData.name}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <Label className="text-gray-700 mb-3 block">Metode Pembayaran</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "full" | "dp")}>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-gray-200 bg-white hover:border-emerald-300 transition-colors">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="flex-1 cursor-pointer">
                      <div className="text-gray-900">Bayar Penuh</div>
                      <div className="text-sm text-gray-500">{formatCurrency(totalPrice)}</div>
                    </Label>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Recommended</Badge>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-gray-200 bg-white hover:border-emerald-300 transition-colors mt-2">
                    <RadioGroupItem value="dp" id="dp" />
                    <Label htmlFor="dp" className="flex-1 cursor-pointer">
                      <div className="text-gray-900">DP 50%</div>
                      <div className="text-sm text-gray-500">{formatCurrency(totalPrice * 0.5)} (sisa bayar di lokasi)</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Amount */}
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-emerald-700">Total Bayar Sekarang</span>
                  <span className="text-emerald-700">{formatCurrency(payAmount)}</span>
                </div>
              </div>

              {/* Payment Status */}
              {paymentStatus === "processing" && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Memproses pembayaran...</span>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-center">
                  <p className="text-red-600 font-semibold">Pembayaran Gagal</p>
                  <p className="text-sm text-gray-600 mt-1">Silakan coba lagi</p>
                </div>
              )}

              {/* Payment Buttons */}
              {paymentStatus !== "processing" && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handlePayment(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-6"
                  >
                    Simulate Success
                  </Button>
                  <Button
                    onClick={() => handlePayment(false)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 py-6"
                  >
                    Simulate Failed
                  </Button>
                </div>
              )}

              <Button variant="ghost" onClick={() => setStep(2)} className="w-full text-gray-600 hover:text-gray-900">
                Kembali ke Jadwal
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && booking && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-8 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil!</h2>
              <p className="text-gray-600 mb-6">Simpan bukti booking ini untuk verifikasi saat datang</p>

              {/* Booking Details */}
              <div className="p-6 rounded-lg bg-gray-50 border border-gray-200 text-left mb-6">
                <div className="text-center mb-4">
                  <Badge className="bg-emerald-600 text-white px-4 py-1 text-lg">{booking.id}</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lapangan</span>
                    <span className="text-gray-900">{selectedField.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="text-gray-900">{new Date(booking.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Waktu</span>
                    <span className="text-gray-900">{booking.time} ({booking.duration} jam)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nama</span>
                    <span className="text-gray-900">{booking.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status Pembayaran</span>
                    <Badge className={booking.paymentStatus === "paid" ? "bg-emerald-600 text-white" : "bg-yellow-500 text-white"}>
                      {booking.paymentStatus === "paid" ? "Lunas" : "DP 50%"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Dibayar</span>
                    <span className="text-emerald-600 font-bold">{formatCurrency(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-6 rounded-lg bg-white border border-gray-200 mb-6">
                <div className="flex flex-col items-center">
                  <QRCodeGenerator 
                    value={JSON.stringify({
                      bookingId: booking.id,
                      barcode: booking.barcode,
                      field: selectedField.name,
                      date: booking.date,
                      time: booking.time,
                      duration: booking.duration,
                      userName: booking.userName,
                    })}
                    size={180}
                  />
                  <p className="text-gray-900 font-mono text-sm mt-3">{booking.id}</p>
                  <p className="text-gray-500 text-xs mt-1">Scan QR untuk verifikasi</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Email konfirmasi telah dikirim ke {booking.userEmail}
              </p>

              <div className="flex gap-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100">
                    Kembali ke Home
                  </Button>
                </Link>
                <Link href="/booking" className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Booking Lagi
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
