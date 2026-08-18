// import { useUserStore } from "@/store/userStore";
// import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";
import { useUserStore } from "../../../../store/userStore";

export default function TabsLayout() {
  const isAdmin = useUserStore((state) => state.isAdmin);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Octicons name="home-fill" size={size} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "List property",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="circle-plus" size={size} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="heart" size={size} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color="black" />
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
    //       // tabBarIcon: ({ color, size }) => (
    //       //   <Ionicons name="home" color={color} size={size} />
    //       // ),
    //     }}
    //   />
    // </Tabs>

    // <Tabs.Screen
    //   name="search"
    //   options={{
    //     title: "Search",
    //     // tabBarIcon: ({ color, size }) => (
    //     //   <Ionicons name="search" color={color} size={size} />
    //     // ),
    //   }}
    // />

    // <Tabs.Screen
    //   name="create"
    //   options={{
    //     title: "Add property",
    //     // href: isAdmin ? undefined : null,
    //     tabBarIcon: ({ color, size }) => (
    //       <Ionicons name="add-circle" color={color} size={size} />
    //     ),
    //   }}
    // />
    // <Tabs.Screen
    //   name="starred"
    //   options={{
    //     title: "Wishlist",
    //     tabBarIcon: ({ color, size }) => (
    //       <Ionicons name="heart" color={color} size={size} />
    //     ),
    //   }}
    // />

    // <Tabs.Screen
    //   name="profile"
    //   options={{
    //     title: "Profile",
    //     tabBarIcon: ({ color, size }) => (
    //       <Ionicons name="person" color={color} size={size} />
    //     ),
    //   }}
    // />
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
