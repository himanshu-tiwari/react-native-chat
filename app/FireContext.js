import React, { createContext, useEffect, useState } from 'react';
import firebase from 'firebase';
import '@firebase/firestore'
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import { firebaseConfig } from './config.json';

export const FireContext = createContext();

export const FireContextProvider = props => {
    const [db, setDb] = useState();
    const [uid, setUid] = useState();

    const init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        setDb(firebase.firestore());
    };

    useEffect(() => {
        init();
    }, []);

    const signIn = (credentials, callback) => {
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
    };
    
    const signOut = (callback) => {
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
    };
    
    const signUp = (newUser, callback) => {
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
    };

    const send = messages => {
        messages.forEach(message => {
            db.collection("messages").add({
                text: message.text,
                timestamp: moment().format("X"),
                user: message.user,
            });
        });
    };

    const parse = message => {
        console.log({ message: message.data() });
        return ({
            _id: message.id,
            user: message.data()?.user,
            text: message.data()?.text,
            timestamp: moment(message.data()?.timestamp, "X").format("X"),
            createdAt: moment(message.data()?.timestamp, "X")
        });
    };

    const get = callback => {
        db.collection("messages").onSnapshot(querySnapshot => {
            console.log("here");
            callback(
                querySnapshot.docs
                    ?.map(parse)
                    ?.sort((a, b) => moment(a?.createdAt).isBefore(b?.createdAt) ? 1 : -1)
            );
        });
    };

    const off = () => db.off();

    return <FireContext.Provider value={{ send, parse, get, off, db, uid, signIn, signOut, signUp }}>{
        props.children
    }</FireContext.Provider>
};
