import { Sidebar } from "@/components/admin/Sidebar";
import { VenueProvider } from "@/context/VenueContext";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VenueProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="pl-64 min-h-screen">
          {children}
        </main>
      </div>
    </VenueProvider>
  );
}
