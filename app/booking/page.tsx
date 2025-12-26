"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, CreditCard, CheckCircle, Loader2, Building, QrCode, Wallet, Store, ChevronRight, Info, Download, Share2, Printer, Copy, Check, Tag, XCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Image from "next/image";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fields, generateTimeSlots, formatCurrency, generateBookingId } from "@/lib/data";
import { BookingFormData, ScheduleData, Booking, TimeSlot, PaymentType } from "@/lib/types";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { useTheme } from "@/context/ThemeContext";

const PAYMENT_TYPES = [
  { id: "va", name: "Virtual Account", icon: Building, description: "BCA, BNI, BRI, Mandiri, Permata, CIMB" },
  { id: "qris", name: "QRIS", icon: QrCode, description: "Scan QR menggunakan aplikasi e-wallet atau mobile banking" },
  { id: "ewallet", name: "E-Wallet", icon: Wallet, description: "GoPay, OVO, DANA, ShopeePay, LinkAja" },
  { id: "retail", name: "Retail Outlet", icon: Store, description: "Alfamart, Indomaret" },
  { id: "card", name: "Kartu Kredit/Debit", icon: CreditCard, description: "Visa, Mastercard" },
] as const;

const VA_BANKS = ["BCA", "BNI", "BRI", "Mandiri", "Permata", "CIMB Niaga"];
const E_WALLETS = ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"];
const RETAIL_OUTLETS = ["Alfamart", "Indomaret"];
const CARD_TYPES = ["Visa", "Mastercard"];

