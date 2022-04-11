import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { add } from 'react-native-reanimated';
import { mix, mixColor, usePanGestureHandler, withSpring } from 'react-native-redash';
import { Box } from '../../components';

interface CardProps {
  position: Animated.Adaptable<number>;
}

const { width: wWidth } = Dimensions.get('window');
const width = wWidth * 0.75;
const height = width * (425 / 294);
const borderRadius = 24;

const Card = ({ position }: CardProps) => {
  const { gestureHandler, translation, velocity, state } = usePanGestureHandler();

  const backgroundColor = mixColor(position, '#463179', '#1563a5');

  const translateYOffset = mix(position, 0, -75);

  const translateY = add(
    translateYOffset,
    withSpring({
      value: translation.y,
      velocity: velocity.y,
      state,
      snapPoints: [0],
    }),
  );

  const scale = mix(position, 1, 0.9);

  const translateX = withSpring({
    value: translation.x,
    velocity: velocity.x,
    state,
    snapPoints: [-width, 0, width],
  });

  return (
    <Box style={StyleSheet.absoluteFillObject} justifyContent="center" alignItems="center">
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            backgroundColor,
            width,
            height,
            borderRadius,
            transform: [{ translateY }, { translateX }, { scale }],
          }}
        />
      </PanGestureHandler>
    </Box>
  );
};

export default Card;