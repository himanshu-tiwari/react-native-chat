import React, { createContext, useEffect, useState, useCallback } from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { firebaseConfig } from './config.json';
import { isObject, isNonEmptyString } from './helpers/checks';

export const FireContext = createContext();

export const FireContextProvider = props => {
    const [db, setDb] = useState();
    const [uid, setUid] = useState();

    const init = useCallback(
        () => {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
    
            setDb(firebase.firestore());
        },
        [firebase.apps.length],
    );

    useEffect(() => {
        init();
    }, []);

    const signIn = useCallback(
        (credentials, callback) => {
            firebase.auth().signInWithEmailAndPassword(
                credentials.email,
                credentials.password
            ).then(res => {
                showMessage({ type: "success", message: "Login successful!" });
    
                if (typeof(callback) === "function") {
                    callback(res);
                }
            }).catch(error => {
                showMessage({
                    type: "danger",
                    message: error?.message ? error?.message : "Unable to login! Check inputs!"
                });
                console.log(error);
            });
        },
        [],
    );
    
    const signOut = useCallback(
        callback => {
            firebase.auth().signOut().then(res => {
                showMessage({ type: "success", message: "Logout successful!" });
    
                if (typeof(callback) === "function") {
                    callback(res);
                }
            }).catch(error => {
                showMessage({
                    type: "danger",
                    message: error?.message ? error?.message : "Error while logging out!"
                });
                console.log(error);
            });
        },
        [],
    );
    
    const signUp = useCallback(
        (newUser, callback) => {
            firebase.auth().createUserWithEmailAndPassword(
                newUser.email,
                newUser.password
            ).then(res => {
                showMessage({ type: "success", message: "Signup successful!" });
    
                if (typeof(callback) === "function") {
                    callback(res);
                }
            }).catch(error => {
                showMessage({
                    type: "danger",
                    message: error?.message ? error?.message : "Unable to signup! Check inputs!"
                });
                console.log(error);
            });
        },
        [],
    );

    const send = useCallback(
        messages => {
            messages.forEach(message => {
                db.collection("messages").add({
                    text: message.text,
                    timestamp: moment().format("X"),
                    user: message.user,
                    ...(isNonEmptyString(message.audio) ? { audio: message.audio } : {})
                });
            });
        },
        [db?.collection],
    );

    const parse = useCallback(
        message => {
            console.log({ message: message.data() });
            return ({
                _id: message.id,
                user: message.data()?.user,
                text: message.data()?.text,
                timestamp: moment(message.data()?.timestamp, "X").format("X"),
                createdAt: moment(message.data()?.timestamp, "X"),
                ...(
                    isNonEmptyString(message.data()?.audio)
                        ? { audio: message.data()?.audio }
                        : {}
                )
            });
        },
        [],
    );

    const messageFilter = useCallback(
        message => (
            isNonEmptyString(message?.id) &&
            isObject(message?.data()?.user) &&
            isNonEmptyString(message?.data()?.timestamp)
        ),
        [],
    );

    const messageSorter = useCallback(
        (a, b) => moment(a?.createdAt).isBefore(b?.createdAt) ? 1 : -1,
        [],
    );

    const get = useCallback(
        callback => {
            db.collection("messages").onSnapshot(querySnapshot => {
                callback(
                    querySnapshot.docs
                        ?.filter(messageFilter)
                        ?.map(parse)
                        ?.sort(messageSorter)
                );
            });
        },
        [db?.collection, parse],
    );

    const off = useCallback(() => db.off(), [db?.off]);

    return <FireContext.Provider value={{ send, parse, get, off, db, uid, signIn, signOut, signUp }}>{
        props.children
    }</FireContext.Provider>
};
