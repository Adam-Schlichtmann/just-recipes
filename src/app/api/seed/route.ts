import { NextResponse } from "next/server";
import fs from "fs";
import csv from "csv-parser";

function csvToObject(filePath: string) {
  return new Promise<Record<string, string>[]>((resolve, reject) => {
    const results: Record<string, string>[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

export async function GET(request: Request) {
  try {
    const obs = await csvToObject("./src/app/api/seed/recipes.csv");

    let values: string[] = [];
    let i = 0;
    for (const ob of obs) {
      i++;
      const ingredients = `'{${ob.ingredients
        .replaceAll("['", "")
        .replaceAll("']", "")
        .split("', '")
        .map(
          (x) =>
            `"${x
              .replaceAll('"', "")
              .replaceAll("'", "''")
              .replaceAll("’", "''")
              .replaceAll("{", "(")
              .replaceAll("}", ")")}"`
        )
        .join(",")}}'`;

      const cleaned_ingredients = `'{${ob.cleaned_ingredients
        .replaceAll("['", "")
        .replaceAll("']", "")
        .split("', '")
        .map(
          (x) =>
            `"${x
              .replaceAll('"', "")
              .replaceAll("'", "''")
              .replaceAll("’", "''")
              .replaceAll("{", "(")
              .replaceAll("}", ")")}"`
        )
        .join(",")}}'`;

      const instructions = `'{${ob.instructions
        .split("\n")
        .map(
          (x) =>
            `"${x
              .replaceAll('"', "")
              .replaceAll("'", "''")
              .replaceAll("’", "''")
              .replaceAll("{", "(")
              .replaceAll("}", ")")}"`
        )
        .join(",")}}'`;
      values.push(
        `('${ob.title
          .replaceAll("'", "''")
          .replaceAll(
            "’",
            "''"
          )}', ${ingredients}, ${instructions}, '${ob.image_name
          .replaceAll("'", "''")
          .replaceAll("’", "''")}', ${cleaned_ingredients})`
      );
    }

    console.log(
      `INSERT into recipes (title, ingredients, instructions, image_name, cleaned_ingredients) values ${values.join()};`
    );

    return NextResponse.json({ result: {} }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
