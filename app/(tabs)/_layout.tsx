import { Tabs } from 'expo-router';

import CartTabIcon from '@/components/CartTabIcon';
import { IconSymbol } from '@/components/IconSymbol';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors as ThemeColors } from '@/constants/theme';
import { useStore } from '@/stores/useStore';
import { ms } from '@/utils/responsive-dimensions';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const cartItemsCount = useStore((state) => state.getCartItemsCount());

  // Use theme colors based on color scheme
  const theme = colorScheme === 'dark' ? ThemeColors.dark : ThemeColors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          // height: hp(60),
          // paddingVertical: hp(8),
        },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={ms(24)} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              name="square.grid.2x2.fill"
              size={ms(24)}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <CartTabIcon color={color} count={cartItemsCount} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.fill" size={ms(24)} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
