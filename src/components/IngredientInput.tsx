import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface IngredientInputProps {
  onSubmit: (ingredients: string[]) => void;
  isLoading: boolean;
}

export const IngredientInput = ({ onSubmit, isLoading }: IngredientInputProps) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length > 0) {
      onSubmit(ingredients);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2">
        <Input
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          placeholder="Enter an ingredient"
          onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
        />
        <Button
          type="button"
          onClick={handleAddIngredient}
          variant="outline"
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="bg-secondary/20 px-3 py-1 rounded-full text-sm"
            >
              {ingredient}
              <button
                onClick={() =>
                  setIngredients(ingredients.filter((_, i) => i !== index))
                }
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={ingredients.length === 0 || isLoading}
        className="w-full"
      >
        {isLoading ? "Generating Recipe..." : "Generate Recipe"}
      </Button>
    </div>
  );
};