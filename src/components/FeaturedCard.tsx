import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSavedProperty } from "../../hooks/useSavedProperty";
import { Property } from "../../types";

export default function FeaturedCard({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(
    property.id,
    onUnsave,
  );

  return (
    <TouchableOpacity
      className="w-[220px] rounded-2xl overflow-hidden border border-[#f0f0f0] bg-white"
      style={{ elevation: 1 }}
    >
      <Image
        source={{ uri: property.images[0] }}
        className="w-full h-[200px]"
        resizeMode="cover"
      />

      <TouchableOpacity
        onPress={toggleSave}
        disabled={saveLoading}
        className="absolute top-2 right-2 w-7 h-7 bg-transparent rounded-full items-center justify-center"
        style={{ elevation: 2 }}
      >
        <Ionicons
          name={isSaved ? "heart" : "heart"}
          size={24}
          color={isSaved ? "#FF3B30" : "rgba(156,163,175,0.7)"}
        />
      </TouchableOpacity>

      {property.is_sold && (
        <View className="absolute top-3 right-3 bg-red-500 px-3 py-1 rounded-full">
          <Text className="text-xs font-semibold text-white">Sold</Text>
        </View>
      )}

      <View className="p-3">
        <Text
          className="text-[13px] font-semibold text-[#0d0d0d] mb-2"
          numberOfLines={1}
        >
          {property.title}
        </Text>

        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons name="location-outline" size={18} color="#6B7280" />
          <View>
            <Text className="text-[11px] text-[#999]" numberOfLines={1}>
              {property.address}
            </Text>
            <Text className="text-[11px] text-[#999]" numberOfLines={1}>
              {property.city}
            </Text>
          </View>
        </View>

        <Text className="text-[14px] font-bold text-[#0d0d0d] mt-1">
          {"\u20A6"}
          {property.price.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
