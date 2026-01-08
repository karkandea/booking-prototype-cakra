"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Settings, 
  LogOut, 
  UserCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const menuItems = [
  {
    title: "Dashboard",
    href: "/owner",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Venue",
    href: "/owner/venues",
    icon: MapPin,
  },
  {
    title: "Schedule",
    href: "/owner/schedule",
    icon: Calendar,
  },
  {
    title: "Bookings",
    href: "/owner/bookings",
    icon: BookOpen,
  },
  {
    title: "Account & Settings",
    href: "/owner/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50">
      {/* Brand Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 mr-3 relative rounded-lg overflow-hidden">
             <Image 
               src="/vanuego.jpg" 
               alt="Vanuego Logo" 
               fill 
               className="object-cover"
             />
        </div>
        <span className="font-bold text-gray-900 text-lg">Vendor Portal</span>
      </div>

      {/* User Brief */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <UserCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Owner Name</p>
                <p className="text-xs text-gray-500 truncate">owner@venue.com</p>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-600" : "text-gray-400")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
            </button>
        </Link>
      </div>
    </aside>
  );
}
