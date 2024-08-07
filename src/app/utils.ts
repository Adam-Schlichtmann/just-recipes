import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { cache } from "react";

export type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cleaned_ingredients: string[];
  image_name: string;
};

export const getRecipeByID = cache(async (id: string) => {
  const { rows } = await sql`SELECT * from recipes where id=${id} LIMIT 1`;
  if (rows.length === 0) {
    redirect("/404");
  }
  return rows[0] as Recipe;
});

const PAGE = 50;
export const getPaginatedRecipes = cache(async (page: number) => {
  const { rows } = await sql`SELECT * from recipes LIMIT ${PAGE} OFFSET ${
    page * PAGE
  }`;
  if (rows.length === 0) {
    redirect("/404");
  }
  return rows as Recipe[];
});

export const createRecipe = cache(
  async ({
    title,
    ingredients,
    instructions,
    image_name,
    cleaned_ingredients,
  }: Recipe) => {
    const ingredientsString = `{${ingredients.map((d) => `"${d}"`).join()}}`;
    const instructionsString = `{${instructions.map((d) => `"${d}"`).join()}}`;

    const { rows } =
      await sql`INSERT into recipes (title, ingredients, instructions, image_name, cleaned_ingredients) values (${title}, ${ingredientsString}, ${instructionsString}, ${
        image_name ?? "NONE"
      }, ${ingredientsString}) RETURNING id`;

    return rows;
  }
);

export const deleteRecipe = cache(async (id: string) => {
  const { rows } = await sql`DELETE from recipes WHERE id=${id}`;
  return rows;
});
