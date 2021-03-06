import React, { Children, ReactNode, useState } from 'react';
import { Dimensions } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { mix, useTiming } from 'react-native-redash';

import { Box, Text, useTheme } from '../../components';

interface Tab {
  id: string;
  title: string;
}

interface TabsProps {
  tabs: Tab[];
  children: ReactNode;
}

const { width } = Dimensions.get('window');
const Tabs = ({ tabs, children }: TabsProps) => {
  const theme = useTheme();
  // state untuk ngecheck sedang di tab yang mana
  const [index, setIndex] = useState(0);
  // const selectedTab = tabs[index];
  const transition = useTiming(index);

  const content = useAnimatedStyle(() => ({
    transform: [{ translateX: -width * transition.value }],
  }));

  const dot = useAnimatedStyle(() => ({
    transform: [{ translateX: mix(transition.value, width * 0.15, width * 0.5) }],
  }));

  return (
    <Box flex={1}>
      <Box flexDirection="row">
        {tabs.map((tab, i) => (
          <RectButton style={{ flex: 1 }} key={i} onPress={() => setIndex(i)}>
            <Box padding="m" style={{ paddingBottom: theme.spacing.m + 10 }}>
              <Text variant="title3" textAlign="center">
                {tab.title}
              </Text>
            </Box>
          </RectButton>
        ))}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: -5,
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
            },
            dot,
          ]}
        >
          <Box
            position="absolute"
            bottom={0}
            left={0}
            width={10}
            height={10}
            style={{ borderRadius: 5 }}
            backgroundColor="primary"
          ></Box>
        </Animated.View>
      </Box>
      <Animated.View
        style={[
          {
            flex: 1,
            width: width * tabs.length,
            flexDirection: 'row',
          },
          content,
        ]}
      >
        {Children.map(children, (child, i) => (
          <Box flex={1} key={i} width={width}>
            {child}
          </Box>
        ))}
      </Animated.View>
    </Box>
  );
};

export default Tabs;
