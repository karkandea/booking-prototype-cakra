"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleBlock, BlockStatus } from "@/lib/schedule-types";
import { Trash2, Lock, ShieldAlert } from "lucide-react";
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
      <DialogContent className="sm:max-w-md p-6 bg-white rounded-xl shadow-xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            {data.id ? "Edit Status Slot" : "Atur Ketersediaan Slot"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 ml-12">
            {isReadOnly ? "Detail slot yang sudah dibooking." : "Blokir slot ini untuk maintenance atau keperluan lain."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {isReadOnly && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
              <div className="mt-1">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-900">Booked by Customer</p>
                <p className="text-xs text-emerald-700 mt-0.5">Booking ID: {data.bookingId || "-"}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jam Mulai</Label>
              <div className="flex items-center justify-center h-14 bg-gray-50 border border-transparent rounded-xl text-xl font-bold text-gray-900">
                {data.startHour?.toString().padStart(2, '0')}:00
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Durasi</Label>
              <Select
                disabled={isReadOnly}
                value={data.duration?.toString()}
                onValueChange={(val) => setData({ ...data, duration: parseFloat(val) })}
              >
                <SelectTrigger className="h-14 bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-xl text-lg font-semibold text-gray-900">
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
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status Slot</Label>
            <Select
              disabled={isReadOnly}
              value={data.status}
              onValueChange={(val) => setData({ ...data, status: val as BlockStatus })}
            >
              <SelectTrigger className="h-14 bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-xl text-base font-medium text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blocked">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Blocked (Tidak Tersedia)
                  </span>
                </SelectItem>
                <SelectItem value="maintenance">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Maintenance / Perbaikan
                  </span>
                </SelectItem>
                <SelectItem value="pending">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Pending / Hold
                  </span>
                </SelectItem>
                {isReadOnly && <SelectItem value="booked">Booked (Customer)</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Catatan</Label>
            <Textarea
              disabled={isReadOnly}
              value={data.title || ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Contoh: Perbaikan jaring, Latihan Tim Internal..."
              className="min-h-[100px] bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-xl text-base placeholder:text-gray-400 resize-none p-4"
            />
          </div>
        </div>

        <DialogFooter className="mt-8 gap-3 sm:gap-0">
          {data.id && !isReadOnly && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => onDelete(data.id!)}
              className="mr-auto text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 font-medium"
          >
            Batal
          </Button>
          {!isReadOnly && (
            <Button
              type="button"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 shadow-lg shadow-emerald-600/20 rounded-lg"
            >
              Simpan Perubahan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
