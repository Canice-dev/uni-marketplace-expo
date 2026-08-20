import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const handleReset = () => {};
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true} // Allows background visibility
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />

        {/* Updated to 90% of screen height */}
        <View className="bg-white rounded-t-3xl h-[90%] pb-6">
          {/* Top Grab Handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-100">
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={18} color="#111827" />
            </TouchableOpacity>
            <Text className="text-base font-bold text-gray-900">Filters</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text className="text-gray-500 font-medium text-sm underline">
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
