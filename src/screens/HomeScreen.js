import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPokemonList } from "../services/pokemonApi";

export default function HomeScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPokemons() {
      try {
        setError("");
        const data = await getPokemonList();
        setPokemons(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadPokemons();
  }, []);

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [pokemons, search]);

  function openPokemon(pokemon) {
    navigation.navigate("Details", { pokemonId: pokemon.id });
  }

  function searchPokemon() {
    if (!search.trim()) {
      return;
    }

    navigation.navigate("Details", { pokemonId: search.trim().toLowerCase() });
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>PokeAPI + Firebase</Text>
          <Text style={styles.title}>Escolha seu Pokemon</Text>
        </View>

        <Pressable
          style={styles.favoritesButton}
          onPress={() => navigation.navigate("Favorites")}
        >
          <Text style={styles.favoritesText}>Favoritos</Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome ou ID"
          placeholderTextColor="#756f64"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={searchPokemon}
          autoCapitalize="none"
        />

        <Pressable style={styles.searchButton} onPress={searchPokemon}>
          <Text style={styles.searchButtonText}>Ir</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#d62828" />
          <Text style={styles.helperText}>Carregando Pokemon...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPokemons}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => openPokemon(item)}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardNumber}>#{String(item.id).padStart(3, "0")}</Text>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f2e9",
    paddingHorizontal: 18,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    gap: 14,
  },
  eyebrow: {
    color: "#746b5f",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: "#24211d",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 2,
  },
  favoritesButton: {
    backgroundColor: "#24211d",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  favoritesText: {
    color: "#fff",
    fontWeight: "800",
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ded6c8",
    borderRadius: 8,
    borderWidth: 1,
    color: "#24211d",
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchButton: {
    alignItems: "center",
    backgroundColor: "#d62828",
    borderRadius: 8,
    justifyContent: "center",
    minWidth: 54,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  helperText: {
    color: "#756f64",
    marginTop: 12,
  },
  errorText: {
    color: "#b02020",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  list: {
    paddingBottom: 28,
    paddingTop: 18,
  },
  column: {
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderColor: "#e3dacb",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginBottom: 12,
    minHeight: 176,
    overflow: "hidden",
    padding: 12,
  },
  cardImage: {
    alignSelf: "center",
    height: 106,
    width: 106,
  },
  cardNumber: {
    color: "#b33d2e",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4,
  },
  cardTitle: {
    color: "#24211d",
    fontSize: 18,
    fontWeight: "900",
    textTransform: "capitalize",
  },
});