function BookingContent() {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fieldParam = searchParams.get("field");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const durationParam = searchParams.get("duration");
  
  const [step, setStep] = useState(1);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({ name: "", email: "", phone: "" });
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    fieldId: fieldParam || fields[0].id,
    date: dateParam ? new Date(dateParam) : undefined,
    time: timeParam || "",
    duration: durationParam ? parseInt(durationParam) : 1,
  });
  const [paymentMethod, setPaymentMethod] = useState<"full" | "dp">("full");
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed" | "simulating">("idle");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedField = fields.find((f) => f.id === scheduleData.fieldId) || fields[0];

  useEffect(() => {
    if (scheduleData.date) {
      setTimeSlots(generateTimeSlots(scheduleData.date));
    }
  }, [scheduleData.date]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const BookingSummaryCard = () => (
    <div className="p-6 border-b border-gray-100 bg-white">
      <div className="flex gap-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
          <Image 
            src={selectedField.image}
            alt={selectedField.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg truncate">{selectedField.name}</h3>
          <p className="text-gray-500 text-sm">Lapangan A</p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-900">4.9</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">(15 rating)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <h4 className="font-bold text-sm text-gray-900 uppercase tracking-tight">Gratis Pembatalan</h4>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Pembatalan bisa dilakukan sebelum tanggal {scheduleData.date ? format(scheduleData.date, 'dd MMMM yyyy', { locale: idLocale }) : '25 Desember 2025'}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Harga Sewa ({scheduleData.duration} jam)</span>
          <span className="font-semibold text-gray-900">{formatCurrency(basePrice)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Biaya Layanan</span>
          <span className="font-semibold text-gray-900">{formatCurrency(serviceFee)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Pajak (11%)</span>
          <span className="font-semibold text-gray-900">{formatCurrency(tax)}</span>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-base font-bold text-gray-900">Total Tagihan</span>
          <span className="text-xl font-black" style={{ color: theme.primary }}>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );

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



  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
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
          paymentType: selectedPaymentType || undefined,
          paymentDetail: selectedPaymentDetail || undefined,
          createdAt: new Date().toISOString(),
          barcode: `${generateBookingId()}-VERIFIED`,
        };
        setBooking(newBooking);
        setPaymentStatus("success");
        setStep(3);
      } else {
        setPaymentStatus("failed");
      }
    }, 1500);
  };

  const basePrice = selectedField.pricePerHour * scheduleData.duration;
  const discount = isVoucherApplied ? basePrice * 0.2 : 0;
  const serviceFee = 4500;
  const tax = (basePrice - discount) * 0.11;
  const totalPrice = basePrice - discount + serviceFee + tax;
  const payAmount = paymentMethod === "dp" ? totalPrice * 0.5 : totalPrice;

  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const handleCheckStatus = () => {
    setIsCheckingStatus(true);
    setTimeout(() => {
      setIsCheckingStatus(false);
      handlePayment(true);
    }, 2000);
  };

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === "PROMO20") {
      setIsVoucherApplied(true);
      setErrors({ ...errors, voucher: "" });
    } else {
      setErrors({ ...errors, voucher: "Kode voucher tidak valid" });
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleBack = () => {
    if (step === 2 && selectedPaymentDetail) {
      setSelectedPaymentDetail(null);
    } else if (step === 2 && selectedPaymentType) {
      setSelectedPaymentType(null);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  };

  const steps = [
    { num: 1, label: "Data Diri", icon: User },
    { num: 2, label: "Pembayaran", icon: CreditCard },
    { num: 3, label: "Selesai", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 mb-4" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Booking Lapangan</h1>
          <p className="text-gray-600">{selectedField.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-8 px-4">
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200" />
          <div 
            className="absolute top-5 left-8 h-0.5 transition-all duration-500 ease-in-out" 
            style={{ 
              backgroundColor: theme.primary,
              width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'
            }} 
          />
          
          <div className="relative flex justify-between">
            {steps.map((s, i) => (
              <div key={s.num} className="flex flex-col items-center group">
                <div 
                  className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 bg-white" 
                  style={{ 
                    borderColor: step >= s.num ? theme.primary : '#d1d5db',
                    backgroundColor: step >= s.num ? theme.primary : 'white',
                    color: step >= s.num ? 'white' : '#9ca3af'
                  }}
                >
                  <s.icon className={`w-5 h-5`} />
                </div>
                <div className="mt-3 text-center">
                  <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, "") })}
                  className="bg-white border-gray-300 text-gray-900 mt-1"
                  placeholder="081234567890"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCancelDialogOpen(true)} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Batal Booking
                </Button>
                <Button onClick={handleNext} className="flex-1 text-white" style={{ backgroundColor: theme.primary }}>
                  Lanjut ke Pembayaran
                </Button>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Step 2: Payment */}
        {step === 2 && (
          <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Pembayaran</CardTitle>
                  <CardDescription>Pilih metode pembayaran untuk menyelesaikan booking</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Bayar</div>
                  <div className="text-xl font-bold" style={{ color: theme.primary }}>{formatCurrency(payAmount)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <BookingSummaryCard />
              {!selectedPaymentType ? (
                /* Screen 1: Choose Payment Type */
                <div className="p-6">
                  {/* Payment Strategy (Full/DP) */}
                  <div className="mb-8">
                    <Label className="text-gray-700 mb-3 block font-semibold">Opsi Pembayaran</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div 
                        onClick={() => setPaymentMethod("full")}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          paymentMethod === "full" ? "border-emerald-500 bg-emerald-50" : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`} style={{ borderColor: paymentMethod === "full" ? theme.primary : '#d1d5db' }}>
                          {paymentMethod === "full" && <div className="w-2.5 h-2.5 rounded-full transition-all" style={{ backgroundColor: theme.primary }} />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-900">Bayar Penuh</div>
                          <div className="text-xs text-gray-500 font-medium">Lunas Sekarang</div>
                        </div>
                        <Badge className="border-none text-[10px]" style={{ backgroundColor: theme.accent, color: theme.primary }}>Recommended</Badge>
                      </div>
                      <div 
                        onClick={() => setPaymentMethod("dp")}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3`}
                        style={{ 
                          borderColor: paymentMethod === "dp" ? theme.primary : '#f3f4f6',
                          backgroundColor: paymentMethod === "dp" ? theme.accent : 'white'
                        }}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`} style={{ borderColor: paymentMethod === "dp" ? theme.primary : '#d1d5db' }}>
                          {paymentMethod === "dp" && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-900">DP 50%</div>
                          <div className="text-xs text-gray-500 font-medium">Bayar di lokasi: {formatCurrency(totalPrice * 0.5)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voucher Code */}
                  <div className="mb-8 p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50">
                    <Label className="text-gray-700 mb-3 block text-xs font-bold uppercase tracking-wider">Punya Kode Promo?</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder="Masukkan kode (e.g. PROMO20)" 
                          className="pl-9 bg-white border-gray-200"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          disabled={isVoucherApplied}
                        />
                      </div>
                      <Button 
                        variant={isVoucherApplied ? "secondary" : "default"}
                        onClick={handleApplyVoucher}
                        disabled={isVoucherApplied}
                        className={isVoucherApplied ? "bg-emerald-100 text-emerald-700" : "bg-gray-900 text-white"}
                      >
                        {isVoucherApplied ? "Applied" : "Apply"}
                      </Button>
                    </div>
                    {errors.voucher && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.voucher}</p>}
                    {isVoucherApplied && (
                      <p className="text-[10px] mt-1 font-bold" style={{ color: theme.primary }}>✓ Voucher PROMO20 berhasil dipasang! (Diskon 20%)</p>
                    )}
                  </div>

                  <Label className="text-gray-700 mb-3 block font-semibold">Pilih Metode Pembayaran</Label>
                  <div className="space-y-3">
                    {PAYMENT_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => {
                          setSelectedPaymentType(type.id);
                          if (type.id === "qris") setSelectedPaymentDetail("QRIS (All Payment)");
                        }}
                        className="group cursor-pointer p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-opacity-50 transition-colors" style={{ backgroundColor: theme.accent }}>
                          <type.icon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" style={{ color: theme.primary }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{type.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{type.description}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Button variant="ghost" onClick={() => setIsCancelDialogOpen(true)} className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Batal Booking
                    </Button>
                  </div>
                </div>
              ) : !selectedPaymentDetail ? (
                /* Screen 2: Choose Payment Detail (for VA, E-Wallet, etc.) */
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPaymentType(null)} className="h-8 w-8 p-0 rounded-full">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-bold uppercase tracking-wider text-[10px]">
                      {PAYMENT_TYPES.find(t => t.id === selectedPaymentType)?.name}
                    </Badge>
                  </div>
                  
                  <Label className="text-gray-700 mb-4 block font-semibold">Pilih Provider</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(selectedPaymentType === "va" ? VA_BANKS : 
                      selectedPaymentType === "ewallet" ? E_WALLETS : 
                      selectedPaymentType === "retail" ? RETAIL_OUTLETS : 
                      CARD_TYPES).map((detail) => (
                      <div
                        key={detail}
                        onClick={() => setSelectedPaymentDetail(detail)}
                        className="cursor-pointer p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 hover:shadow-sm transition-all flex items-center justify-between group"
                      >
                        <span className="font-medium text-gray-900">{detail}</span>
                        <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-primary group-hover:bg-opacity-20 transition-all" style={{ backgroundColor: theme.accent }}>
                          <div className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: theme.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Screen 3: Simulation Screen */
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPaymentDetail(null)} className="h-8 w-8 p-0 rounded-full">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                       <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-bold uppercase tracking-wider text-[10px]">
                        {PAYMENT_TYPES.find(t => t.id === selectedPaymentType)?.name}
                      </Badge>
                      <span className="text-gray-300">/</span>
                      <span className="text-sm font-bold text-gray-900">{selectedPaymentDetail}</span>
                    </div>
                  </div>

                  {/* Simulation Area */}
                  <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 mb-8 flex flex-col items-center text-center">
                    {selectedPaymentType === "va" && (
                      <div className="space-y-4 w-full">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Nomor Virtual Account</div>
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-mono font-bold text-gray-900 tracking-wider">8801 1234 5678</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCopy("880112345678", "va")}
                            className="mt-2 text-emerald-600 hover:bg-emerald-50 h-8"
                          >
                            {copied === "va" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                            {copied === "va" ? "Copied" : "Copy VA Number"}
                          </Button>
                        </div>
                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          <p className="text-[10px] text-gray-500 text-center">Terpotong diskon & sudah termasuk biaya layanan</p>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-xs"
                            onClick={handleCheckStatus}
                            disabled={isCheckingStatus}
                          >
                            {isCheckingStatus ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                Mengecek Pembayaran...
                              </>
                            ) : (
                              "Cek Status Pembayaran"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedPaymentType === "qris" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 mx-auto w-fit">
                          <QRCodeGenerator value="DUMMY_QRIS_PAYMENT_DATA" size={160} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Scan QRIS untuk membayar</p>
                          <p className="text-xs text-gray-500 mt-1 italic">QRIS support all payment apps</p>
                        </div>
                      </div>
                    )}

                    {selectedPaymentType === "ewallet" && (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-2 border border-gray-100">
                          <Wallet className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Selesaikan pembayaran di aplikasi {selectedPaymentDetail}</p>
                          <p className="text-xs text-gray-500 mt-1">Buka aplikasi {selectedPaymentDetail} Anda untuk konfirmasi</p>
                        </div>
                      </div>
                    )}

                    {selectedPaymentType === "retail" && (
                      <div className="space-y-4 w-full">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Kode Pembayaran</div>
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-mono font-bold text-gray-900 tracking-wider">PRTY-998877</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCopy("PRTY-998877", "retail")}
                            className="mt-2 text-emerald-600 hover:bg-emerald-50 h-8"
                          >
                            {copied === "retail" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                            {copied === "retail" ? "Copied" : "Copy Code"}
                          </Button>
                        </div>
                        <div className="pt-4 border-t border-gray-200 space-y-3">
                          <p className="text-[10px] text-gray-500 text-center">Tunjukkan kode ini ke kasir {selectedPaymentDetail}</p>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-xs"
                            onClick={handleCheckStatus}
                            disabled={isCheckingStatus}
                          >
                            {isCheckingStatus ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                Mengecek Pembayaran...
                              </>
                            ) : (
                              "Cek Status Pembayaran"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedPaymentType === "card" && (
                      <div className="w-full space-y-4 text-left">
                        <div className="space-y-2">
                          <Label className="text-gray-600 text-[10px] uppercase font-bold">Nomor Kartu</Label>
                          <Input disabled value="**** **** **** 4242" className="bg-white border-gray-200 font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-600 text-[10px] uppercase font-bold">Expiry</Label>
                            <Input disabled value="12/28" className="bg-white border-gray-200" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-600 text-[10px] uppercase font-bold">CVV</Label>
                            <Input disabled value="***" className="bg-white border-gray-200" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {paymentStatus === "processing" ? (
                      <div className="flex flex-col items-center justify-center p-4">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        <span className="mt-2 text-sm font-medium text-gray-600">Memproses...</span>
                      </div>
                    ) : (
                      <>
                        {paymentStatus === "failed" && (
                          <div className="space-y-4 mb-4">
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center">
                              <p className="text-xs text-red-600 font-bold">Simulasi Pembayaran Gagal</p>
                              <p className="text-[10px] text-gray-500 mt-1">Silakan coba lagi atau pilih metode lain</p>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setSelectedPaymentType(null);
                                setSelectedPaymentDetail(null);
                                setPaymentStatus("idle");
                              }}
                              className="w-full border-gray-200 text-gray-600 h-10 text-xs"
                            >
                              Pilih Metode Pembayaran Lain
                            </Button>
                          </div>
                        )}
                        <Button 
                          onClick={() => handlePayment(true)}
                          className="w-full text-white h-14 rounded-xl shadow-lg"
                          style={{ backgroundColor: theme.primary, boxShadow: `0 10px 15px -3px ${theme.primary}40` }}
                        >
                          Simulate Success
                        </Button>
                        <Button 
                          onClick={() => handlePayment(false)}
                          variant="ghost" 
                          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 h-14 rounded-xl"
                        >
                          Simulate Failure
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
                      Ini adalah simulasi dummy untuk tujuan prototype. Tidak ada transaksi riil yang terjadi. Sesuai PRD, simulasi ini mengikuti flow Xendit.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && booking && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-8 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: theme.accent }}>
                <CheckCircle className="w-10 h-10" style={{ color: theme.primary }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil!</h2>
              <p className="text-gray-600 mb-6">Simpan bukti booking ini untuk verifikasi saat datang</p>

              {/* Booking Details */}
              <div className="p-6 rounded-lg bg-gray-50 border border-gray-200 text-left mb-6">
                <div className="text-center mb-4">
                  <Badge className="text-white px-4 py-1 text-lg border-none" style={{ backgroundColor: theme.primary }}>{booking.id}</Badge>
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
                    <Badge className="text-white border-none" style={{ backgroundColor: booking.paymentStatus === "paid" ? theme.primary : theme.secondary }}>
                      {booking.paymentStatus === "paid" ? "Lunas" : "DP 50%"}
                    </Badge>
                  </div>
                  {booking.paymentType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Metode Pembayaran</span>
                      <span className="text-gray-900 font-medium">
                        {PAYMENT_TYPES.find(t => t.id === booking.paymentType)?.name} 
                        {booking.paymentDetail && ` - ${booking.paymentDetail}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Biaya Sewa</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(basePrice)}</span>
                  </div>
                  {isVoucherApplied && (
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Diskon</span>
                      <span className="text-emerald-600 font-medium">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Biaya Layanan & Pajak</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(serviceFee + tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2">
                    <span className="text-gray-500">Total Dibayar</span>
                    <span className="font-bold text-lg" style={{ color: theme.primary }}>{formatCurrency(totalPrice)}</span>
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

              <div className="grid grid-cols-3 gap-3 mb-8">
                <Button variant="outline" size="sm" onClick={() => alert("Receipt downloaded! (Simulation)")} className="flex flex-col h-auto py-3 gap-1 border-gray-200">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] text-gray-500 font-medium">Download</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert("Shareable link copied! (Simulation)")} className="flex flex-col h-auto py-3 gap-1 border-gray-200">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] text-gray-500 font-medium">Share</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()} className="flex flex-col h-auto py-3 gap-1 border-gray-200">
                  <Printer className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] text-gray-500 font-medium">Print</span>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mb-6 font-medium">
                Email konfirmasi telah dikirim ke <span className="text-gray-900">{booking.userEmail}</span>
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

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Batalkan Booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Semua data yang sudah Anda masukkan akan terhapus. Apakah Anda yakin ingin membatalkan booking ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100">Kembali</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.push("/")}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
