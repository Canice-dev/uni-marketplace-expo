import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../../lib/supabase";
import { Property } from "../../../types";

export default function SearchedResultsScreen({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();

  // 1. Read all filter parameters from router search params
  const { query, category, city } = useLocalSearchParams<{
    query?: string;
    category?: string;
    city?: string;
  }>();

  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 40;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (cardWidth <= 0) return;
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(index);
  };

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
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchResults();
    }, [query, city]),
  );

  const renderPropertyCard = ({ item }: { item: Property }) => {
    const hasImages = item.images && item.images.length > 0;

    return (
      <View className="mb-6 bg-gray-50">
        <View
          className="relative w-full h-80 rounded-3xl overflow-hidden bg-gray-200 mb-3"
          onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
        >
          {hasImages && cardWidth > 0 ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                snapToInterval={CARD_WIDTH}
                snapToAlignment="start"
                decelerationRate="fast"
                disableIntervalMomentum={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={{ width: CARD_WIDTH, height: "100%" }}
              >
                {item.images.map((imgUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: imgUrl }}
                    style={{ width: CARD_WIDTH, height: "100%" }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {item.images.length > 1 && (
                <View className="absolute bottom-3 left-0 right-0 items-center z-10 pointer-events-none">
                  <View className="flex-row items-center gap-1.5  px-3 py-1.5 rounded-full">
                    {item.images.map((_, index) => (
                      <View
                        key={index}
                        className={`rounded-full ${
                          activeIndex === index
                            ? "w-4 h-1.5 bg-white"
                            : "w-1.5 h-1.5 bg-white/60"
                        }`}
                      />
                    ))}
                  </View>
                </View>
              )}
            </>
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <Ionicons name="image-outline" size={36} color="#9CA3AF" />
              <Text className="text-xs text-gray-400 mt-1 font-medium">
                No photos available
              </Text>
            </View>
          )}
        </View>

        {/* Clickable Card Text Details */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/(root)/property/${item.id}` as any)}
          className="px-1"
        >
          <Text
            numberOfLines={1}
            className="flex-1 text-base font-bold text-gray-900 mr-2 mb-2"
          >
            {item.title}
          </Text>
          <Text
            numberOfLines={2}
            className="flex-1 text-base text-gray-700 mr-2 mb-2"
          >
            {item.description}
          </Text>

          <View className="flex-row items-center gap-1 mb-3">
            <Ionicons name="location-outline" size={18} color="#6B7280" />
            <Text className="text-[11px] text-[#999]" numberOfLines={1}>
              {item.address}
            </Text>
            <Text className="text-[11px] text-[#999]" numberOfLines={1}>
              {item.city}
            </Text>
          </View>

          <Text className="text-base font-bold text-gray-900">
            {"\u20A6"}
            {item.price.toLocaleString()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const headingLabel = query || city || category || "All Properties";

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0d0d0d" />
      </View>
    );
  return (
    <SafeAreaView className="flex-1 bg-gray-50  py-3">
      <View className="flex-row items-center px-5 pt-2 pb-4 border-b border-[#e8e8e8]">
        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)/search")}
          className="mr-3 w-8 h-8 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#0d0d0d" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="text-[15px] font-bold text-[#0d0d0d]"
          >
            {headingLabel}
          </Text>
          <Text className="text-xs text-[#999]">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </Text>
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderPropertyCard}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchResults();
            }}
            tintColor="#0d0d0d"
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20 px-6">
            <Ionicons name="search-outline" size={32} color="#888" />
            <Text className="text-base font-bold text-gray-900 mt-2">
              No results found
            </Text>
            <Text className="text-xs text-gray-500 text-center mt-1">
              Try searching with different filters or keywords.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
