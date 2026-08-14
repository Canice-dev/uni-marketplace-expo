import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View className="flex-row items-center justify-between pt-2 pb-3 mb-5">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center">
            <Text className="text-white font-bold text-[15px]">M</Text>
          </View>
          <Text className="text-[17px] font-bold text-[#0d0d0d]">
            MarketPlace
          </Text>
        </View>
        <TouchableOpacity className="w-9 h-9 items-center justify-center">
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className=" mb-4">
        <View className="flex-row items-center bg-[#f5f5f5] rounded-xl px-4 py-3 gap-3">
          <EvilIcons name="search" size={24} color="black" />
          <Text className="text-[14px] text-[#aaa]">
            Search properties, items...
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[16px] font-bold text-[#0d0d0d]">
          Featured Deals
        </Text>
        <TouchableOpacity>
          <Text className="text-[13px] text-blue-600 font-medium">See all</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
