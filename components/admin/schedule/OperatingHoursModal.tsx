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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Atur Jam Operasional
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
           <div className="flex items-center justify-between space-x-2 bg-gray-50 p-4 rounded-lg">
            <Label htmlFor="venue-closed" className="flex flex-col space-y-1">
              <span>Tutup Venue Hari Ini?</span>
              <span className="font-normal text-xs text-gray-500">Venue tidak akan menerima booking seharian ini.</span>
            </Label>
            <Switch 
                id="venue-closed" 
                checked={hours.isClosed} 
                onCheckedChange={(checked) => setHours({...hours, isClosed: checked})} 
            />
          </div>

          <div className={`grid grid-cols-2 gap-4 ${hours.isClosed ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="space-y-2">
                <Label>Jam Buka</Label>
                <div className="relative">
                    <Input 
                        type="number" 
                        min={0} max={23} 
                        value={hours.open} 
                        onChange={(e) => setHours({...hours, open: parseInt(e.target.value)})}
                        className="pl-8"
                    />
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">:00</span>
                </div>
             </div>
             <div className="space-y-2">
                <Label>Jam Tutup</Label>
                <div className="relative">
                    <Input 
                        type="number" 
                        min={0} max={24} 
                        value={hours.close} 
                        onChange={(e) => setHours({...hours, close: parseInt(e.target.value)})}
                         className="pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">:00</span>
                </div>
             </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          <Button type="button" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
