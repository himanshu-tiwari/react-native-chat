import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import AppBtn from '../../components/AppBtn';
import AppText from '../../components/AppText';
import Sound from 'react-native-sound';
import storage from '@react-native-firebase/storage';
import { isNonEmptyString } from '../../helpers/checks';

const ControlBtn = props => <AppBtn style={styles.button} onPress={props.onPress}>
    <AppText style={styles.buttonText}>{ props.title }</AppText>
</AppBtn>;

const AppAudioPlayer = props => {
    const [sound, setSound] = useState();

    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        if (isNonEmptyString(props.currentMessage?.audio?.id)) {
            storage().ref(props.currentMessage?.audio?.id)
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
        }
    }, [props.currentMessage?.audio?.id]);

    const play = useCallback(
        () => {
            if (typeof(sound.play) === "function") {
                setPlaying(true);
                sound.play((success) => {
                    if (!success) {
                        showMessage({ type: "danger", message: "Playback failed due to audio decoding errors" });
                    }
    
                    setPlaying(false);
                });
            } else {
                showMessage({ type: "danger", message: "Unable to play the audio!" });
            }
        },
        [sound],
    );

    const pause = useCallback(
        () => {
            if (typeof(sound.pause) === "function") {
                setPlaying(false);
                sound.pause((success) => {
                    if (!success) {
                        showMessage({ type: "danger", message: "Playback failed due to audio decoding errors" });
                    }
                });
            } else {
                showMessage({ type: "danger", message: "Unable to pause the audio!" });
            }
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
