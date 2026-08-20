import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Property } from "../../types";

export default function SearchCard({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();

  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 36;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (cardWidth <= 0) return;
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(index);
  };

  const hasImages = property.images && property.images.length > 0;

  // const renderPropertyCard = ({ item }: { item: Property }) => {
  //   const hasImages = item.images && item.images.length > 0;

  //   return (

  //   );
  // };

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
              {property.images.map((imgUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imgUrl }}
                  style={{ width: CARD_WIDTH, height: "100%" }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {property.images.length > 1 && (
              <View className="absolute bottom-3 left-0 right-0 items-center z-10 pointer-events-none">
                <View className="flex-row items-center gap-1.5  px-3 py-1.5 rounded-full">
                  {property.images.map((_, index) => (
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
        onPress={() => router.push(`/(root)/property/${property.id}` as any)}
        className="px-1"
      >
        <Text
          numberOfLines={1}
          className="flex-1 text-base font-bold text-gray-900 mr-2 mb-2"
        >
          {property.title}
        </Text>
        <Text
          numberOfLines={2}
          className="flex-1 text-base text-gray-700 mr-2 mb-2"
        >
          {property.description}
        </Text>

        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons name="location-outline" size={18} color="#6B7280" />
          <Text className="text-[11px] text-[#999]" numberOfLines={1}>
            {property.address}
          </Text>
          <Text className="text-[11px] text-[#999]" numberOfLines={1}>
            {property.city}
          </Text>
        </View>

        <Text className="text-base font-bold text-gray-900">
          {"\u20A6"}
          {property.price.toLocaleString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
