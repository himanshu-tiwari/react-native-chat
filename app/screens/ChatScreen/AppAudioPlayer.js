import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import AppBtn from '../../components/AppBtn';
import AppText from '../../components/AppText';
import Sound from 'react-native-sound';
import storage from '@react-native-firebase/storage';

const ControlBtn = props => <AppBtn style={styles.button} onPress={props.onPress}>
    <AppText style={styles.buttonText}>{ props.title }</AppText>
</AppBtn>;

const AppAudioPlayer = props => {
    const [sound, setSound] = useState();

    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        storage().ref(props.currentMessage?.audio)
            ?.getDownloadURL()
            ?.then(url => {
                setSound(new Sound(url, '', error => {
                    if (error) {
                        showMessage({ type: "danger", message: "Failed to load the sound" });
                        console.log(error);
                    }
                }))
            }).catch(error => {
                showMessage({
                    type: "danger",
                    message: "Error while getting download url for the audio file!"
                });

                console.log(error);
            });
    }, [props.currentMessage?.audio]);

    const play = useCallback(
        () => {
            setPlaying(true);
            sound.play((success) => {
                if (!success) {
                    showMessage({ type: "danger", message: "Playback failed due to audio decoding errors" });
                }

                setPlaying(false);
            });
        },
        [sound],
    );

    const pause = useCallback(
        () => {
            setPlaying(false);
            sound.pause((success) => {
                if (!success) {
                    showMessage({ type: "danger", message: "Playback failed due to audio decoding errors" });
                }
            });
        },
        [sound],
    );

    return <View style={styles.container}>
        <View style={styles.controls}>
            {
                !playing
                    ? <ControlBtn title="PLAY" onPress={play} />
                    : <ControlBtn title="PAUSE" onPress={pause} />
            }
        </View>
    </View>;
};

export default AppAudioPlayer;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#2b608a",
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 14,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    }
});
