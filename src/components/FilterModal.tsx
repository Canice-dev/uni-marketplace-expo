import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("Any category");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const activeFilterCount = [
    // category !== null,
    // location !== null,
    // minPrice !== null,
    // maxPrice !== null,
  ].filter(Boolean).length;

  // Animated value tracking vertical translation (Y-axis)
  const translateY = useRef(new Animated.Value(0)).current;

  // Reset position whenever modal becomes visible
  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible]);

  // Handle PanResponder (Drag Gestures)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture vertical drag down gestures
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Prevent dragging UP above original position
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged down past 120px or swiped fast, dismiss modal
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: 800, // Slide all the way down off screen
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // Snap back to top position if drag wasn't far enough
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleReset = () => {};
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        {/* Dismiss modal when tapping outside */}
        <Pressable className="flex-1" onPress={onClose} />
        <Animated.View
          style={{ transform: [{ translateY }] }}
          className="bg-white rounded-t-3xl h-[88%] pb-6"
        >
          {/* DRAG HEADER ZONE (Attached PanResponder handlers here) */}
          <View
            {...panResponder.panHandlers}
            className="w-full bg-white rounded-t-3xl  pt-3 pb-1"
          >
            {/* Visible Pill Grab Bar */}
            <View className="items-center">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-1" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-2 pb-2">
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={16} color="#111827" />
              </TouchableOpacity>

              <View className="flex-row items-center gap-2">
                <Text className="text-[17px] font-bold text-[#0d0d0d] tracking-tight">
                  Filters
                </Text>
                {activeFilterCount > 0 && (
                  <View className="bg-[#0d0d0d] w-5 h-5 rounded-full items-center justify-center">
                    <Text className="text-white text-[10px] font-bold">
                      {activeFilterCount}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity onPress={handleReset} activeOpacity={0.6}>
                <Text className="text-blue-600 font-semibold text-[14px]">
                  Clear all
                </Text>
              </TouchableOpacity>
            </View>

            <View className="h-px bg-gray-100" />
          </View>

          {/* PRICE RANGE */}

          <View className="px-5 pt-2 pb-2">
            <Text className="text-[14px] font-semibold text-[#0d0d0d] mb-3">
              Price Range
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-700">$100</Text>
              <Text className="text-sm text-gray-700">$100,000+</Text>
            </View>
            <View className="h-1 bg-gray-200 rounded-full mb-3 mt-3">
              <View className="absolute h-1 bg-gray-500 rounded-full left-0 right-0" />
            </View>
          </View>

          {/* CATEGORY */}

          <View className="mb-6 z-10 px-5">
            <Text className="text-sm font-bold text-gray-900 mb-2">
              Category
            </Text>

            {/* Dropdown Header Trigger */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5"
            >
              <Text className="text-sm font-semibold text-gray-900">
                {selectedCategory}
              </Text>
              <Ionicons
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color="#6b7280"
              />
            </TouchableOpacity>

            {/* Collapsible Dropdown List */}
            {isDropdownOpen && (
              <View className="mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Option to clear/reset selection */}
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory("");
                    setIsDropdownOpen(false);
                  }}
                  className={`px-4 py-3 border-b border-gray-100 ${
                    selectedCategory === "" ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedCategory === ""
                        ? "font-bold text-gray-900"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    Any category
                  </Text>
                </TouchableOpacity>

                {CATEGORY.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => {
                      setSelectedCategory(t);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                      selectedCategory === t ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm capitalize ${
                        selectedCategory === t
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
        </Animated.View>
      </View>
    </Modal>
  );
}
