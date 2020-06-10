import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, Platform, Image } from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import AppBtn from '../../components/AppBtn';
import AppText from '../../components/AppText';
import { showMessage } from 'react-native-flash-message';

const audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';

const AppRecorder = props => {
    const [hasPermission, setHasPermission] = useState(false);
    const [currentTime, setCurrentTime] = useState(0.0);
    const [finished, setFinished] = useState(false);
    const [recording, setRecording] = useState(false);
    const [stoppedRecording, setStoppedRecording] = useState(false);
    const [paused, setPaused] = useState(false);

    console.log({ props });
    const prepareRecordingPath = useCallback(
        () => AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac"
        }),
        []
    );

    const finishRecording = useCallback(
        (didSucceed, filePath, fileSize) => {
            setFinished(didSucceed);

            console.log(
                `Finished recording of duration ${
                    currentTime
                } seconds at path: ${
                    filePath
                } and size of ${
                    fileSize || 0
                } bytes`
            );
        },
        [currentTime],
    );
    
    useEffect(() => {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            setHasPermission(isAuthorised);
            
            if (isAuthorised) {
                prepareRecordingPath();
                
                AudioRecorder.onProgress = (data) => {
                    setCurrentTime(Math.floor(data.currentTime));
                };
                
                AudioRecorder.onFinished = (data) => {
                    console.log({ data });
                    // Android callback comes in the form of a promise instead.
                    if (Platform.OS === 'ios') {
                        finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                    }
                };
            }
        });
    }, []);
    
    const record = useCallback(
        async () => {
            if (recording) {
                showMessage({ type: "warning", message: "Already recording!"});
            } else {
                if (!hasPermission) {
                    showMessage({ type: "danger", message: "Can\'t record, no permission granted!"});
                } else {
                    if(stoppedRecording){
                        prepareRecordingPath();
                    }
                
                    setRecording(true);
                    setPaused(false);
                
                    try {
                        const filePath = await AudioRecorder.startRecording();
                        console.log({ filePath });
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        },
        [recording, hasPermission, stoppedRecording, prepareRecordingPath]
    );

    const stop = useCallback(
        async () => {
            if (!recording) {
                showMessage({ type: "warning", message: "Can't stop, not recording!" });
                return;
            }
        
            setStoppedRecording(true);
            setRecording(false);
            setPaused(false);
        
            try {
                const filePath = await AudioRecorder.stopRecording();
        
                if (Platform.OS === "android") {
                    finishRecording(true, filePath);
                }

                return filePath;
            } catch (error) {
                console.error(error);
            }
        },
        [recording, Platform.OS, finishRecording],
    );

    return <View style={styles.container}>
        <View style={styles.controls}>
            <AppBtn style={styles.button} onPress={recording ? stop : record}>
                {/* <AppText style={recording ? styles.activeButtonText : styles.buttonText}>
                    RECORD
                </AppText> */}

                {
                    recording
                        ? <View style={styles.stop}>
                            <View style={styles.stopInternal}></View>
                        </View>
                        : <Image
                            source={require("../../assets/icons/microphone.png")}
                            style={styles.microphone}
                        />
                }
            </AppBtn>

            {/* <AppBtn style={styles.button} onPress={stop}>
                <AppText style={styles.buttonText}>
                    STOP
                </AppText>
            </AppBtn> */}

            {/* {this._renderButton("PLAY", () => {this._play()} )} */}
            {/* {this._renderButton("STOP", () => {this.stop()} )} */}
            {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
            {/* {this._renderPauseButton(() => {this.state.paused ? this._resume() : this._pause()})} */}
        </View>
    </View>;
};

export default AppRecorder;

const styles = StyleSheet.create({
    container: {
        flex: 0.15,
        // backgroundColor: "#ddd",
    },
    controls: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    progressText: {
        // paddingTop: 50,
        fontSize: 14,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: "#eee"
    },
    buttonText: {
        fontSize: 14,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 14,
        color: "#B81F00"
    },
    microphone: {
        width: 20,
        height: 20
    },
    stop: {
        width: 30,
        height: 30,
        backgroundColor: "#fff",
        borderRadius: 15,
        borderWidth: 5,
        borderColor: "#9075E3",
        justifyContent: "center",
        alignItems: "center"
    },
    stopInternal: {
        width: 10,
        height: 10,
        backgroundColor: "#9075E3"
    }
});
