import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function App() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 ">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View className="items-center px-[26px] justify-center">
        <View>
          <Image
            source={require("@/assets/images/onboarding-img-2.png")}
            style={{ width: 350, height: 455 }}
            resizeMode="contain"
          />
        </View>
        <Text className=" text-[32px] font-bold leading-[37px] tracking-[-0.4px] text-black mb-3">
          Everything you need, in one place
        </Text>
        <Text className="text-xl text-slate-500 leading-7 mb-3">
          Find homes, gadgets, furnitures and anything you need from students
          and admins
        </Text>
      </View>

      <View className="items-center px-[26px]">
        <Pressable
          onPress={() => router.push("/(auth)/sign-up")}
          className="mt-[17px] h-[48px] w-full flex-row items-center justify-center rounded-full bg-black active:opacity-90 mb-2"
        >
          <Text className="text-[16px] font-bold tracking-[-0.4px] text-white">
            Get Started
          </Text>
        </Pressable>
        <View className="flex-row justify-center items-center">
          <Text className="text-sm text-slate-500">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text className="text-sm font-bold text-slate-900">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
