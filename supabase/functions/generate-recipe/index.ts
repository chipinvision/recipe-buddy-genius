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
      prompt = `Create a recipe using these ingredients: ${ingredients.join(', ')}. Return the response in this JSON format: { "title": "Recipe Title", "ingredients": ["ingredient 1", "ingredient 2"], "instructions": ["step 1", "step 2"], "nutritionalInfo": { "calories": number, "protein": number, "carbs": number, "fat": number } }. Make sure to include realistic nutritional values in the response.`;
    } else {
      prompt = `Create a random recipe. Return the response in this JSON format: { "title": "Recipe Title", "ingredients": ["ingredient 1", "ingredient 2"], "instructions": ["step 1", "step 2"], "nutritionalInfo": { "calories": number, "protein": number, "carbs": number, "fat": number } }. Make sure to include realistic nutritional values in the response.`;
    }

    console.log('Generating recipe with prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Generated recipe:', text);

    try {
      const recipe = JSON.parse(text);
      return new Response(JSON.stringify(recipe), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error parsing recipe JSON:', error);
      throw new Error('Invalid recipe format returned from AI');
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