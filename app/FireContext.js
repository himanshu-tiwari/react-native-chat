import React, { createContext, useEffect, useState } from 'react';
import firebase from 'firebase';
import '@firebase/firestore'
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';

export const FireContext = createContext();

export const FireContextProvider = props => {
    const [db, setDb] = useState();
    const [uid, setUid] = useState();

    const init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
            });
        }

        setDb(firebase.firestore());
    };


    useEffect(() => {
        init();
    }, []);
