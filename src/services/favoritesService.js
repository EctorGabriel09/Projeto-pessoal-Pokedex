import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

const FAVORITES_COLLECTION = "favorites";

export function listenFavorites(onChange, onError) {
  const favoritesQuery = query(
    collection(db, FAVORITES_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    favoritesQuery,
    (snapshot) => {
      const favorites = snapshot.docs.map((document) => ({
        firestoreId: document.id,
        ...document.data(),
      }));

      onChange(favorites);
    },
    onError
  );
}

export async function createFavorite(pokemon, nickname) {
  const favoriteRef = doc(db, FAVORITES_COLLECTION, String(pokemon.id));

  await setDoc(favoriteRef, {
    pokemonId: pokemon.id,
    name: pokemon.name,
    image: pokemon.image,
    types: pokemon.types,
    nickname: nickname?.trim() || pokemon.name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateFavorite(firestoreId, nickname) {
  const favoriteRef = doc(db, FAVORITES_COLLECTION, firestoreId);

  await updateDoc(favoriteRef, {
    nickname: nickname.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFavorite(firestoreId) {
  const favoriteRef = doc(db, FAVORITES_COLLECTION, firestoreId);

  await deleteDoc(favoriteRef);
}
