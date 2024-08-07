import Image from "next/image";

import { getRecipeByID } from "@/app/utils";
import styles from "./recipe.module.css";

export default async function Page({
  params,
  searchParams,
}: {
  params: { recipeID: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const recipe = await getRecipeByID(params.recipeID);

  return (
    <div className={styles.container}>
      <Image
        src={`https://abiyksmuuj5rworn.public.blob.vercel-storage.com/${recipe.image_name}.jpg`}
        alt={recipe.title}
        className={styles.recipeImage}
        width={300}
        height={100}
      />
      <h1 className={styles.title}>{recipe.title}</h1>
      <h2>Ingredients</h2>
      <ul className={styles.ingredients}>
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i} className={styles.ingredient}>
            {ingredient}
          </li>
        ))}
      </ul>
      <h2>Instructions</h2>
      <div className={styles.instructions}>
        <ol>
          {recipe.instructions.map((instruction, i) => (
            <li key={i} className={styles.instruction}>
              {instruction}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
