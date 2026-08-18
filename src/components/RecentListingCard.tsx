import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSavedProperty } from "../../hooks/useSavedProperty";
import { Property } from "../../types";

export default function RecentListingCard({
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
      onPress={() => router.push(`/(root)/property/${property.id}`)}

      className="flex-row items-center gap-3 mx-5 mb-3 rounded-2xl overflow-hidden border border-[#f0f0f0] bg-white"
      // style={{ elevation: 1 }}
    >
      <View className="w-[140px] h-[120px] rounded-xl overflow-hidden bg-[#e8e8e8]">
        <Image
          source={{ uri: property.images[0] }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1">
        <Text
          className="text-[14px] font-semibold text-[#0d0d0d] mb-3"
          numberOfLines={2}
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
      <TouchableOpacity
        onPress={toggleSave}
        disabled={saveLoading}
        className="w-10 self-start pt-3 bg-transparent "
      >
        <Ionicons
          name={isSaved ? "heart" : "heart"}
          size={24}
          color={isSaved ? "#FF3B30" : "rgba(156,163,175,0.7)"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
