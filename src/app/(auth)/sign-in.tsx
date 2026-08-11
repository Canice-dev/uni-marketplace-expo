import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-gray-50">
      <View className="mt-[4px] h-[24px] flex-row items-center px-[26px]">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <SymbolView
            name="arrow.left"
            size={22}
            weight="medium"
            tintColor="#000000"
          />
        </Pressable>
      </View>
      <View>
        <Text>SignInScreen</Text>
      </View>
    </SafeAreaView>
  );
}
