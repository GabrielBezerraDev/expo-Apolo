import { Tabs } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="formIA"
        options={{
          title: 'Formulário IA',
          tabBarIcon: ({ color }) => <FontAwesome5 name="clipboard-list" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}