"use client";

import { useState } from "react";
import { ScheduleBlock, OperatingHours, Court } from "@/lib/schedule-types";
import { cn } from "@/lib/utils";
import BlockModal from "./BlockModal";

interface TimelineProps {
  courts: Court[];
  blocks: ScheduleBlock[];
  operatingHours: OperatingHours;
  onBlockChange: (updatedBlocks: ScheduleBlock[]) => void;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 to 23:00

export default function Timeline({ courts, blocks, operatingHours, onBlockChange }: TimelineProps) {
  const [selectedBlock, setSelectedBlock] = useState<Partial<ScheduleBlock> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to get blocks for a specific cell
  const getBlockInSlot = (courtId: string, hour: number) => {
    return blocks.find(b => b.fieldId === courtId && b.startHour === hour);
  };
  
  // Helper to check if a slot is occupied by a multi-hour block starting earlier
  const getOccupyingBlock = (courtId: string, hour: number) => {
    return blocks.find(b => b.fieldId === courtId && b.startHour < hour && (b.startHour + b.duration) > hour);
  };

  const handleSlotClick = (courtId: string, hour: number) => {
    // If clicking on an empty slot in valid hours
    if (hour < operatingHours.open || hour >= operatingHours.close || operatingHours.isClosed) return;

    // Check if slot is occupied
    const existingBlock = getBlockInSlot(courtId, hour);
    const occupyingBlock = getOccupyingBlock(courtId, hour);

    if (existingBlock) {
        setSelectedBlock(existingBlock);
        setIsModalOpen(true);
    } else if (occupyingBlock) {
        setSelectedBlock(occupyingBlock);
        setIsModalOpen(true);
    } else {
        // Create new block
        setSelectedBlock({
            fieldId: courtId,
            startHour: hour,
            duration: 1,
            status: "blocked",
            title: "Manual Block"
        });
        setIsModalOpen(true);
    }
  };

  const handleSaveBlock = (newBlock: ScheduleBlock) => {
    let updatedBlocks = [...blocks];
    if (newBlock.id) {
        // Update
        updatedBlocks = updatedBlocks.map(b => b.id === newBlock.id ? newBlock : b);
    } else {
        // Create
        updatedBlocks.push({ ...newBlock, id: `blk-${Date.now()}` });
    }
    onBlockChange(updatedBlocks);
    setIsModalOpen(false);
  };

  const handleDeleteBlock = (blockId: string) => {
    onBlockChange(blocks.filter(b => b.id !== blockId));
    setIsModalOpen(false);
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="min-w-[800px]">
        {/* Header Hours */}
        <div className="flex border-b border-gray-200">
           <div className="w-32 flex-shrink-0 p-4 bg-gray-50 border-r border-gray-200 font-semibold text-gray-500 text-sm">
             Court / Jam
           </div>
           <div className="flex flex-1">
             {HOURS.map(hour => (
               <div key={hour} className="flex-1 min-w-[60px] text-center py-4 text-xs font-medium text-gray-500 border-r border-gray-100">
                 {hour.toString().padStart(2, '0')}:00
               </div>
             ))}
           </div>
        </div>

        {/* Rows */}
        {courts.map(court => (
            <div key={court.id} className="flex border-b border-gray-200 group hover:bg-gray-50/30 transition-colors">
                {/* Court Label */}
                <div className="w-32 flex-shrink-0 p-4 border-r border-gray-200 flex items-center bg-white sticky left-0 z-10 font-medium text-gray-900 group-hover:bg-gray-50 transition-colors shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                    {court.name}
                </div>

                {/* Slots */}
                <div className="flex flex-1 relative bg-white">
                    {HOURS.map(hour => {
                        const isClosed = operatingHours.isClosed || hour < operatingHours.open || hour >= operatingHours.close;
                        const block = getBlockInSlot(court.id, hour);
                        // We do NOT render occupying blocks cells, they are covered by the main block using absolute positioning or colspan logic.
                        // Ideally grid is better, but flex is easier for basic prototype.
                        // We will check occupancy just for rendering empty or blocked cells.
                        const isOccupied = getOccupyingBlock(court.id, hour);

                        return (
                            <div 
                                key={hour} 
                                onClick={() => handleSlotClick(court.id, hour)}
                                className={cn(
                                    "flex-1 min-w-[60px] h-16 border-r border-gray-100 relative transition-colors cursor-pointer",
                                    isClosed ? "bg-gray-100 cursor-not-allowed pattern-diagonal-lines" : "hover:bg-emerald-50"
                                )}
                            >
                                {/* Render Block if it STARTS here */}
                                {block && (
                                    <div 
                                        className={cn(
                                            "absolute top-1 bottom-1 left-1 z-20 rounded-md p-2 text-xs font-medium shadow-sm border overflow-hidden select-none hover:brightness-95 transition-all text-white",
                                            block.status === "booked" ? "bg-emerald-500 border-emerald-600" :
                                            block.status === "blocked" ? "bg-gray-600 border-gray-700" :
                                            block.status === "maintenance" ? "bg-orange-500 border-orange-600" :
                                            "bg-yellow-500 border-yellow-600"
                                        )}
                                        style={{
                                            // Calculate width: (100% * duration) + (border_width * (duration - 1))
                                            width: `calc(${block.duration * 100}% + ${(block.duration - 1) * 1}px - 8px)`,
                                        }}
                                    >
                                        <div className="font-bold truncate">{block.status === "booked" ? "Booked" : block.title}</div>
                                        {block.duration > 1 && <div className="text-[10px] opacity-90 truncate">{block.duration} Jam</div>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>

      <BlockModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         block={selectedBlock}
         onSave={handleSaveBlock}
         onDelete={handleDeleteBlock}
      />
    </div>
  );
}
