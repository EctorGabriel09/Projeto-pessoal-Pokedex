import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createFavorite } from "../services/favoritesService";
import { getPokemonDetails } from "../services/pokemonApi";

export default function DetailsScreen({ navigation, route }) {
  const [pokemon, setPokemon] = useState(null);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pulse = useRef(new Animated.Value(0)).current;
  const pokemonId = route.params?.pokemonId || 1;

  useEffect(() => {
    async function loadPokemon() {
      try {
        setLoading(true);
        setError("");
        const data = await getPokemonDetails(pokemonId);
        setPokemon(data);
        setNickname(data.name);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [pokemonId]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  async function saveFavorite() {
    if (!pokemon) {
      return;
    }

    try {
      setSaving(true);
      await createFavorite(pokemon, nickname);
      Alert.alert("Salvo", "Pokemon adicionado aos favoritos.");
      navigation.navigate("Favorites");
    } catch (saveError) {
      Alert.alert(
        "Erro no Firebase",
        "Confira as credenciais em src/firebase/config.js e tente novamente."
      );
    } finally {
      setSaving(false);
    }
  }

  const imageScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["bottom"]}>
        <ActivityIndicator size="large" color="#d62828" />
        <Text style={styles.helperText}>Buscando dados na PokeAPI...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center} edges={["bottom"]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.number}>#{String(pokemon.id).padStart(3, "0")}</Text>
          <Text style={styles.name}>{pokemon.name}</Text>

          <Animated.View
            style={[
              styles.imageWrap,
              {
                transform: [{ scale: imageScale }],
              },
            ]}
          >
            <Image source={{ uri: pokemon.image }} style={styles.image} />
          </Animated.View>

          <View style={styles.typesRow}>
            {pokemon.types.map((type) => (
              <Text key={type} style={styles.typeBadge}>
                {type}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pokemon.height / 10}m</Text>
            <Text style={styles.statLabel}>Altura</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pokemon.weight / 10}kg</Text>
            <Text style={styles.statLabel}>Peso</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pokemon.baseExperience}</Text>
            <Text style={styles.statLabel}>XP base</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <Text style={styles.sectionText}>{pokemon.abilities.join(", ")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apelido no Firebase</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Digite um apelido"
            placeholderTextColor="#756f64"
          />

          <Pressable
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={saveFavorite}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "Salvando..." : "Favoritar Pokemon"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f2e9",
    paddingHorizontal: 18,
  },
  center: {
    alignItems: "center",
    backgroundColor: "#f6f2e9",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  helperText: {
    color: "#756f64",
    marginTop: 12,
  },
  errorText: {
    color: "#b02020",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  hero: {
    alignItems: "center",
    paddingTop: 24,
  },
  number: {
    color: "#b33d2e",
    fontSize: 16,
    fontWeight: "900",
  },
  name: {
    color: "#24211d",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 2,
    textTransform: "capitalize",
  },
  imageWrap: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#eadfce",
    borderRadius: 8,
    borderWidth: 1,
    height: 248,
    justifyContent: "center",
    marginTop: 18,
    width: "100%",
  },
  image: {
    height: 220,
    width: 220,
  },
  typesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 16,
  },
  typeBadge: {
    backgroundColor: "#24211d",
    borderRadius: 8,
    color: "#fff",
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 7,
    textTransform: "capitalize",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },
  statBox: {
    backgroundColor: "#fff",
    borderColor: "#e3dacb",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  statValue: {
    color: "#d62828",
    fontSize: 20,
    fontWeight: "900",
  },
  statLabel: {
    color: "#756f64",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
    textTransform: "uppercase",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "#24211d",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  sectionText: {
    color: "#514b43",
    fontSize: 16,
    lineHeight: 23,
    textTransform: "capitalize",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ded6c8",
    borderRadius: 8,
    borderWidth: 1,
    color: "#24211d",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#d62828",
    borderRadius: 8,
    marginBottom: 28,
    marginTop: 12,
    padding: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});
