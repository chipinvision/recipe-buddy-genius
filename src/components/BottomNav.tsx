import { UtensilsCrossed, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: "ingredients" | "profile";
  onTabChange: (tab: "ingredients" | "profile") => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4">
      <button
        onClick={() => onTabChange("ingredients")}
        className={cn(
          "flex flex-col items-center space-y-1",
          activeTab === "ingredients" ? "text-primary" : "text-gray-500"
        )}
      >
        <UtensilsCrossed size={24} />
        <span className="text-xs">Generator</span>
      </button>
      <button
        onClick={() => onTabChange("profile")}
        className={cn(
          "flex flex-col items-center space-y-1",
          activeTab === "profile" ? "text-primary" : "text-gray-500"
        )}
      >
        <User size={24} />
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );
};