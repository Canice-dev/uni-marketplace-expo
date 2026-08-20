// import { View, Text, ScrollView } from "react-native";
// import React from "react";

// export default function searchItems() {
//   return (
//     <ScrollView>
//         <View className="flex-row justify-between items-center mb-3 mt-3">
//           <Text className="text-base font-bold text-gray-900">Filters</Text>
//           <Text className="text-blue-500 text-sm font-medium">Clear All</Text>
//         </View>
//         <Text className="text-[14px] font-semibold text-[#0d0d0d] mb-3">
//           Price Range
//         </Text>
//         <View className="flex-row justify-between mb-2">
//           <Text className="text-sm text-gray-700">$100</Text>
//           <Text className="text-sm text-gray-700">$100,000+</Text>
//         </View>
//         <View className="h-1 bg-gray-200 rounded-full mb-3 mt-3">
//           <View className="absolute h-1 bg-gray-500 rounded-full left-0 right-0" />
//         </View>

//         <View className="mt-3 mb-3">
//           <TouchableOpacity
//             onPress={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="py-3.5 bg-gray-50 flex-row justify-between items-center"
//           >
//             <Text className="text-sm font-semibold text-gray-800">
//               Category
//             </Text>
//             <View className="flex-row gap-2 items-center justify-center">
//               <Text
//                 numberOfLines={1}
//                 className="text-sm text-gray-900 font-medium text-right shrink"
//               >
//                 {category || "Any category"}
//               </Text>
//               <AntDesign
//                 name={isDropdownOpen ? "down" : "right"}
//                 size={13}
//                 color="#c0c0c0"
//               />
//             </View>
//           </TouchableOpacity>

//           {isDropdownOpen && (
//             <View className="mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
//               {/* Option to clear/reset selection */}
//               <TouchableOpacity
//                 onPress={() => {
//                   setCategory("");
//                   setIsDropdownOpen(false);
//                 }}
//                 className={`px-4 py-3 border-b border-gray-100 ${
//                   category === "" ? "bg-gray-100" : "bg-white"
//                 }`}
//               >
//                 <Text
//                   className={`text-sm ${
//                     category === ""
//                       ? "font-bold text-gray-900"
//                       : "font-medium text-gray-600"
//                   }`}
//                 >
//                   Any category
//                 </Text>
//               </TouchableOpacity>

//               {CATEGORY.map((t) => (
//                 <TouchableOpacity
//                   key={t}
//                   onPress={() => {
//                     setCategory(t);
//                     setIsDropdownOpen(false);
//                   }}
//                   className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
//                     category === t ? "bg-gray-100" : "bg-white"
//                   }`}
//                 >
//                   <Text
//                     className={`text-sm capitalize ${
//                       category === t
//                         ? "font-bold text-gray-900"
//                         : "font-medium text-gray-600"
//                     }`}
//                   >
//                     {t}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         <View className="py-4 ">
//           <Text className="text-[14px] font-semibold text-[#0d0d0d] mb-3">
//             Location
//           </Text>
//           <TextInput
//             className={inputClass}
//             placeholder="Nsukka..."
//             placeholderTextColor="#aaa"
//             value={location}
//             onChangeText={setLocation}
//           />
//         </View>
//       </ScrollView>
//   );
// }
