import React, { useState, useCallback } from 'react';
import { TouchableWithoutFeedback, Animated, ActivityIndicator } from 'react-native';
import { HiddenAppText } from './AppText';

const AppBtn = props => {
    const [scale] = useState(new Animated.Value(1));

    const animateIn = useCallback(
        () => {
            if (!props.disabled) {
                Animated.timing(scale, {
                    toValue: props.scale || 0.85,
                    duration: props.duration || 200,
                    useNativeDriver: true
                }).start();
            }
        },
        [props.disabled, scale, props.scale, props.duration]
    );

    const animateOut = useCallback(
        () => {
            if (!props.disabled) {
                Animated.timing(scale, {
                    toValue: 1,
                    duration: props.duration || 200,
                    useNativeDriver: true
                }).start();
            }
        },
        [props.disabled, scale, props.duration]
    );

    return <TouchableWithoutFeedback
        onPress={props.onPress}
        onPressIn={animateIn}
        onPressOut={animateOut}
    >
        <Animated.View style={[props.style, { transform: [{ scale }] }]}>
            {
                props.loading
                    ? (
                        props.displayAlternateLoader
                            ? props.alternateLoader
                            : <ActivityIndicator
                                size="small"
                                color={props.loaderColor || "#AD5AFF"}
                                style={props.loaderStyle}
                            />
                    ) : (props.notLoadingState || <HiddenAppText />)
            }
            { props.children }
        </Animated.View>
    </TouchableWithoutFeedback>;
};

export default AppBtn;