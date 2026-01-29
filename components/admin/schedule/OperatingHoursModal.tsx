"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { OperatingHours } from "@/lib/schedule-types";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface OperatingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHours: OperatingHours;
  onSave: (hours: OperatingHours) => void;
}

export default function OperatingHoursModal({ isOpen, onClose, currentHours, onSave }: OperatingHoursModalProps) {
  const [hours, setHours] = useState<OperatingHours>(currentHours);

  useEffect(() => {
    setHours(currentHours);
  }, [currentHours]);

  const handleSave = () => {
    onSave(hours);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 bg-white rounded-xl shadow-xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            Atur Jam Operasional
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Venue Status Toggle */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="venue-closed" className="text-base font-semibold text-gray-900 cursor-pointer">
                Tutup Venue Hari Ini?
              </Label>
              <span className="text-sm text-gray-500">
                Nonaktifkan booking untuk hari ini.
              </span>
            </div>
            <Switch
              id="venue-closed"
              checked={hours.isClosed}
              onCheckedChange={(checked) => setHours({ ...hours, isClosed: checked })}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* Time Inputs */}
          <div className={`grid grid-cols-2 gap-6 transition-opacity duration-200 ${hours.isClosed ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="space-y-3">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Jam Buka
              </Label>
              <div className="relative group">
                <Input
                  type="number"
                  min={0} max={23}
                  value={hours.open}
                  onChange={(e) => setHours({ ...hours, open: parseInt(e.target.value) })}
                  className="pr-12 h-14 text-2xl font-bold text-gray-900 bg-gray-50 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-center rounded-xl"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  :00
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Jam Tutup
              </Label>
              <div className="relative group">
                <Input
                  type="number"
                  min={0} max={24}
                  value={hours.close}
                  onChange={(e) => setHours({ ...hours, close: parseInt(e.target.value) })}
                  className="pr-12 h-14 text-2xl font-bold text-gray-900 bg-gray-50 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-center rounded-xl"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  :00
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8 gap-3 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 font-medium"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 shadow-lg shadow-emerald-600/20 rounded-lg"
          >
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
