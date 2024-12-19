import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface RecipeCardProps {
  recipe: {
    title: string;
    ingredients: string[];
    instructions: string[];
    nutritionalInfo?: NutritionalInfo;
  } | null;
  isLoading?: boolean;
}

export const RecipeCard = ({ recipe, isLoading }: RecipeCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!recipe) return null;

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-primary">
            {recipe.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-secondary">Ingredients:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
              {recipe.ingredients.length > 3 && (
                <li className="text-primary">+ {recipe.ingredients.length - 3} more ingredients...</li>
              )}
            </ul>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            View Full Recipe
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">{recipe.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold mb-3 text-secondary text-lg">Ingredients:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-secondary text-lg">Instructions:</h3>
              <ul className="list-disc pl-5 space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="leading-relaxed">{instruction}</li>
                ))}
              </ul>
            </div>
            {recipe.nutritionalInfo && (
              <div>
                <h3 className="font-semibold mb-3 text-secondary text-lg">Nutritional Information:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background p-4 rounded-lg text-center">
                    <p className="text-lg font-semibold text-primary">{recipe.nutritionalInfo.calories}</p>
                    <p className="text-sm text-gray-600">Calories</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg text-center">
                    <p className="text-lg font-semibold text-primary">{recipe.nutritionalInfo.protein}g</p>
                    <p className="text-sm text-gray-600">Protein</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg text-center">
                    <p className="text-lg font-semibold text-primary">{recipe.nutritionalInfo.carbs}g</p>
                    <p className="text-sm text-gray-600">Carbs</p>
                  </div>
                  <div className="bg-background p-4 rounded-lg text-center">
                    <p className="text-lg font-semibold text-primary">{recipe.nutritionalInfo.fat}g</p>
                    <p className="text-sm text-gray-600">Fat</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};