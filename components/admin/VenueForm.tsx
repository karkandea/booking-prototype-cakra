"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Building2, 
  MapPin, 
  Image as ImageIcon, 
  DollarSign, 
  Settings2, 
  FileText, 
  Clock, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  X,
  Plus,
  Upload
} from "lucide-react";
import { Field } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useVenue } from "@/context/VenueContext";
import Image from "next/image";

interface VenueFormProps {
  initialData?: Field;
  mode: "create" | "edit";
}

const STEPS = [
  { id: 1, title: "Informasi Dasar", icon: Building2 },
  { id: 2, title: "Media", icon: ImageIcon },
  { id: 3, title: "Harga & Satuan", icon: DollarSign },
  { id: 4, title: "Fasilitas", icon: Settings2 },
  { id: 5, title: "Aturan Venue", icon: FileText },
  { id: 6, title: "Jadwal & Ketersediaan", icon: Clock },
];

export default function VenueForm({ initialData, mode }: VenueFormProps) {
  const router = useRouter();
  const { addVenue, updateVenue } = useVenue();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Field>>(
    initialData || {
      name: "",
      location: "",
      description: "",
      pricePerHour: 0,
      image: "/field-1.png", // Default image
      images: [],
      facilities: [],
      rules: [],
      openHours: "08:00 - 22:00",
      totalCourts: 1,
      rating: 5.0, // Default rating for new venues
    }
  );

  // Local states for inputs that are lists
  const [newFacility, setNewFacility] = useState("");
  const [newRule, setNewRule] = useState("");

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (mode === "create") {
      const newVenue: Field = {
        ...formData as Field,
        id: `venue-${Date.now()}`,
        rating: 5.0,
        reviews: [],
        images: formData.images?.length ? formData.images : ["/field-1.png", "/field-2.png"], // Mock images
        image: formData.images?.[0] || "/field-1.png"
      };
      addVenue(newVenue);
    } else {
        if (initialData?.id) {
            updateVenue(initialData.id, formData);
        }
    }
    router.push("/owner/venues");
  };

  const updateField = (field: keyof Field, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      updateField("facilities", [...(formData.facilities || []), newFacility]);
      setNewFacility("");
    }
  };

  const removeFacility = (index: number) => {
    const newFacilities = [...(formData.facilities || [])];
    newFacilities.splice(index, 1);
    updateField("facilities", newFacilities);
  };

  const addRule = () => {
    if (newRule.trim()) {
      updateField("rules", [...(formData.rules || []), newRule]);
      setNewRule("");
    }
  };

  const removeRule = (index: number) => {
    const newRules = [...(formData.rules || [])];
    newRules.splice(index, 1);
    updateField("rules", newRules);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Stepper */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex justify-between min-w-[600px]">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-4 ring-emerald-50" 
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${isActive ? "text-emerald-700" : "text-gray-500"}`}>
                  {step.title}
                </span>
                
                {/* Connecting Line */}
                {index < STEPS.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-[2px] -z-10" 
                         style={{ width: "calc(100% + 2rem)", left: "50%" }}>
                        <div className={`h-full ${step.id < currentStep ? "bg-emerald-200" : "bg-gray-100"}`} />
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6">
            <CardTitle className="text-xl text-gray-900">
                {STEPS[currentStep - 1].title}
            </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 min-h-[400px]">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Venue <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Contoh: Gor Badminton Juara" 
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Lokasi / Area <span className="text-red-500">*</span></Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        id="location" 
                        placeholder="Contoh: Jakarta Selatan, DKI Jakarta" 
                        value={formData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="pl-9 bg-white"
                    />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi Singkat</Label>
                <Textarea 
                  id="description" 
                  placeholder="Jelaskan fasilitas dan keunggulan venue Anda..." 
                  className="h-32 bg-white resize-none"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Media */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Upload Foto Venue</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-4">Drag & drop atau klik untuk memilih file</p>
                    <Button size="sm" variant="outline">Pilih File</Button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {/* Mock Previews */}
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                        <Image src="/field-1.png" alt="Preview 1" fill className="object-cover" />
                        <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                     <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                        <Image src="/field-2.png" alt="Preview 2" fill className="object-cover" />
                        <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-md mx-auto">
                 <div className="grid gap-2">
                    <Label htmlFor="price">Harga per Sesi <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                        <Input 
                            id="price" 
                            type="number"
                            placeholder="0" 
                            value={formData.pricePerHour}
                            onChange={(e) => updateField("pricePerHour", Number(e.target.value))}
                            className="pl-10 bg-white text-lg font-semibold"
                        />
                    </div>
                     <p className="text-xs text-gray-500">Harga ini berlaku untuk 1 sesi (biasanya 1 jam).</p>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-4">
                        <Switch id="discount" />
                        <div className="flex-1">
                            <Label htmlFor="discount" className="font-semibold text-emerald-900">Aktifkan Diskon?</Label>
                            <p className="text-xs text-emerald-700">Berikan harga coret untuk menarik pelanggan.</p>
                        </div>
                  </div>
            </div>
          )}

          {/* Step 4: Facilities */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Tambah fasilitas (con: Wifi, Locker)..." 
                        value={newFacility}
                        onChange={(e) => setNewFacility(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addFacility()}
                        className="bg-white"
                    />
                    <Button onClick={addFacility} type="button" variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 min-h-[100px] content-start p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    {!formData.facilities?.length && (
                        <p className="text-sm text-gray-400 w-full text-center py-8">Belum ada fasilitas ditambahkan</p>
                    )}
                    {formData.facilities?.map((fac, i) => (
                        <Badge key={i} variant="secondary" className="bg-white border-gray-200 text-gray-700 pl-3 pr-1 py-1.5 flex items-center gap-1 shadow-sm">
                            {fac}
                            <button onClick={() => removeFacility(i)} className="hover:bg-red-50 hover:text-red-500 p-0.5 rounded-full transition-colors ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase font-semibold">Saran Fasilitas</Label>
                    <div className="flex flex-wrap gap-2">
                        {["AC", "Parking", "Wifi", "Toilet", "Musholla", "Locker Room", "Canteen"].map((suggestion) => (
                            <button 
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                    if (!formData.facilities?.includes(suggestion)) {
                                        updateField("facilities", [...(formData.facilities || []), suggestion]);
                                    }
                                }}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                            >
                                + {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          )}

           {/* Step 5: Rules */}
           {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="flex gap-2">
                    <Input 
                        placeholder="Tulis aturan venue..." 
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addRule()}
                        className="bg-white"
                    />
                    <Button onClick={addRule} type="button" variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-3">
                    {formData.rules?.map((rule, i) => (
                        <div key={i} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200 items-start group">
                             <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                {i + 1}
                             </div>
                             <p className="flex-1 text-sm text-gray-700">{rule}</p>
                             <button onClick={() => removeRule(i)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2Icon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {!formData.rules?.length && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                             <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                             <p className="text-gray-500">Belum ada aturan yang ditambahkan.</p>
                        </div>
                    )}
                </div>
            </div>
          )}

           {/* Step 6: Schedule & Final */}
           {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Jam Buka</Label>
                        <Input type="time" defaultValue="08:00" className="bg-white" />
                    </div>
                     <div className="space-y-2">
                        <Label>Jam Tutup</Label>
                        <Input type="time" defaultValue="22:00" className="bg-white" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label>Jumlah Lapangan (Courts)</Label>
                    <Input 
                        type="number" 
                        min={1} 
                        value={formData.totalCourts} 
                        onChange={(e) => updateField("totalCourts", Number(e.target.value))}
                        className="bg-white"
                    />
                    <p className="text-xs text-gray-500">Sistem akan otomatis membuat sub-unit lapangan (Lapangan 1, Lapangan 2, dst).</p>
                 </div>

                 <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mt-8">
                    <h3 className="font-semibold text-emerald-900 mb-2">Review Summary</h3>
                    <ul className="space-y-2 text-sm text-emerald-800/80">
                        <li className="flex justify-between">
                            <span>Nama:</span> <strong>{formData.name || "-"}</strong>
                        </li>
                         <li className="flex justify-between">
                            <span>Harga:</span> <strong>Rp {formData.pricePerHour?.toLocaleString()}</strong>
                        </li>
                         <li className="flex justify-between">
                            <span>Total Fasilitas:</span> <strong>{formData.facilities?.length} item</strong>
                        </li>
                         <li className="flex justify-between">
                            <span>Status:</span> <Badge className="bg-emerald-200 text-emerald-800 hover:bg-emerald-200">Active</Badge>
                        </li>
                    </ul>
                 </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-white border-t border-gray-100 p-6 flex justify-between">
            <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 1}
                className="w-32"
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Kembali
            </Button>
            
            <Button 
                onClick={handleNext}
                className="w-32 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
                {currentStep === STEPS.length ? (
                    <>
                        Simpan
                        <Check className="w-4 h-4 ml-2" />
                    </>
                ) : (
                    <>
                        Lanjut
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Icon helper
function Trash2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}
