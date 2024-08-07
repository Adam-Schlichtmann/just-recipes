"use client";

import { ChangeEventHandler, FormEventHandler, useState } from "react";

import styles from "./create.module.css";
import { Recipe } from "../utils";
import { useRouter } from "next/navigation";

export default function CreateRecipe() {
  const [recipe, setRecipe] = useState<Recipe>({
    title: "",
    ingredients: [],
    instructions: [],
    cleaned_ingredients: [],
    image_name: "",
    id: "",
  });
  const router = useRouter();

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;

    setRecipe({
      ...recipe,
      [name]:
        name === "ingredients" || name === "instructions"
          ? value.split(",")
          : value,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    console.log("Form submitted:", recipe);

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });
      const data = await res.json();
      console.log("HI", data);
      if (data.length !== 0) {
        console.log(data[0].id);
        router.replace("/recipe/" + data[0].id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            name='title'
            value={recipe.title}
            onChange={handleChange}
            required
            className={styles.createInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='ingredients'>Ingredients</label>
          <textarea
            id='ingredients'
            name='ingredients'
            value={recipe.ingredients.join()}
            onChange={handleChange}
            required
            className={styles.createInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='instructions'>Instructions</label>
          <textarea
            id='instructions'
            name='instructions'
            value={recipe.instructions.join()}
            onChange={handleChange}
            required
            className={styles.createInput}
          />
        </div>
        <button type='submit' className={styles.createButton}>
          Submit Recipe
        </button>
      </form>
    </div>
  );
}
