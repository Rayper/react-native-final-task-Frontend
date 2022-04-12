import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Transitioning, Transition, TransitioningView } from 'react-native-reanimated';

import { Header } from '../../components';
import { HomeNavigationProps } from '../../components/Navigation';
import { Box, useTheme } from '../../components/Theme';

import Footer from './Footer';
import Outfit from './Outfit';

const { width: wWidth } = Dimensions.get('window');

const defaultoutfits = [
  {
    id: 1,
    color: '#BFEAF5',
    aspectRatio: 1,
    selected: false,
  },
  {
    id: 2,
    color: '#BEECC4',
    aspectRatio: 200 / 145,
    selected: false,
  },
  {
    id: 3,
    color: '#FFE4D9',
    aspectRatio: 180 / 145,
    selected: false,
  },
  {
    id: 4,
    color: '#D5C3BB',
    aspectRatio: 180 / 145,
    selected: false,
  },
  {
    id: 5,
    color: '#BFEAF5',
    aspectRatio: 1,
    selected: false,
  },
  {
    id: 6,
    color: '#F3F0EF',
    aspectRatio: 120 / 145,
    selected: false,
  },
  {
    id: 7,
    color: '#D5C3BB',
    aspectRatio: 210 / 145,
    selected: false,
  },
  {
    id: 8,
    color: '#DEEFC4',
    aspectRatio: 160 / 145,
    selected: false,
  },
];

const FavoriteOutfits = ({ navigation }: HomeNavigationProps<'FavoriteOutfits'>) => {
  const theme = useTheme();
  const width = (wWidth - theme.spacing.m * 3) / 2;
  // untuk adjust footer height
  const [footerHeight, setFooterHeight] = useState(0);
  const [outfits, setOutfits] = useState(defaultoutfits);
  // untuk animasi 
  const transition = <Transition.Change interpolation='easeInOut' />;
  const left = useRef<TransitioningView>(null);
  const right = useRef<TransitioningView>(null);

  return (
    <Box flex={1} backgroundColor="white">
      <Header
        tittle="Favorite Outfits"
        left={{ icon: 'menu', onPress: () => navigation.openDrawer() }}
        right={{ icon: 'shopping-bag', onPress: () => true }}
      />
      <Box flex={1}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.m,
            paddingBottom: footerHeight,
          }}
        >
          <Box flexDirection="row">
            <Box marginRight="m">
              <Transitioning.View ref={left} {...{ transition }}>
              {outfits
                .filter((_, i) => i % 2 !== 0)
                .map((outfit) => (
                  <Outfit key={outfit.id} outfit={outfit} width={width} />
                ))}
                </Transitioning.View>
            </Box>
            <Box>
              <Transitioning.View ref={right} {...{ transition }}>
                {outfits
                  .filter((_, i) => i % 2 === 0)
                  .map((outfit) => (
                    <Outfit key={outfit.id} outfit={outfit} width={width} />
                  ))}
              </Transitioning.View>
            </Box>
          </Box>
        </ScrollView>
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          onLayout={({
            nativeEvent: {
              layout: { height },
            },
          }) => setFooterHeight(height)}
        >
          <Footer label="Add to Favorites" onPress={() => {
            left.current?.animateNextTransition();
            right.current?.animateNextTransition();
            // set ketika dipress maka outfit yang selected nya true akan dimasukan ke state 
            setOutfits(outfits.filter((outfit) => !outfit.selected))
          }} />
        </Box>
      </Box>
    </Box>
  );
};

export default FavoriteOutfits;