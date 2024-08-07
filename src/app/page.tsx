import Image from "next/image";

import styles from "./page.module.css";
import { getPaginatedRecipes } from "./utils";
import Link from "next/link";

export default async function Home() {
  const recipes = await getPaginatedRecipes(0);
  return (
    <div className={styles.container}>
      <h1>All Recipes</h1>
      <div className={styles.recipeList}>
        {recipes.map((recipe) => (
          <Link
            className={styles.recipeCard}
            key={recipe.id}
            href={`/recipe/${recipe.id}`}
          >
            <Image
              src={`https://abiyksmuuj5rworn.public.blob.vercel-storage.com/${recipe.image_name}.jpg`}
              alt={recipe.title}
              className={styles.recipeImage}
              width={100}
              height={100}
            />
            <div className={styles.recipeContent}>
              <h2 className={styles.recipeTitle}>{recipe.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
