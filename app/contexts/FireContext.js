import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { firebaseConfig } from '../config.json';
import { isObject, isNonEmptyString, isNonEmptyArray } from '../helpers/checks';
export const FireContext = createContext();

export const FireContextProvider = props => {
    const [db, setDb] = useState();
    const [uid, setUid] = useState();
    const { removeOneSignalEvents } = useContext(NotificationContext);

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

    const send = useCallback(
        (doc, name) => {
            db.collection(name).add({
                ...doc,
                timestamp: moment().format("X")
            });
        },
        [db?.collection],
    );

    const parse = useCallback(
        doc => {
            return ({
                _id: doc.id,
                ...doc?.data(),
                ...(
                    isNonEmptyString(doc.data()?.timestamp)
                        ? {
                            timestamp: moment(doc.data()?.timestamp, "X").format("X"),
                            createdAt: moment(doc.data()?.timestamp, "X")
                        } : {}
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

    const get = useCallback(
        (name, callback, matchCondition) => {
            if (name === "messages") {
                db.collection(name)
                    .where("channelId", "==", matchCondition)
                    .orderBy("timestamp", "desc")
                    .onSnapshot(querySnapshot => {
                        callback(querySnapshot?.docs?.filter(messageFilter)?.map(parse));
                    });
            } else if (name === "channels") {
                db.collection(name)
                    .where("members", "array-contains", matchCondition)
                    .orderBy("timestamp", "desc")
                    .onSnapshot(querySnapshot => {
                        callback(querySnapshot?.docs?.map(parse));
                    });
            } else {
                if (isNonEmptyArray(matchCondition)) {
                    matchCondition?.forEach(id => {
                        db.collection(name)
                            .where("id", "==", id)
                            .orderBy("name")
                            .onSnapshot(querySnapshot => {
                                callback(querySnapshot?.docs?.map(parse)[0]);
                            }); 
                    });
                } else {
                    db.collection(name)
                        .orderBy("name")
                        .onSnapshot(querySnapshot => {
                            callback(querySnapshot?.docs?.map(parse));
                        });
                }
            }
        },
        [db?.collection, parse],
    );

    const off = useCallback(() => db.off(), [db?.off]);

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
                
                removeOneSignalEvents();

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
    
                send(
                    {
                        id: res?.user?.uid,
                        email: res?.user?.email,
                        name: res?.user?.email?.split("@")[0]
                    },
                    "users"
                );

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
        [send],
    );

    return <FireContext.Provider value={{ send, parse, get, off, db, uid, signIn, signOut, signUp }}>{
        props.children
    }</FireContext.Provider>
};
