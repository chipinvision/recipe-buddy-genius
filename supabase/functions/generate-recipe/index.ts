import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { ingredients } = await req.json();
    
    let prompt;
    if (ingredients && ingredients.length > 0) {
      prompt = `Create a recipe using these ingredients: ${ingredients.join(', ')}. 
      You must return ONLY a valid JSON object in this exact format, with no additional text:
      {
        "title": "Recipe Title",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "instructions": ["step 1", "step 2"],
        "nutritionalInfo": {
          "calories": 500,
          "protein": 20,
          "carbs": 30,
          "fat": 15
        }
      }
      Make sure all numbers in nutritionalInfo are realistic positive numbers.`;
    } else {
      prompt = `Create a random recipe.
      You must return ONLY a valid JSON object in this exact format, with no additional text:
      {
        "title": "Recipe Title",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "instructions": ["step 1", "step 2"],
        "nutritionalInfo": {
          "calories": 500,
          "protein": 20,
          "carbs": 30,
          "fat": 15
        }
      }
      Make sure all numbers in nutritionalInfo are realistic positive numbers.`;
    }

    console.log('Generating recipe with prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text);

    try {
      // Try to extract JSON if the AI included any additional text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      
      console.log('Attempting to parse JSON:', jsonStr);
      
      const recipe = JSON.parse(jsonStr);
      
      // Validate the recipe object structure
      if (!recipe.title || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions) || !recipe.nutritionalInfo) {
        throw new Error('Recipe missing required fields');
      }
      
      // Validate nutritional info
      const { calories, protein, carbs, fat } = recipe.nutritionalInfo;
      if (typeof calories !== 'number' || typeof protein !== 'number' || 
          typeof carbs !== 'number' || typeof fat !== 'number') {
        throw new Error('Invalid nutritional info format');
      }

      console.log('Successfully parsed recipe:', recipe);

      return new Response(JSON.stringify(recipe), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error parsing recipe JSON:', error);
      console.error('Failed to parse text:', text);
      throw new Error(`Invalid recipe format returned from AI: ${error.message}`);
    }

  } catch (error) {
    console.error('Error generating recipe:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})