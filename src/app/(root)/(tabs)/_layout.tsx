import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useUserStore } from "../../../../store/userStore";

function TabIcon({
  icon,
  focused,
}: {
  icon: React.ReactNode;
  focused: boolean;
}) {
  return (
    <View className="items-center" style={{ gap: 5 }}>
      {icon}
      {focused && <View className="w-1 h-1 rounded-full bg-[#0d0d0d]" />}
    </View>
  );
}

export default function TabsLayout() {
  const isAdmin = useUserStore((state) => state.isAdmin);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#0d0d0d",
        tabBarInactiveTintColor: "#C4C4C4",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.1)",
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          backgroundColor: "#fff",
          height: 64,
        },
        tabBarItemStyle: { paddingVertical: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Octicons
                  name={focused ? "home-fill" : "home"}
                  size={22}
                  color={focused ? "#0d0d0d" : "#C4C4C4"}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Ionicons
                  name={focused ? "search" : "search-outline"}
                  size={22}
                  color={focused ? "#0d0d0d" : "#C4C4C4"}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "List property",
          href: isAdmin ? undefined : null,
          tabBarIcon: () => (
            <View
              className="w-11 h-11 bg-[#0d0d0d] rounded-full items-center justify-center"
              style={{
                marginTop: -6,
                shadowColor: "#0d0d0d",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Ionicons name="add" size={26} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <AntDesign
                  name={focused ? "heart" : "heart"}
                  size={22}
                  color={focused ? "#0d0d0d" : "#C4C4C4"}
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={22}
                  color={focused ? "#0d0d0d" : "#C4C4C4"}
                />
              }
            />
          ),
        }}
      />
    </Tabs>

    // <Tabs
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarActiveTintColor: "#111827",
    //     tabBarInactiveTintColor: "#9CA3AF",
    //   }}
    // >
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: "Home",
    //       tabBarIcon: ({ color, size }) => (
    //         <Octicons name="home-fill" size={size} color="black" />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="search"
    //     options={{
    //       title: "Search",
    //       tabBarIcon: ({ color, size }) => (
    //         <Feather name="search" size={size} color="black" />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="create"
    //     options={{
    //       title: "List property",
    //       href: isAdmin ? undefined : null,
    //       tabBarIcon: ({ color, size }) => (
    //         <View className="w-10 h-10 bg-[#0D0D0D] rounded-full items-center justify-center -mt-1 shadow-sm">
    //           <Ionicons name="add" size={24} color="#FFFFFF" />
    //         </View>
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="saved"
    //     options={{
    //       title: "Saved",
    //       tabBarIcon: ({ color, size }) => (
    //         <AntDesign name="heart" size={size} color="black" />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       title: "Profile",
    //       tabBarIcon: ({ color, size }) => (
    //         <Ionicons name="person-outline" size={size} color="black" />
    //       ),
    //     }}
    //   />
    // </Tabs>
  );
}

// function IOSTabs() {
//   const isAdmin = useUserStore((state) => state.isAdmin);

//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger name="index">
//         <Icon sf="house.fill" />
//         <Label>Home</Label>
//       </NativeTabs.Trigger>

//       <NativeTabs.Trigger name="search">
//         <Icon sf="magnifyingglass" />
//         <Label>Search</Label>
//       </NativeTabs.Trigger>

//       {isAdmin && (
//         <NativeTabs.Trigger name="create">
//           <Icon sf="plus.circle.fill" />
//           <Label>Add Property</Label>
//         </NativeTabs.Trigger>
//        )}

//       <NativeTabs.Trigger name="starred">
//         <Icon sf="star" />
//         <Label>Starred</Label>
//       </NativeTabs.Trigger>

//       <NativeTabs.Trigger name="profile">
//         <Icon sf="person.fill" />
//         <Label>Profile</Label>
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }

// export default function TabsLayout() {
//   return Platform.OS === "ios" ? <IOSTabs /> : <AndroidTabs />;
// }
