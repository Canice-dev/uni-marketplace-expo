import FilterModal from "@/components/FilterModal";
import SearchCard from "@/components/SearchCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../../../lib/supabase";
import { Property } from "../../../../types";

const CATEGORY = [
  "Apartment",
  "Mini-Flat",
  "Self-Contained",
  "Semi self-contained",
  "Single room",
  "Shop/Store",
  "Land",
  "Gadget",
  "Item",
  "Others",
] as const;
type PropertyType = (typeof CATEGORY)[number];

interface FormState {
  category: PropertyType | "";
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  mobile_number: string;
  whatsapp_number: string;
  latitude: string;
  longitude: string;
  isFeatured: boolean;
  images: string[];
  localImages: string[];
}

const INITIAL_FORM: FormState = {
  category: "",
  title: "",
  description: "",
  price: "",
  address: "",
  city: "",
  mobile_number: "",
  whatsapp_number: "",
  latitude: "",
  longitude: "",
  isFeatured: false,
  images: [],
  localImages: [],
};

const inputClass =
  "border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 bg-gray-50";

export default function SearchScreen() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [location, setLocation] = useState("");

  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, [openFilters]);

  const updateForm = (fields: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  const activeSearchCount = [
    // category !== null,
    // location !== null,
    // minPrice !== null,
    // maxPrice !== null,
  ].filter(Boolean).length;

  const fetchSearchProperties = async () => {
    setLoading(true);

    try {
      const { data: allData } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      setResults(allData ?? []);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Could'nt fetch any property");
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSearchProperties();
    }, []),
  );

  const handleSearch = () => {
    router.push({
      pathname: "/(root)/searched-results",
      params: {
        ...(category && { category }),
        ...(location && { city: location }),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 py-3">
      <View>
        <Text className="text-[18px] font-bold text-[#0d0d0d]">Search</Text>
      </View>
      <View className=" mt-3 mb-3 flex-row items-center bg-gray-100 rounded-2xl px-4 py-5 gap-2">
        <Ionicons name="search-outline" size={16} color="#aaa" />
        <Text className="flex-1 text-sm text-gray-500">Search anything...</Text>
        <TouchableOpacity onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={18} color="#555" />
          {activeSearchCount > 0 && (
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-[9px] font-bold">
                {activeSearchCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#2563EB" className="py-10" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SearchCard property={item} />}
          // showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        />
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
      {/* <TouchableOpacity
        className="mt-6 bg-gray-900 py-4 rounded-2xl items-center"
        onPress={handleSearch}
      >
        <Text className="text-white text-sm font-semibold">Show Results</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}
