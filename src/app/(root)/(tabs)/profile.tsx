import { useAuth, useUser } from "@clerk/expo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useSupabase } from "../../../../hooks/useSupabase";
import { useUserStore } from "../../../../store/userStore";
import { Property } from "../../../../types";

const VerifiedIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path
      d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C3.13 9.33 2.25 10.57 2.25 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.26 3.91.8c.66 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
      fill="#1d9bf0"
    />
    <Path
      d="M9 12l2 2 4-4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

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

  const soon = () => Alert.alert("Coming soon");

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 ">
      <View className="flex-row items-center justify-between pt-3 pb-4">
        <Text className="text-[18px] font-bold text-[#0d0d0d]">Profile</Text>
        <TouchableOpacity
          onPress={soon}
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="">
          <View className="flex-row gap-5 py-4">
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
                <View className="flex-row gap-1 mt-2 px-3 py-2 bg-[#f0f0f0] rounded-full self-start">
                  <Text className="text-[11px] text-[#333] font-semibold text-center">
                    Seller
                  </Text>
                  <VerifiedIcon />
                </View>
              ) : (
                <View className="flex-row gap-1 mt-2 px-3 py-2 bg-[#f0f0f0] rounded-full self-start">
                  <Text className="text-[11px] text-[#333] font-semibold text-center">
                    Buyer
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Menu Items written one by one */}
        <View className="mt-2 mb-2">
          {/* My Listings */}
          <TouchableOpacity
            onPress={soon}
            className="flex-row items-center justify-between px-3 py-4 bg-white rounded-2xl mb-2"
          >
            <View className="flex-row items-center">
              <Feather name="grid" size={20} color="#4B5563" />
              <Text className="ml-4 text-base font-medium text-gray-800">
                My Listings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Help Center */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "mailto:caniceaba404@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App",
              )
            }
            className="flex-row items-center justify-between px-3 py-4 bg-white rounded-2xl mb-2"
          >
            <View className="flex-row items-center">
              <Ionicons name="help-circle" size={20} color="#4B5563" />
              <Text className="ml-4 text-base font-medium text-gray-800">
                Help Center
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Feedback */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "mailto:caniceaba404@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App",
              )
            }
            className="flex-row items-center justify-between px-3 py-4 bg-white rounded-2xl mb-2"
          >
            <View className="flex-row items-center">
              <Feather name="message-square" size={20} color="#4B5563" />
              <Text className="ml-4 text-base font-medium text-gray-800">
                Feedback
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            onPress={soon}
            className="flex-row items-center justify-between px-3 py-4 bg-white rounded-2xl mb-2"
          >
            <View className="flex-row items-center">
              <Feather name="shield" size={20} color="#4B5563" />
              <Text className="ml-4 text-base font-medium text-gray-800">
                Privacy Policy
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Terms of Use */}
          <TouchableOpacity
            onPress={soon}
            className="flex-row items-center justify-between px-3 py-4 bg-white rounded-2xl mb-2"
          >
            <View className="flex-row items-center">
              <Feather name="file-text" size={20} color="#4B5563" />
              <Text className="ml-4 text-base font-medium text-gray-800">
                Terms of Use
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <View className="mt-2 mb-2">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row gap-3 items-center px-3 py-4 bg-white rounded-2xl mb-2"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-[14px] font-semibold text-red-500">
              Sign Out
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={soon}
            className="flex-row gap-3 items-center px-3 py-4 bg-white rounded-2xl mb-2"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text className="text-[14px] font-semibold text-red-500">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
