import { useAuth } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSavedProperty } from "../../../../hooks/useSavedProperty";
import { useSupabase } from "../../../../hooks/useSupabase";
import { supabase } from "../../../../lib/supabase";
import { Property } from "../../../../types";

const { width } = Dimensions.get("window");

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const authSupabase = useSupabase();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
    setProperty(data);
    setLoading(false);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleMobileContact = () => {
    const message = `Hi! I'm interested in the property: ${property?.title}`;
    const url = `tel:${property?.mobile_number}`;
    Linking.openURL(url);
  };
  const handleWhatsappContact = () => {
    const message = `Hi! I'm interested in the property: ${property?.title}`;
    const url = `https://wa.me/${property?.whatsapp_number}?text=${encodeURIComponent(
      message,
    )}`;
    Linking.openURL(url);
  };

  const handleShare = async () => {
    await Share.share({ message: `Check out ${property?.title}` });
  };

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Property not found</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0d0d0d" />
        <Text className="mt-3 text-sm font-medium text-gray-500">
          Loading details...
        </Text>
      </View>
    );
  }
  const images = property.images?.length ? property.images : [];

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    property.longitude - 0.003
  }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${
    property.latitude + 0.003
  }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={{ opacity: property.is_sold ? 0.5 : 1, height: 300 }}>
          {images.length > 0 ? (
            <FlatList
              data={property.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => i.toString()}
              onScroll={(e) =>
                setActiveIndex(
                  Math.round(e.nativeEvent.contentOffset.x / width),
                )
              }
              scrollEventThrottle={16}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width, height: 300 }}
                  resizeMode="cover"
                />
              )}
            />
          ) : (
            <View
              style={{ width, height: 300 }}
              className="bg-[#f5f5f5] items-center justify-center"
            >
              <Ionicons name="image-outline" size={48} color="#ccc" />
            </View>
          )}

          <View className="absolute bottom-3 right-4 bg-black/50 px-2.5 py-1 rounded-full">
            <Text className="text-white text-xs">
              {activeIndex + 1}/{property.images.length}
            </Text>
          </View>
          {/* Floating header */}
          <View
            className="absolute left-4 right-4 flex-row justify-between items-center"
            style={{ top: insets.top }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-black/40 rounded-full items-center justify-center"
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={toggleSave}
                className="w-10 h-10 bg-black/40 rounded-full items-center justify-center"
              >
                <Ionicons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={20}
                  color={isSaved ? "#FF3B30" : "white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                className="w-9 h-9 bg-black/40 rounded-full items-center justify-center"
              >
                <Ionicons name="share-social-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5 pb-36">
          <Text className="text-xl font-bold text-[#0d0d0d] tracking-tight mb-2">
            {property.title}
          </Text>

          <Text className="text-lg font-bold text-[#0d0d0d]  tracking-tight">
            Description
          </Text>
          <Text className="text-sm font-normal text-gray-600 leading-6 mb-2">
            {property.description}
          </Text>
          <Text className="text-2xl font-extrabold text-[#0d0d0d]">
            ₦{property.price.toLocaleString()}
          </Text>
          <View className="flex-row items-center mt-1 gap-1 mb-2">
            <Ionicons name="location-outline" size={13} color="#999" />
            <Text className="text-sm text-[#999]">
              {[property.address, property.city].filter(Boolean).join(", ")}
            </Text>
          </View>
        </View>

        {/* MAP PREVIEW */}

        <View className="flex-row items-center gap-2 mx-20">
          <TouchableOpacity
            onPress={handleMobileContact}
            className="w-1/2 h-11 rounded-2xl bg-slate-100 items-center justify-center border border-[#334155]"
          >
            <Ionicons name="call-outline" size={20} color="#334155" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleWhatsappContact}
            className="w-1/2 h-11 rounded-2xl bg-emerald-50 items-center justify-center border border-[#10b981]"
          >
            <Ionicons name="logo-whatsapp" size={20} color="#10b981" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
