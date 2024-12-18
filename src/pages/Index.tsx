import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { IngredientInput } from "@/components/IngredientInput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type Tab = "ingredients" | "profile";

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const generateRecipe = async (ingredients?: string[]) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: { ingredients }
      });

      if (error) {
        console.error('Error generating recipe:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No recipe data received');
      }

      setRecipe(data);
    } catch (error) {
      console.error('Error generating recipe:', error);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Recipe Generator
          </h1>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {activeTab === "ingredients" ? (
          <div className="space-y-8">
            <IngredientInput onSubmit={generateRecipe} isLoading={isLoading} />
            <RecipeCard recipe={recipe} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Profile</h2>
            <p className="text-gray-600">Profile features coming soon...</p>
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;