import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function SearchScreen() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const updateForm = (fields: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 py-3">
      <View>
        <Text className="text-[18px] font-bold text-[#0d0d0d]">Search</Text>
      </View>
      <View className=" mt-3 mb-3 flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 gap-2">
        <Ionicons name="search-outline" size={16} color="#aaa" />
        <TextInput
          className="flex-1 text-sm text-gray-500"
          placeholder="Search anything..."
          placeholderTextColor="#aaa"
        />
        <Ionicons name="options-outline" size={18} color="#555" />
      </View>

      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        CATEGORIES HERE
      </ScrollView> */}

      <ScrollView>
        <View className="flex-row justify-between items-center mb-3 mt-3">
          <Text className="text-base font-bold text-gray-900">Filters</Text>
          <Text className="text-blue-500 text-sm font-medium">Clear All</Text>
        </View>
        <Text className="text-sm text-gray-500 mb-1">Price Range</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-700">$100</Text>
          <Text className="text-sm text-gray-700">$100,000+</Text>
        </View>
        <View className="h-1 bg-gray-200 rounded-full mb-3 mt-3">
          <View className="absolute h-1 bg-gray-500 rounded-full left-0 right-0" />
        </View>

        <View className="flex-row justify-between mt-3 mb-3">
          <TouchableOpacity className=" py-3.5 bg-gray-50 flex-row justify-between items-center">
            <Text className="text-base font-medium text-gray-900">
              Category
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className=" py-3.5 bg-gray-50 flex-row items-center"
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text
              className={
                category ? "text-sm text-gray-900" : "text-sm text-gray-400"
              }
            >
              {form.category || "Any category"}
              <AntDesign name="right" size={12} color="#c0c0c0" />
            </Text>
          </TouchableOpacity>

          {/* Dropdown List Items */}
          {isDropdownOpen && (
            <View className="mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
              {CATEGORY.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => {
                    updateForm({ category: t });
                    setIsDropdownOpen(false); // Close dropdown after selection
                  }}
                  className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                    form.category === t ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm capitalize ${
                      form.category === t
                        ? "font-bold text-gray-900"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity className="mt-6 bg-gray-900 py-4 rounded-2xl items-center">
        <Text className="text-white text-sm font-semibold">Show Results</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
