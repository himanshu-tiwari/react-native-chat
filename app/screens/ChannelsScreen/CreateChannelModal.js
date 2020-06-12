import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Modal, TextInput } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import ModalDropdown from 'react-native-modal-dropdown';
import AppText from '../../components/AppText';
import { isNonEmptyArray } from '../../helpers/checks';

const CreateChannelModal = props => {
    const [name, setName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const handleNameChange = useCallback(name => setName(name), []);
    const handleUserSelect = useCallback(
        (index, option) => {
            if (selectedUserIds.includes(option?.id)) {
                setSelectedUserIds(selectedUserIds.filter(id => id !== option?.id));
            } else {
                setSelectedUserIds([option?.id].concat(selectedUserIds));
            }
        },
        [selectedUserIds]
    );

    const usersMap = useCallback(user => user?.id, []);

    return <ReactNativeModal
        isVisible={props.visible}
        onRequestClose={props.close}
        onBackdropPress={props.close}
        animationIn={"slideInUp"}
        animationInTiming={500}
        animationOut={"slideOutDown"}
        animationOutTiming={500}
        useNativeDriver={true}
    >
        <View style={[styles.modalContainer, props.modalContainerStyle]}>
            <View style={[styles.titleContainer, props.titleContainerStyle]}>
                <AppText style={[styles.title, props.titleStyle]}>
                    Enter Channel Details
                </AppText>
            </View>

            <View style={[styles.bodyContainer, props.bodyContainerStyle]}>
                <TextInput
                    placeholder="name"
                    style={[styles.input, styles.name]}
                    value={name}
                    onChangeText={handleNameChange}
                />

                <ModalDropdown
                    defaultIndex={0}
                    options={props.users?.map(usersMap)}
                    style={[ styles.input, styles.users ]}
                    onSelect={handleUserSelect}
                    dropdownStyle={[
                        styles.dropdownList,
                        isNonEmptyArray(props.users) && props.users.length <= 5 && {
                            height: props.users.length * 36
                        }
                    ]}
                    dropdownTextStyle={styles.dropdownListText}
                >
                    <View style={styles.dropdownRow}>
                        <AppText>{ selectedUserIds.join(", ") }</AppText>
                    </View>
                </ModalDropdown>
            </View>
        </View>
    </ReactNativeModal>;
};

export default CreateChannelModal;

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 4
    },
    titleContainer: {
        paddingTop: 24,
        paddingHorizontal: 26
    },
    title: {
        color: "#fff",
        fontSize: 16
    },
    bodyContainer: {
        paddingVertical: 18,
        paddingHorizontal: 29,
    },
    dropdownList: {
        marginTop: 8,
        marginLeft: -16,
        minWidth: 200,
        width: '70%'
    },
    dropdownListText: {
        paddingLeft: 16,
        fontSize: 14
    }
});
