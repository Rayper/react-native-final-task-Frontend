import React, { useState } from 'react';
import { useTiming } from 'react-native-redash';

import { Box, Header } from '../../components';
import { HomeNavigationProps } from '../../components/Navigation';

import Background from './Background';
import Card from './Card';
import Categories from './Categories';

const cards = [
  {
    index: 3,
    source: require('../../../assets/images/4.png'),
  },
  {
    index: 2,
    source: require('../../../assets/images/3.png'),
  },
  {
    index: 1,
    source: require('../../../assets/images/2.png'),
  },
  {
    index: 0,
    source: require('../../../assets/images/1.png'),
  },
];

// function untuk step-step saat swipe, card yang di swipe akan ke belakang dan card yang dibelakangnya akan maju
const step = 1 / (cards.length - 1);

export const OutfitIdeas = ({ navigation }: HomeNavigationProps<'OutfitIdeas'>) => {
  // start dari 0
  const [currentIndex, setCurrentIndex] = useState(0);
  // index untuk animation
  const aIndex = useTiming(currentIndex);

  return (
    <Box flex={1} backgroundColor="white">
      <Header
        tittle="Outfit Ideas"
        left={{ icon: 'menu', onPress: () => navigation.openDrawer() }}
        right={{ icon: 'shopping-bag', onPress: () => navigation.navigate('Cart') }}
      />
      <Categories />
      <Box flex={1}>
        <Background />
        {cards.map(
          ({ index, source }) =>
            currentIndex < index * step + step && (
              // looping cardnya
              <Card
                key={index}
                // posisi card yang di swipe akan ke belakang dan card yang dibelakangnya akan maju
                index={index}
                aIndex={aIndex}
                step={step}
                // function untuk swipe
                onSwipe={() => setCurrentIndex((prev) => prev + step)}
                {...{ source }}
              />
            ),
        )}
      </Box>
    </Box>
  );
};

export default OutfitIdeas;
