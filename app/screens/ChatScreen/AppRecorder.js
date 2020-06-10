import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, View, Platform, Image } from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import AppBtn from '../../components/AppBtn';
import { showMessage } from 'react-native-flash-message';
import storage from '@react-native-firebase/storage';
import { isNonEmptyString, isObject } from '../../helpers/checks';

const AppRecorder = props => {
    const [hasPermission, setHasPermission] = useState(false);
    const [currentTime, setCurrentTime] = useState(0.0);
    const [finished, setFinished] = useState(false);
    const [recording, setRecording] = useState(false);
    const [stoppedRecording, setStoppedRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [id] = useState(props.messageIdGenerator());

    const prepareRecordingPath = useCallback(
        () => AudioRecorder.prepareRecordingAtPath(`${ AudioUtils.DocumentDirectoryPath }/${ id }.aac`, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac"
        }),
        [id]
    );

    let reference;
    let fileName;
    const finishRecording = useCallback(
        async (didSucceed, filePath, fileSize) => {
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

            fileName = filePath?.split('/')?.reverse()[0];

            if (didSucceed && isNonEmptyString(fileName)) {
                props.setUploading(true);
                reference = storage().ref(id);

                if (isObject(reference)) {
                    // uploads file
                    const status = await reference.putFile(filePath);
                    
                    props.setUploading(false);
                    if (status?.state !== "success") {
                        showMessage({ type: "danger", message: "Could not upload the file to firebase storage!" });
                    } else {
                        props.send([{
                            _id: id,
                            text: "",
                            audio: status?.metadata?.fullPath,
                            user: props.user
                        }]);
                    }
                }
            }
        },
        [currentTime, props.send, props.user, id, props.setUploading],
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

    return <AppBtn style={styles.button} onPress={recording ? stop : record}>
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
    </AppBtn>;
};

export default AppRecorder;

const styles = StyleSheet.create({
    button: {
        padding: 20
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
