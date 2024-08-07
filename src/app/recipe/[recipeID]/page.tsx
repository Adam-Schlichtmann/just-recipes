export default function Page({
  params,
  searchParams,
}: {
  params: { recipeID: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <h1>My Page {params.recipeID}</h1>;
}
