from flask import Flask, render_template, request, jsonify
import re
import pandas as pd
from transformers import AutoTokenizer, AutoModelForCausalLM

app = Flask(__name__)

# Integrating the tokenizer and fine-tuned model
tokenizer = AutoTokenizer.from_pretrained("distilgpt2")
tokenizer.pad_token = tokenizer.eos_token
model = AutoModelForCausalLM.from_pretrained("./output/model/checkpoint-3190")
device = "cpu"  # Using CPU inference

# Loading first 1500 recipes 
df = pd.read_csv("./Food_Recipe.csv")
df = df[:1500]

def get_best_matches(df, user_ingredients, top_n=3):
    """
    Returns the top_n recipes from df that contain ALL user_ingredients.
    It checks if each user ingredient is a substring of at least one recipe ingredient.
    Recipes are sorted by the number of extra ingredients (fewer extras first).
    """
    user_ingredients_list = [ing.lower().strip() for ing in user_ingredients]
    matches = []
    
    for _, row in df.iterrows():
        # CSV column with ingredients is named "ingredients_name"
        recipe_ingredients_list = [
            ing.lower().strip() for ing in row["ingredients_name"].split(",")
        ]
        
        # Find if every user ingredient appears as a substring in at least one recipe ingredient
        if all(
            any(u_ing in r_ing for r_ing in recipe_ingredients_list)
            for u_ing in user_ingredients_list
        ):
            # Count the extra ingredients in the recipe other then user input
            extra_count = len(recipe_ingredients_list) - len(user_ingredients_list)
            matches.append((row, extra_count))
    
    # Sort matches by least extra ingredients and return top_n matches
    matches.sort(key=lambda x: x[1])
    return matches[:top_n]

@app.route('/api/recipes', methods=['POST'])
def api_recipes():
    # Get the user input ingredients from the form data
    user_input = request.form.get('ingredients', '')
    
    # Create prompt and generate output from the model
    prompt = f"a recipe using {user_input}"
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=100,
        do_sample=True,
        top_k=50,
        top_p=0.95
    )
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Process user input in a list of ingredients /lowercase for consistency/
    user_ingredients = [ing.strip().lower() for ing in user_input.split(",") if ing.strip()]
    
    # Get top 3 matching recipes from the dataset
    best_matches = get_best_matches(df, user_ingredients, top_n=3)
    recipes = []
    for i, (row, extra_count) in enumerate(best_matches, start=1):
        recipe_ingredients_list = [ing.lower().strip() for ing in row["ingredients_name"].split(",")]
        # Record extra ingredients /those in the recipe not similar to any user ingredient
        extra_ingredients_list = [
            ing for ing in recipe_ingredients_list if not any(u_ing in ing for u_ing in user_ingredients)
        ]
        recipes.append({
            "index": i,
            "name": row['name'],
            "extra_count": extra_count,
            "extra_ingredients": extra_ingredients_list,
            "instructions": row['instructions']
        })
    
    # Return the generated text and recipes as JSON /To work with frontend
    return jsonify({
        "generated_text": generated_text,
        "recipes": recipes
    })

if __name__ == '__main__':
    # Run on 0.0.0.0 to allows access on the local network
    app.run(host='0.0.0.0', port=5000, debug=True)
