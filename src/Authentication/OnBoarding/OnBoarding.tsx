import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View, Image } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { interpolateColor } from 'react-native-redash';

import Slide, { SLIDE_HEIGHT } from './Slide';
import Subslide from './Subslide';
import Dot from './Dot';

import { AuthNavigationProps } from '../../components/Navigation';
import { useTheme } from '../../components';
import { makeStyles, Theme } from '../../components/Theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Relaxed',
    subtitle: 'Find Your Outfits',
    description: "Confused about your outfits? Don't worry! Find the best outfit here",
    color: '#BFEAF5',
    picture: {
      src: require('../../../assets/images/1.png'),
      width: 2513,
      height: 3583,
    },
  },
  {
    title: 'Playful',
    subtitle: 'Hear it First, Wear it First',
    description: 'Hating the clothes in your wardrobe? Explore hundreds of outif ideas',
    color: '#BEECC4',
    picture: {
      src: require('../../../assets/images/2.png'),
      width: 2791,
      height: 3744,
    },
  },
  {
    title: 'Excentric',
    subtitle: 'Your Style, Your Way',
    description: 'Create your individual & unique style and look amazing everyday',
    color: '#FFE4D9',
    picture: {
      src: require('../../../assets/images/3.png'),
      width: 2738,
      height: 3244,
    },
  },
  {
    title: 'Funky',
    subtitle: 'Look Good, Feel Good',
    description: 'Discover the latest trends in fashion and explore your personality',
    color: '#BFEAF5',
    picture: {
      src: require('../../../assets/images/4.png'),

      width: 1757,
      height: 2551,
    },
  },
];

export const assets = slides.map((slide) => slide.picture.src);

const Onboarding = ({ navigation }: AuthNavigationProps<'Onboarding'>) => {
  const theme = useTheme();

  const styles = useStyles();

  const scroll = useRef<Animated.ScrollView>(null);

  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    //@ts-ignore
    onScroll: ({ contentOffset }) => {
      x.value = contentOffset.x;
    },
  });

  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      x.value,
      slides.map((_, i) => i * width),
      slides.map((slide) => slide.color),
    ),
  );

  const slider = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const background = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const currentIndex = useDerivedValue(() => x.value / width);
  const footerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -x.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        //@ts-ignore
        style={[styles.slider, slider]}
      >
        {slides.map(({ picture }, index) => {
          // create untuk kasi tau lagi di posisi image mana
          const style = useAnimatedStyle(() => ({
            opacity: interpolate(
              x.value,
              [(index - 0.5) * width, index * width, (index + 0.5) * width],
              [0, 1, 0],
              Extrapolate.CLAMP,
            ),
          }));

          return (
            <Animated.View style={[styles.underlay, style]} key={index}>
              <Image
                source={picture.src}
                style={{
                  width: width - theme.borderRadii.xl,
                  height: ((width - theme.borderRadii.xl) * picture.height) / picture.width,
                }}
              />
            </Animated.View>
          );
        })}

        <Animated.ScrollView
          ref={scroll}
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
        >
          {slides.map(({ title, picture }, index) => (
            // jika indexnya bukan 0
            <Slide key={index} right={!!(index % 2)} {...{ title, picture }} />
          ))}
        </Animated.ScrollView>
      </Animated.View>

      <View style={styles.footer}>
        <Animated.View style={[StyleSheet.absoluteFill, background]} />
        <View style={styles.footerContent}>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              //@ts-ignore
              <Dot key={index} currentIndex={currentIndex} {...{ index, x }} />
            ))}
          </View>

          <Animated.View
            style={[
              {
                // translateX: multiply(x, -1) => dapetin datanya satu satu ber subtitle
                flex: 1,
                width: width * slides.length,
                flexDirection: 'row',
              },
              footerStyle,
            ]}
          >
            {slides.map(({ subtitle, description }, index) => {
              const last = index === slides.length - 1;

              return (
                // cek data sampai akhir dengan length
                <Subslide
                  key={index}
                  onPress={() => {
                    // jika dia last page, ketika klik button maka akan ke page Welcome
                    if (last) {
                      navigation.navigate('Welcome');
                    } else {
                      // logic untuk pindah page ketika dipress button-nya
                      scroll.current //@ts-ignore
                        ?.scrollTo({ x: width * (index + 1), animated: true });
                    }
                  }}
                  {...{ subtitle, description, last }}
                />
              );
            })}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  slider: {
    height: SLIDE_HEIGHT,
    borderBottomRightRadius: theme.borderRadii.xl,
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: theme.borderRadii.xl,
  },
  pagination: {
    ...StyleSheet.absoluteFillObject,
    height: theme.borderRadii.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  underlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomRightRadius: theme.borderRadii.xl,
    overflow: 'hidden',
  },
}));

export default Onboarding;
