import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
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

const inputClass =
  "border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 bg-gray-50";

export default function CreateScreen() {
  const [category, setCategory] = useState("");
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className=" px-5 pt-3 pb-4 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900 mb-1">
          List Property / Item
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-semibold text-gray-800 items-start">
            Photos{" "}
          </Text>
          <Text className="text-xs text-gray-400 items-end">
            {/* {photos.length}/10 */}
            0/10
          </Text>
        </View>

        <View className="flex-row gap-3 mb-3">
          {/* Add button */}
          <TouchableOpacity className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50">
            <Text className="text-2xl text-gray-400">+</Text>
            <Text className="text-[10px] text-gray-400 mt-0.5 text-center">
              Add{"\n"}Photos
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3 mb-3">
          <Text className="text-sm font-semibold text-gray-800 mb-1.5">
            Title
          </Text>
          <TextInput
            className={inputClass}
            placeholder="e.g. 3 Bedroom Apartment"
            placeholderTextColor="#c0c0c0"
            // value={title}
            // onChangeText={setTitle}
          />
        </View>
        <View className="mt-3 mb-3">
          <Text className="text-sm font-semibold text-gray-800 mb-1.5">
            Category
          </Text>
          <TouchableOpacity className="border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 flex-row justify-between items-center">
            <Text
              className={
                category ? "text-sm text-gray-900" : "text-sm text-gray-400"
              }
            >
              {category || "Select category"}
            </Text>
            <AntDesign name="right" size={15} color="#c0c0c0" />
          </TouchableOpacity>
        </View>
        <View className="mt-3 mb-3">
          <Text className="text-sm font-semibold text-gray-800 mb-1.5">
            Description
          </Text>
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 bg-gray-50 h-28"
            placeholder="Describe your property or item..."
            placeholderTextColor="#c0c0c0"
            multiline
            textAlignVertical="top"
            // value={desc}
            // onChangeText={setDesc}
          />
        </View>

        <View className="mt-3 mb-3">
          <Text className="text-sm font-semibold text-gray-800 mb-1.5">
            Address
          </Text>
          <TextInput
            className={inputClass}
            placeholder="e.g. Hilltop junction"
            placeholderTextColor="#c0c0c0"
            // value={location}
            // onChangeText={setLocation}
          />
        </View>

        <View className="mt-3 mb-3">
          <Text className="text-sm font-semibold text-gray-800 mb-1.5">
            City
          </Text>
          <TextInput
            className={inputClass}
            placeholder="e.g. Nsukka"
            placeholderTextColor="#c0c0c0"
            // value={location}
            // onChangeText={setLocation}
          />
        </View>

        <View className="mt-3 mb-3">
          <Text className="text-sm font-semibold text-gray-800 mb-1.5">
            Price
          </Text>
          <TextInput
            className={inputClass}
            placeholder="e.g. 120000"
            placeholderTextColor="#c0c0c0"
            keyboardType="numeric"
            // value={price}
            // onChangeText={setPrice}
          />
        </View>

        <View className="mt-3 mb-3">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-sm font-semibold text-gray-800 mb-1.5">
              Coordinates
            </Text>
            <TouchableOpacity
              // onPress={handleDetectLocation}
              // disabled={detectingLocation}
              className="flex-row items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"
            >
              {/* {detectingLocation ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : ( */}
              <Ionicons name="locate-outline" size={13} color="#c0c0c0" />
              {/* )} */}
              <Text className="text-gray-800 text-xs font-semibold">
                Detect Location
                {/* {detectingLocation ? "Detecting..." : "Detect Location"} */}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextInput
                className={inputClass}
                placeholder="Latitude"
                placeholderTextColor="#c0c0c0"

                // value={form.latitude}
                // onChangeText={(v) => updateForm({ latitude: v })}
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <TextInput
                className={inputClass}
                placeholder="Longitude"
                placeholderTextColor="#c0c0c0"

                // value={form.longitude}
                // onChangeText={(v) => updateForm({ longitude: v })}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* <View className="gap-3 mb-5">
          <Toggle
            label="Featured this item"
            brief_description="Show this in the Featured section on home"
            value={form.isFeatured}
            onChange={(v) => updateForm({ isFeatured: v })}
          />
        </View> */}
      </ScrollView>
      <TouchableOpacity
        // onPress={onPublish}
        activeOpacity={0.85}
        className="bg-gray-900 rounded-2xl py-4 mx-5 items-center mt-2"
      >
        <Text className="text-white text-base font-semibold">
          Publish Listing
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
