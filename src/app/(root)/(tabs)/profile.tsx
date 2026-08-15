import { useAuth, useUser } from "@clerk/expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSupabase } from "../../../../hooks/useSupabase";
import { useUserStore } from "../../../../store/userStore";
import { Property } from "../../../../types";

interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
}

export default function ProfileScreen() {
  const { signOut, userId } = useAuth();
  const router = useRouter();

  const authSupabase = useSupabase();
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = useUserStore((state) => state.isAdmin);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 ">
      <View className="flex-row items-center justify-between pt-3 pb-4">
        <Text className="text-[18px] font-bold text-[#0d0d0d]">Profile</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Coming Soon", "Notifications coming soon!")
          }
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className=" px-5 border border-gray-200 rounded-2xl">
          <View className="flex-row items-center gap-5 py-8">
            <View className="relative">
              <Image
                source={{ uri: user.imageUrl }}
                className="w-20 h-20 rounded-full mb-4"
              />
              <TouchableOpacity
                // onPress={handleUpdateProfileImage}
                // disabled={isUpdating}
                className="absolute bottom-3 right-0 bg-blue-600 rounded-full p-1"
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="camera" size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-[17px] font-bold text-[#0d0d0d]">
                {user.firstName} {user.lastName}
              </Text>
              <Text className="text-[13px] text-[#999] mt-0.5">
                {user.emailAddresses[0].emailAddress}
              </Text>

              {isAdmin ? (
                <View className="mt-2 px-3 py-1 bg-[#f0f0f0] rounded-full">
                  <Text className="text-[11px] text-[#333] font-semibold">
                    Seller
                  </Text>
                </View>
              ) : (
                <View className="mt-2 px-3 py-0.5 bg-blue-50 rounded-full">
                  <Text className="text-[12px] text-blue-600 font-semibold">
                    Buyer
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleSignOut}
        className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100 m-8"
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
