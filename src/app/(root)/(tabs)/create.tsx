import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSupabase } from "../../../../hooks/useSupabase";

const CATEGORY = [
  "Apartment",
  "Mini-Flat",
  "Self-Contained",
  "Semi self-contained",
  "Single room",
  "Shop/Store",
  "Land",
  "Gadget",
  "Item",
  "Others",
] as const;
type PropertyType = (typeof CATEGORY)[number];

const MIN_PRICE = 1;
const MAX_PRICE = 999_999_999;

interface FormState {
  category: PropertyType | "";
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  mobile_number: string;
  whatsapp_number: string;
  latitude: string;
  longitude: string;
  isFeatured: boolean;
  images: string[];
  localImages: string[];
}

const INITIAL_FORM: FormState = {
  category: "",
  title: "",
  description: "",
  price: "",
  address: "",
  city: "",
  mobile_number: "",
  whatsapp_number: "",
  latitude: "",
  longitude: "",
  isFeatured: false,
  images: [],
  localImages: [],
};

const inputClass =
  "border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 bg-gray-50";

export default function CreateScreen() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const authSupabase = useSupabase();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  // Loading states
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [imagesCount, setImagesCount] = useState([]); // Array holding uploaded photo URIs

  const [category, setCategory] = useState("");

  const updateForm = (fields: Partial<FormState>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  const handlePickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 0.7,
      base64: true,
      selectionLimit: 6,
    });

    if (result.canceled) return;

    setUploadingImages(true);

    const uploadedUrls: string[] = [];
    const previewUris: string[] = [];

    for (const asset of result.assets) {
      try {
        const filename = `property_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}.jpg`;

        const base64 = asset.base64!;
        const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        const { error } = await authSupabase.storage
          .from("property-images")
          .upload(filename, buffer, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = authSupabase.storage
          .from("property-images")
          .getPublicUrl(filename);

        uploadedUrls.push(urlData.publicUrl);
        previewUris.push(asset.uri);
      } catch (err) {
        console.error("Upload error:", err);
        Alert.alert("Upload Failed", "One or more images failed to upload.");
      }
    }

    updateForm({
      images: [...form.images, ...uploadedUrls],
      localImages: [...form.localImages, ...previewUris],
    });
    setUploadingImages(false);
  };

  const handleRemoveImage = (index: number) => {
    updateForm({
      images: form.images.filter((_, i) => i !== index),
      localImages: form.localImages.filter((_, i) => i !== index),
    });
  };

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to detect coordinates.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      updateForm({
        latitude: String(location.coords.latitude),
        longitude: String(location.coords.longitude),
      });
    } catch (error) {
      Alert.alert("Error", "Could not detect location. Enter manually.");
      console.error(error);
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim())
      return Alert.alert("Validation", "Brief description is required.");

    if (!form.description.trim())
      return Alert.alert("Validation", "Detailed description is required.");

    if (!form.price.trim())
      return Alert.alert("Validation", "Price is required.");

    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum < MIN_PRICE)
      return Alert.alert("Validation", "Price must be greater than ₦0.");
    if (priceNum > MAX_PRICE)
      return Alert.alert(
        "Validation",
        `Price cannot exceed ₦${MAX_PRICE.toLocaleString("en-IN")}.`,
      );

    if (!form.address.trim())
      return Alert.alert("Validation", "Address is required.");

    if (!form.city.trim())
      return Alert.alert("Validation", "City is required.");

    if (!form.mobile_number.trim())
      return Alert.alert("Validation", "Mobile Number is required.");

    if (!form.whatsapp_number.trim())
      return Alert.alert("Validation", "Whatsapp Number is required.");

    if (form.images.length === 0)
      return Alert.alert("Validation", "Please upload at least one image.");

    setSubmitting(true);

    const { error } = await authSupabase.from("properties").insert({
      category: form.category,
      title: form.title.trim(),
      description: form.description.trim(),
      price: priceNum,
      address: form.address.trim(),
      city: form.city.trim(),
      mobile_number: form.mobile_number.trim(),
      whatsapp_number: form.whatsapp_number.trim(),
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      images: form.images,
      is_featured: form.isFeatured,
      is_sold: false,
    });

    setSubmitting(false);

    if (error) {
      Alert.alert("Error", "Failed to create property. Please try again.");
      console.error(error);
      return;
    }

    setForm(INITIAL_FORM);
    Alert.alert("Successful", "Listing have been published successfully.", [
      { text: "OK", onPress: () => router.replace("/(root)/(tabs)") },
    ]);
  };

  const Toggle = ({
    label,
    value,
    onChange,
    title,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
    title?: string;
  }) => (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      className={`flex-row items-center justify-between p-4 rounded-2xl border ${
        value ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
      }`}
    >
      <View className="flex-1 mr-3">
        <Text
          className={`font-semibold ${
            value ? "text-[#1d9bf0]" : "text-gray-700"
          }`}
        >
          {label}
        </Text>
        {title && <Text className="text-xs text-gray-400 mt-0.5">{title}</Text>}
      </View>
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          value ? "bg-[#1d9bf0] border-[#1d9bf0]" : "border-gray-300"
        }`}
      >
        {value && <Ionicons name="checkmark" size={14} color="white" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
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
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold text-gray-800 items-start">
                Photos{" "}
              </Text>
              <Text className="text-xs text-gray-400 items-end">
                {/* FIX */}
                {imagesCount.length}/6
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {form.localImages.map((uri, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri }}
                    className="w-24 h-24 rounded-2xl"
                    resizeMode="cover"
                  />
                  {index === 0 && (
                    <View className="absolute top-1 left-1 bg-blue-600 px-1.5 py-0.5 rounded-full">
                      <Text className="text-white text-[9px] font-bold">
                        COVER
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full items-center justify-center"
                  >
                    <Ionicons name="close" size={11} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              {form.localImages.length < 6 && (
                <TouchableOpacity
                  onPress={handlePickImages}
                  disabled={uploadingImages}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50"
                >
                  {uploadingImages ? (
                    <ActivityIndicator size="small" color="#2563EB" />
                  ) : (
                    <>
                      <Text className="text-2xl text-gray-400">+</Text>
                      <Text className="text-[10px] text-gray-400 mt-0.5 text-center">
                        Add{"\n"}Photos
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* <View className="flex-row gap-3 mb-3">
            <TouchableOpacity className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50">
              <Text className="text-2xl text-gray-400">+</Text>
              <Text className="text-[10px] text-gray-400 mt-0.5 text-center">
                Add{"\n"}Photos
              </Text>
            </TouchableOpacity>
          </View> */}

          <View className="mt-3 mb-3">
            <Text className="text-sm font-semibold text-gray-800 mb-1.5">
              Title
            </Text>
            <TextInput
              className={inputClass}
              placeholder="e.g. 3 Bedroom Apartment"
              placeholderTextColor="#c0c0c0"
              value={form.title}
              onChangeText={(v) => updateForm({ title: v })}
            />
          </View>
          <View className="mt-3 mb-3">
            <Text className="text-sm font-semibold text-gray-800 mb-1.5">
              Category
            </Text>
            <TouchableOpacity
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}

              className="border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 flex-row justify-between items-center"
            >
              <Text
                className={
                  category ? "text-sm text-gray-900" : "text-sm text-gray-900"
                }
              >
                {form.category || "Select category"}
              </Text>
              <AntDesign name="right" size={15} color="#c0c0c0" />
            </TouchableOpacity>

            {/* Dropdown List Items */}
            {isDropdownOpen && (
              <View className="mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                {CATEGORY.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => {
                      updateForm({ category: t });
                      setIsDropdownOpen(false); // Close dropdown after selection
                    }}
                    className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                      form.category === t ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm capitalize ${
                        form.category === t
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
              value={form.description}
              onChangeText={(v) => updateForm({ description: v })}
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
              value={form.address}
              onChangeText={(v) => updateForm({ address: v })}
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
              value={form.city}
              onChangeText={(v) => updateForm({ city: v })}
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
              value={form.price}
              onChangeText={(v) => updateForm({ price: v })}
            />
          </View>

          <View className="mt-3 mb-3">
            <Text className="text-sm font-semibold text-gray-800 mb-1.5">
              Mobile Number
            </Text>
            <TextInput
              className={inputClass}
              placeholder="e.g. 09134859402"
              placeholderTextColor="#9CA3AF"
              value={form.mobile_number}
              onChangeText={(v) => updateForm({ mobile_number: v })}
              keyboardType="numeric"
            />
          </View>
          <View className="mt-3 mb-3">
            <Text className="text-sm font-semibold text-gray-800 mb-1.5">
              Whatsapp Number
            </Text>
            <TextInput
              className={inputClass}
              placeholder="e.g. 09134859402"
              placeholderTextColor="#9CA3AF"
              value={form.whatsapp_number}
              onChangeText={(v) => updateForm({ whatsapp_number: v })}
              keyboardType="numeric"
            />
          </View>

          <View className="mt-3 mb-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-sm font-semibold text-gray-800 mb-1.5">
                Coordinates
              </Text>
              <TouchableOpacity
                onPress={handleDetectLocation}
                disabled={detectingLocation}
                className="flex-row items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"
              >
                {detectingLocation ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <Ionicons name="locate-outline" size={13} color="#c0c0c0" />
                )}
                <Text className="text-gray-800 text-xs font-semibold">
                  {detectingLocation ? "Detecting..." : "Detect Location"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextInput
                  className={inputClass}
                  placeholder="Latitude"
                  placeholderTextColor="#c0c0c0"

                  value={form.latitude}
                  onChangeText={(v) => updateForm({ latitude: v })}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className={inputClass}
                  placeholder="Longitude"
                  placeholderTextColor="#c0c0c0"

                  value={form.longitude}
                  onChangeText={(v) => updateForm({ longitude: v })}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Toggles Feactures */}
          <View className="gap-3 mb-5">
            <Toggle
              label="Featured Property"
              title="Show this in the Featured section on home"
              value={form.isFeatured}
              onChange={(v) => updateForm({ isFeatured: v })}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting || uploadingImages}
          activeOpacity={0.85}
          className="bg-gray-900 rounded-2xl py-4 mx-5 items-center mt-2"
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Publish Listing
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
