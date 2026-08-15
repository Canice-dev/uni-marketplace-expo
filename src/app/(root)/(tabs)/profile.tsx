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
                <View className="flex-row gap-1 mt-2 px-3 py-2 bg-[#f0f0f0] rounded-full self-start">
                  <Text className="text-[11px] text-[#333] font-semibold text-center">
                    Seller
                  </Text>
                  <VerifiedIcon />
                </View>
              ) : (
                <View className="mt-2 px-2 py-0.5 bg-blue-50 rounded-full">
                  <Text className="text-[12px] text-blue-600 font-semibold text-center">
                    Buyer
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="gap-2 mt-10 border border-gray-200 rounded-xl p-2">
          <MenuItem
            icon="heart"
            label="Saved Listings"
            onPress={() =>
              Alert.alert("Coming Soon", "Notifications coming soon!")
            }
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() =>
              Alert.alert("Coming Soon", "Notifications coming soon!")
            }
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() =>
              Alert.alert("Coming Soon", "Notifications coming soon!")
            }
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() =>
              Alert.alert("Coming Soon", "Notifications coming soon!")
            }
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() =>
              Alert.alert("Coming Soon", "Notifications coming soon!")
            }
          />
        </View>
        <View className="gap-2 mt-10 border border-gray-200 rounded-xl  px-4 py-1">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center gap-3 py-4 border-b border-gray-200"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-[14px] font-semibold text-red-500">
              LogOut
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={handleSignOut}
            className="flex-row items-center gap-3 py-4"
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

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-4 bg-gray-50 px-4 py-4 rounded-2xl border-b border-gray-200"
    >
      <Ionicons name={icon} size={22} color="#6B7280" />
      <Text className="flex-1 text-gray-700 font-medium text-base">
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
}
