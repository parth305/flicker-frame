import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
  Settings,
  Menu,
  Compass,
  Film,
  BookMarked,
  LogOut,
  Sun,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Film, label: "Reels", path: "/reels" },
    { icon: PlusSquare, label: "Create", path: "/create" },
    { icon: Heart, label: "Notifications", path: "/notifications" },
    { icon: BookMarked, label: "Saved", path: "/saved" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Sun, label: "Theme", path: "/theme" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  const NavContent = ({ isMobile = false }) => (
    <div
      className={`flex flex-col h-full ${isMobile ? "justify-normal gap-10" : "justify-between"} py-4`}
    >
      {!isMobile && (
        <div className="px-6 text-center">
          <h1 className="text-xl font-bold">Instagram</h1>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex mt-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start gap-4 px-4 ${isMobile ? "h-12" : "h-14"}`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-base">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t pt-4 px-2">
        <nav className="space-y-1">
          {bottomMenuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start gap-4 px-4 ${isMobile ? "h-12" : "h-14"}`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-base">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Fixed width */}
      <div className="hidden md:flex h-screen fixed left-0 top-0 z-50 flex-col w-64 bg-background border-r">
        <NavContent />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 5).map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="icon"
              className="h-12 w-12"
            >
              <item.icon className="h-5 w-5" />
            </Button>
          ))}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-6 py-4 border-b">
                <SheetTitle>Instagram</SheetTitle>
              </SheetHeader>
              <NavContent isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
