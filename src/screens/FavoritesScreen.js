import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  deleteFavorite,
  listenFavorites,
  updateFavorite,
} from "../services/favoritesService";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draftNickname, setDraftNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = listenFavorites(
      (data) => {
        setFavorites(data);
        setLoading(false);
      },
      () => {
        setError("Nao foi possivel ler os favoritos no Firebase.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  function startEditing(item) {
    setEditingId(item.firestoreId);
    setDraftNickname(item.nickname);
  }

  async function saveEditing() {
    if (!draftNickname.trim()) {
      Alert.alert("Apelido vazio", "Digite um apelido para salvar.");
      return;
    }

    try {
      await updateFavorite(editingId, draftNickname);
      setEditingId(null);
      setDraftNickname("");
    } catch (updateError) {
      Alert.alert("Erro", "Nao foi possivel atualizar o favorito.");
    }
  }

  function confirmDelete(item) {
    Alert.alert(
      "Excluir favorito",
      `Remover ${item.nickname || item.name} da sua lista?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFavorite(item.firestoreId);
            } catch (deleteError) {
              Alert.alert("Erro", "Nao foi possivel excluir o favorito.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["bottom"]}>
        <ActivityIndicator size="large" color="#d62828" />
        <Text style={styles.helperText}>Lendo favoritos no Firebase...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center} edges={["bottom"]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.helperText}>
          Verifique as credenciais em src/firebase/config.js.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos salvos</Text>
        <Text style={styles.subtitle}>CRUD completo com Firestore</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.firestoreId}
        contentContainerStyle={favorites.length ? styles.list : styles.emptyList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
            <Text style={styles.emptyText}>
              Abra os detalhes de um Pokemon e salve um apelido.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.primaryButtonText}>Buscar Pokemon</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const isEditing = editingId === item.firestoreId;

          return (
            <View style={styles.favoriteCard}>
              <Pressable
                style={styles.favoriteInfo}
                onPress={() =>
                  navigation.navigate("Details", { pokemonId: item.pokemonId })
                }
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.textBlock}>
                  <Text style={styles.number}>
                    #{String(item.pokemonId).padStart(3, "0")}
                  </Text>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.types}>{item.types?.join(", ")}</Text>
                </View>
              </Pressable>

              {isEditing ? (
                <View style={styles.editArea}>
                  <TextInput
                    style={styles.input}
                    value={draftNickname}
                    onChangeText={setDraftNickname}
                    autoFocus
                  />
                  <View style={styles.actionsRow}>
                    <Pressable style={styles.saveButton} onPress={saveEditing}>
                      <Text style={styles.buttonText}>Salvar</Text>
                    </Pressable>
                    <Pressable
                      style={styles.cancelButton}
                      onPress={() => setEditingId(null)}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.editArea}>
                  <Text style={styles.nickname}>{item.nickname}</Text>
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.saveButton}
                      onPress={() => startEditing(item)}
                    >
                      <Text style={styles.buttonText}>Editar</Text>
                    </Pressable>
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => confirmDelete(item)}
                    >
                      <Text style={styles.buttonText}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
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
  header: {
    marginTop: 18,
  },
  title: {
    color: "#24211d",
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    color: "#756f64",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  helperText: {
    color: "#756f64",
    marginTop: 12,
    textAlign: "center",
  },
  errorText: {
    color: "#b02020",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  list: {
    paddingBottom: 28,
    paddingTop: 18,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    color: "#24211d",
    fontSize: 22,
    fontWeight: "900",
  },
  emptyText: {
    color: "#756f64",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#d62828",
    borderRadius: 8,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  favoriteCard: {
    backgroundColor: "#fff",
    borderColor: "#e3dacb",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  favoriteInfo: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  image: {
    backgroundColor: "#f6f2e9",
    borderRadius: 8,
    height: 82,
    width: 82,
  },
  textBlock: {
    flex: 1,
  },
  number: {
    color: "#b33d2e",
    fontSize: 12,
    fontWeight: "900",
  },
  name: {
    color: "#24211d",
    fontSize: 20,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  types: {
    color: "#756f64",
    marginTop: 2,
    textTransform: "capitalize",
  },
  editArea: {
    borderTopColor: "#eee5d7",
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 12,
  },
  nickname: {
    color: "#24211d",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fdfbf6",
    borderColor: "#ded6c8",
    borderRadius: 8,
    borderWidth: 1,
    color: "#24211d",
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#24211d",
    borderRadius: 8,
    flex: 1,
    paddingVertical: 11,
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#d62828",
    borderRadius: 8,
    flex: 1,
    paddingVertical: 11,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "#eee5d7",
    borderRadius: 8,
    flex: 1,
    paddingVertical: 11,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
  },
  cancelButtonText: {
    color: "#24211d",
    fontWeight: "900",
  },
});
