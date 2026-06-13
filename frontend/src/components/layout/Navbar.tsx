import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Search size={18} />
        <input
          placeholder="Search..."
          className="outline-none"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell />
        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
}