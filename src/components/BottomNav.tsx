import { UtensilsCrossed, Soup } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: "ingredients" | "random";
  onTabChange: (tab: "ingredients" | "random") => void;
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
        <span className="text-xs">By Ingredients</span>
      </button>
      <button
        onClick={() => onTabChange("random")}
        className={cn(
          "flex flex-col items-center space-y-1",
          activeTab === "random" ? "text-primary" : "text-gray-500"
        )}
      >
        <Soup size={24} />
        <span className="text-xs">Random</span>
      </button>
    </div>
  );
};