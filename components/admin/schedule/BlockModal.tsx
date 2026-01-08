"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleBlock, BlockStatus } from "@/lib/schedule-types";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: Partial<ScheduleBlock> | null;
  onSave: (block: ScheduleBlock) => void;
  onDelete: (blockId: string) => void;
}

export default function BlockModal({ isOpen, onClose, block, onSave, onDelete }: BlockModalProps) {
  const [data, setData] = useState<Partial<ScheduleBlock>>({
      status: "blocked",
      duration: 1,
      title: "Maintenance"
  });

  useEffect(() => {
    if (block) {
        setData(block);
    }
  }, [block]);

  const handleSave = () => {
    if (data.startHour !== undefined && data.fieldId) {
        onSave(data as ScheduleBlock);
    }
    onClose();
  };

  const isReadOnly = data.status === "booked";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
             {data.id ? "Edit Slot" : "Block Slot Baru"}
          </DialogTitle>
          <DialogDescription>
             {isReadOnly ? "Slot ini dibooking oleh customer. Anda hanya dapat melihat detailnya." : "Atur ketersediaan slot ini manual."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
             {isReadOnly && (
                <div className="bg-emerald-50 p-3 rounded-md border border-emerald-100 mb-2">
                    <p className="text-xs text-emerald-800"><strong>Booking ID:</strong> {data.bookingId || "-"}</p>
                </div>
             )}

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Jam Mulai</Label>
                    <div className="p-2 border rounded-md bg-gray-50 text-sm text-gray-700">
                        {data.startHour?.toString().padStart(2, '0')}:00
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Durasi (Jam)</Label>
                    <Select 
                        disabled={isReadOnly}
                        value={data.duration?.toString()} 
                        onValueChange={(val) => setData({...data, duration: parseFloat(val)})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih durasi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 Jam</SelectItem>
                            <SelectItem value="2">2 Jam</SelectItem>
                            <SelectItem value="3">3 Jam</SelectItem>
                            <SelectItem value="4">4 Jam</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>

             <div className="space-y-2">
                <Label>Status</Label>
                 <Select 
                        disabled={isReadOnly}
                        value={data.status} 
                        onValueChange={(val) => setData({...data, status: val as BlockStatus})}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="blocked">Blocked (Tidak Tersedia)</SelectItem>
                            <SelectItem value="maintenance">Maintenance / Perbaikan</SelectItem>
                            <SelectItem value="pending">Pending / Hold</SelectItem>
                             {/* Cannot manually set to booked in this prototype flow usually, but let's allow viewing */}
                             {isReadOnly && <SelectItem value="booked">Booked (Customer)</SelectItem>}
                        </SelectContent>
                    </Select>
             </div>

             <div className="space-y-2">
                <Label>Catatan / Keterangan</Label>
                <Textarea 
                    disabled={isReadOnly}
                    value={data.title || ""}
                    onChange={(e) => setData({...data, title: e.target.value})}
                    placeholder="Contoh: Perbaikan jaring, Latihan Tim Internal..."
                />
             </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {data.id && !isReadOnly && (
               <Button type="button" variant="destructive" onClick={() => onDelete(data.id!)} className="mr-auto">
                 <Trash2 className="w-4 h-4 mr-2" />
                 Hapus Block
               </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
          {!isReadOnly && <Button type="button" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Simpan</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
