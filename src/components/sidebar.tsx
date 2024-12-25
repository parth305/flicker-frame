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
import { useTheme } from "next-themes"; // Hook to manage theme

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const { setTheme, resolvedTheme } = useTheme(); // Use resolvedTheme to get the actual applied theme

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
    {
      icon: Sun,
      label: "Theme",
      path: "/theme",
      onClick: () => setIsThemeExpanded(!isThemeExpanded),
    },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  // Get the dynamic classes based on the theme (light, dark, or system)
  const submenuClasses =
    resolvedTheme === "dark"
      ? "bg-gray-800 text-white border-l-4 border-gray-700"
      : resolvedTheme === "light"
        ? "bg-gray-50 text-black border-l-4 border-gray-300"
        : "bg-gray-50 text-black border-l-4 border-gray-300"; // Default to light theme classes if system is used

  const NavContent = ({ isMobile = false }) => (
    <div
      className={`flex flex-col h-full ${isMobile ? "justify-normal gap-10" : "justify-between"} py-4 overflow-y-auto`} // Added scrollable behavior
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
            <div key={item.label}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-4 px-4 ${isMobile ? "h-12" : "h-14"}`}
                onClick={item.onClick} // Trigger onClick for the Theme button
              >
                <item.icon className="h-6 w-6" />
                <span className="text-base">{item.label}</span>
              </Button>

              {/* Show theme options only if expanded */}
              {isThemeExpanded && item.label === "Theme" && (
                <div
                  className={`mt-2 ml-6 space-y-1 px-2 py-2 ${submenuClasses}`}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 px-4"
                    onClick={() => setTheme("light")}
                  >
                    Light Theme
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 px-4"
                    onClick={() => setTheme("dark")}
                  >
                    Dark Theme
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 px-4"
                    onClick={() => setTheme("system")}
                  >
                    System Default
                  </Button>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Fixed width */}
      <div className="hidden md:flex h-screen fixed left-0 top-0 z-50 flex-col w-64 bg-background border-r overflow-y-auto">
        {" "}
        {/* Added overflow-y-auto here */}
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
