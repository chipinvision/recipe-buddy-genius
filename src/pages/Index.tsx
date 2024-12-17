import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { IngredientInput } from "@/components/IngredientInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Tab = "ingredients" | "random";

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("ingredients");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecipe = async (ingredients?: string[]) => {
    setIsLoading(true);
    try {
      // Here we'll integrate with Gemini API
      // For now, showing a toast to set up Gemini
      toast({
        title: "Gemini API Required",
        description: "Please set up the Gemini API to generate recipes.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container py-8 px-4">
        <h1 className="text-3xl font-bold text-primary text-center mb-8">
          Recipe Generator
        </h1>

        {activeTab === "ingredients" ? (
          <div className="space-y-8">
            <IngredientInput onSubmit={generateRecipe} isLoading={isLoading} />
            <RecipeCard recipe={recipe} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <Button
              onClick={() => generateRecipe()}
              disabled={isLoading}
              className="w-full max-w-2xl mx-auto block"
            >
              {isLoading ? "Generating Random Recipe..." : "Generate Random Recipe"}
            </Button>
            <RecipeCard recipe={recipe} isLoading={isLoading} />
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;