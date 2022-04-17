import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

import { Box, Header, useTheme, Text } from '../../components';
import { HomeNavigationProps } from '../../components/Navigation';
import { aspectRatio, width } from '../../components/Theme';

import CartContainer from './CartContainer';
import Item from './Item';

const height = 100 * aspectRatio;

const d = 'M 0 0 A 50 50 0 0 0 50 50 H 325 A 50 50 0 0 1 375 100 V 0 0 Z';

const Cart = ({ navigation }: HomeNavigationProps<'Cart'>) => {
  const theme = useTheme();

  return (
    <CartContainer>
      <Box>
        <Box backgroundColor="primary">
          <Header
            dark
            tittle="Shopping Cart"
            left={{ icon: 'arrow-left', onPress: () => navigation.goBack() }}
          />
        </Box>
        <Box style={{ position: 'absolute', bottom: -height, left: 0, right: 0, height }}>
          <Svg style={StyleSheet.absoluteFill} viewBox="0 0 375 100">
            <Path fill={theme.colors.primary} d={d} />
          </Svg>
          <Text variant="title2" textAlign="center" color="white">
            3 Items Added
          </Text>
        </Box>
      </Box>
      <ScrollView
        style={{
          borderBottomRightRadius: theme.borderRadii.xl,
          borderBottomLeftRadius: theme.borderRadii.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Item />
        <Item />
        <Item />
        <Item />
      </ScrollView>
    </CartContainer>
  );
};

export default Cart;