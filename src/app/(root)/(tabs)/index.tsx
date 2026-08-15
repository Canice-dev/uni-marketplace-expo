import FeaturedCard from "@/components/FeaturedCard";
import RecentListingCard from "@/components/RecentListingCard";
import { useUser } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../../../lib/supabase";
import { Property } from "../../../../types";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);

    try {
      const { data: featuredData } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      const { data: recommendedData } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      setFeatured(featuredData ?? []);
      setRecommended(recommendedData ?? []);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Could'nt fetch any property");
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between pt-3 pb-3 px-5">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../../../assets/images/logo-mark (1).png")}
                  style={{ width: 26, height: 30 }}
                  resizeMode="contain"
                />
                <Text className="text-[17px] font-bold text-[#0d0d0d]">
                  MarketPlace
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/profile")}
                className="w-9 h-9 items-center justify-center"
              >
                <Ionicons name="notifications-outline" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            {/* Search */}
            <View className=" mb-5 px-5">
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/search")}
                className="flex-row items-center bg-[#f5f5f5] rounded-xl px-4 py-3 gap-3"
              >
                <Ionicons name="search-outline" size={18} color="#aaa" />
                <Text className="text-[14px] text-[#aaa] flex-1">
                  Search properties, items...
                </Text>
              </TouchableOpacity>
            </View>

            {/* Featured Deals */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3 px-5">
                <Text className="text-[16px] font-bold text-[#0d0d0d]">
                  Featured Deals
                </Text>
                <TouchableOpacity
                // onPress={() => router.push("/(root)/properties/featured")}
                >
                  <Text className="text-[13px] text-blue-600 font-medium">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  className="py-10"
                />
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                />
              )}
            </View>

            <View className="flex-row justify-between items-center mb-3 px-5">
              <Text className="text-[16px] font-bold text-[#0d0d0d]">
                Recent Listings
              </Text>
              <TouchableOpacity>
                <Text className="text-[13px] text-blue-600 font-medium">
                  See all
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        renderItem={({ item }) => <RecentListingCard property={item} />}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
