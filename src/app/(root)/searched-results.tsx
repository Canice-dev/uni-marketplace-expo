import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../../lib/supabase";
import { Property } from "../../../types";

export default function SearchedResultsScreen() {
  const router = useRouter();

  // 1. Read all filter parameters from router search params
  const { query, category, city } = useLocalSearchParams<{
    query?: string;
    category?: string;
    city?: string;
  }>();

  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      // 2. Initialize base query
      let dbQuery = supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply search keyword filter across title & description
      if (query?.trim()) {
        dbQuery = dbQuery.or(
          `title.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%`,
        );
      }

      // Apply category filter
      if (category?.trim()) {
        dbQuery = dbQuery.eq("category", category.trim());
      }

      // Apply location filter (case-insensitive search)
      if (city?.trim()) {
        dbQuery = dbQuery.ilike("city", `%${city.trim()}%`);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;
      setResults(data ?? []);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not fetch search results");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchResults();
    }, [query, city]),
  );

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0d0d0d" />
      </View>
    );
  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 py-3">
      <View>
        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)/search")}
          className="pt-2 pb-5"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </SafeAreaView>
  );
}
