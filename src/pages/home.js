import axios from "axios";
import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/recipes`);
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const deleteRecipe = async (recipeID) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/recipes/${recipeID}`);
      // Remove the deleted recipe from the recipes state
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeID));
    } catch (err) {
      console.log(err);
    }
  };

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/recipes`, {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
              <button onClick={() => deleteRecipe(recipe._id)}>Delete</button> {/* Add the delete button */}
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
