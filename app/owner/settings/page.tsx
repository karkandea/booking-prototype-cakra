"use client";

import React, { useState } from "react";
import { useTheme, defaultTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, RotateCcw, Layout, CheckCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function BrandSettings() {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const ColorInput = ({ label, value, property, description }: { label: string, value: string, property: keyof typeof theme, description: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-semibold text-gray-700">{label}</Label>
        <span className="text-xs font-mono text-gray-400 capitalize">{value}</span>
      </div>
      <div className="flex gap-3">
        <Input 
          type="color" 
          value={value} 
          onChange={(e) => updateTheme({ [property]: e.target.value })} 
          className="w-12 h-10 p-1 bg-white border-gray-200 cursor-pointer"
        />
        <Input 
          type="text" 
          value={value} 
          onChange={(e) => updateTheme({ [property]: e.target.value })} 
          className="flex-1 bg-white border-gray-200 font-mono text-sm uppercase"
        />
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Theme Settings</h1>
            <p className="text-gray-600">Customize the look and feel of your field booking app.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetTheme} className="border-gray-300">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Theme settings saved and applied successfully (Prototype Preview)</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg">Color Tokens</CardTitle>
                <CardDescription>Adjust these colors to match your brand identity.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <ColorInput 
                    label="Primary Color" 
                    value={theme.primary} 
                    property="primary"
                    description="Used for main buttons, highlights, and primary brand elements."
                  />
                  <ColorInput 
                    label="Secondary Color" 
                    value={theme.secondary} 
                    property="secondary"
                    description="Supporting color for secondary buttons and accents."
                  />
                  <ColorInput 
                    label="Accent Color" 
                    value={theme.accent} 
                    property="accent"
                    description="Subtle background for badges or active item states."
                  />
                  <ColorInput 
                    label="Background Color" 
                    value={theme.background} 
                    property="background"
                    description="Main page background color."
                  />
                  <ColorInput 
                    label="Text Primary" 
                    value={theme.textPrimary} 
                    property="textPrimary"
                    description="Color for main headings and titles."
                  />
                  <ColorInput 
                    label="Text Secondary" 
                    value={theme.textSecondary} 
                    property="textSecondary"
                    description="Color for body text and descriptions."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                <Layout className="w-4 h-4" />
                White-label Note
              </div>
              <p className="text-xs leading-relaxed">
                Changes made here are applied globally using CSS Variables. In this prototype, settings are saved to Local Storage for multi-page persistence without a backend.
              </p>
            </div>
          </div>

          {/* Real-time Preview */}
          <div className="space-y-6">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Live Preview
                </h3>
                <Badge variant="outline" className="text-[10px] text-gray-400 border-gray-200">Interactive Simulation</Badge>
             </div>
             
             {/* Mock Mobile UI Preview */}
             <div className="relative mx-auto w-[320px] h-[640px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl p-4 overflow-hidden ring-4 ring-slate-900/10">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 flex items-center justify-center">
                  <div className="w-20 h-4 bg-slate-900 rounded-full" />
                </div>
                
                <div className="w-full h-full bg-white rounded-[2rem] overflow-y-auto scrollbar-hide flex flex-col pt-6 px-4" style={{ backgroundColor: theme.background }}>
                  {/* Mock Navbar */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: theme.primary }} />
                    <div className="flex gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-100" />
                      <div className="w-4 h-4 rounded-full bg-gray-100" />
                    </div>
                  </div>

                  {/* Mock Hero content */}
                  <div className="space-y-3 mb-8">
                    <div className="h-4 w-24 rounded-full" style={{ backgroundColor: theme.accent }} />
                    <h4 className="text-xl font-bold leading-tight" style={{ color: theme.textPrimary }}>
                      Booking Lapangan <br />
                      <span style={{ color: theme.primary }}>Sekarang Lebih Mudah</span>
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                      Platform booking lapangan olahraga terpercaya. Pilih jadwal dan main.
                    </p>
                    <div className="pt-2">
                      <Button className="w-full h-10 rounded-xl text-white shadow-lg" style={{ backgroundColor: theme.primary }}>
                        Book Now
                      </Button>
                    </div>
                  </div>

                  {/* Mock Steps Area */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: theme.primary }}>1</div>
                      <span className="text-[10px] font-bold" style={{ color: theme.textPrimary }}>Data Diri</span>
                    </div>
                    <div className="w-12 h-[1px] bg-gray-100" />
                    <div className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] text-gray-300">2</div>
                  </div>

                  {/* Mock Form Input */}
                  <div className="space-y-4">
                    <div className="space-y-1.5 text-left">
                       <div className="text-[10px] font-bold" style={{ color: theme.textSecondary }}>NAMA LENGKAP</div>
                       <div className="h-9 w-full rounded-lg border border-gray-200" />
                    </div>
                    <div className="space-y-1.5 text-left">
                       <div className="text-[10px] font-bold" style={{ color: theme.textSecondary }}>METODE PEMBAYARAN</div>
                       <div className="grid grid-cols-2 gap-2">
                          <div className="h-12 rounded-lg border-2 flex items-center justify-center gap-2" style={{ borderColor: theme.primary, backgroundColor: theme.accent }}>
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                             <div className="w-10 h-2 rounded-full bg-gray-200" />
                          </div>
                          <div className="h-12 rounded-lg border border-gray-100 flex items-center justify-center">
                             <div className="w-10 h-2 rounded-full bg-gray-100" />
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-auto mb-6">
                     <p className="text-[8px] text-center mb-2" style={{ color: theme.textSecondary }}>Prototype Demo © 2025</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
