import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import Ionicons from '@react-native-vector-icons/ionicons';

import Svg, { Circle, Line, Path } from "react-native-svg";

const BackIcon = () => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#111"
    strokeWidth="2.5"
  >
    <Path
      d="M19 12H5m7-7-7 7 7 7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#999"
      strokeWidth="2"
    >
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  ) : (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#999"
      strokeWidth="2"
    >
      <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <Line x1="1" y1="1" x2="23" y2="23" />
    </Svg>
  );

const GoogleIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </Svg>
);

const AppleIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="#111">
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04l-.08.27zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </Svg>
);

export default function SignInScreen() {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView className="flex-1 px-7" showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity className="mt-4 mb-7 self-start">
          <BackIcon />
        </TouchableOpacity>

        {/* Header */}
        <Text className="text-[28px] font-bold text-[#0d0d0d] mb-1.5">
          Sign In
        </Text>
        <Text className="text-[15px] text-[#666] mb-8">Welcome back! 👋</Text>

        {/* Email */}
        <Text className="text-[13px] font-semibold text-[#333] mb-1.5">
          Email
        </Text>
        <TextInput
          className="w-full px-4 py-3.5 border border-[#e8e8e8] rounded-xl text-[15px] text-[#111] mb-5"
          placeholder="you@example.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <View className="flex-row justify-between items-center mb-1.5">
          <Text className="text-[13px] font-semibold text-[#333]">
            Password
          </Text>
          <TouchableOpacity>
            <Text className="text-[13px] text-blue-600">Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View className="relative mb-8">
          <TextInput
            className="w-full pl-4 pr-12 py-3.5 border border-[#e8e8e8] rounded-xl text-[15px] text-[#111]"
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPwd}
            value={pwd}
            onChangeText={setPwd}
          />
          <TouchableOpacity
            className="absolute right-4 top-3.5"
            onPress={() => setShowPwd((v) => !v)}
          >
            <EyeIcon open={showPwd} />
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          className="w-full bg-[#0d0d0d] rounded-[14px] py-4 items-center mb-6"
          activeOpacity={0.85}
        >
          <Text className="text-white text-[16px] font-semibold tracking-wide">
            Sign In
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center gap-3 mb-5">
          <View className="flex-1 h-px bg-[#ebebeb]" />
          <Text className="text-[13px] text-[#aaa]">or continue with</Text>
          <View className="flex-1 h-px bg-[#ebebeb]" />
        </View>

        {/* Social Buttons */}
        <View className="flex-row gap-3 mb-8">
          {[
            { icon: <GoogleIcon />, label: "Google" },
            { icon: <AppleIcon />, label: "Apple" },
          ].map(({ icon, label }) => (
            <TouchableOpacity
              key={label}
              className="flex-1 flex-row items-center justify-center gap-2 py-3.5 border border-[#e8e8e8] rounded-xl"
              activeOpacity={0.7}
            >
              {icon}
              <Text className="text-[14px] font-medium text-[#111]">
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View className="flex-row justify-center items-center pb-8">
          <Text className="text-[14px] text-[#666]">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text className="text-[14px] font-bold text-[#0d0d0d]">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
