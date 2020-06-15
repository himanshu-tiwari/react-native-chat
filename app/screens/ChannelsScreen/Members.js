import React, { useCallback, useEffect, useContext, useState } from 'react';
import { StyleSheet, View, InteractionManager } from 'react-native';
import { isNonEmptyArray, isNonEmptyString } from '../../helpers/checks';
import AppText from '../../components/AppText';
import { FireContext } from '../../contexts/FireContext';

const Members = ({ memberIds }) => {
    const { get } = useContext(FireContext);

    const [members, setMembers] = useState([]);

    const setNewMember = useCallback(
        member => setMembers(previousMembers => [
            ...previousMembers.filter(user => user?.id !== member?.id),
            member
        ]),
        [setMembers]
    );

    useEffect(() => {
        let expensiveCall;

        expensiveCall = InteractionManager.runAfterInteractions(() => {
            get("users", setNewMember, memberIds);
        });

        return () => {
            if (typeof(expensiveCall?.cancel) === "function") {
                expensiveCall.cancel();
            }
        }
    }, [memberIds, setNewMember]);

    const membersFilter = useCallback(
        member => isNonEmptyString(member?.id) && isNonEmptyString(member?.name),
        [],
    );

    const membersMap = useCallback(
        (member, i, members) => isNonEmptyString(member?.name)
            ? `${ member.name[0].toUpperCase() }${ member.name.slice(1) }`
            : '',
        [],
    );

    console.log({ members: members.filter(membersFilter), memberIds });
    
    return <View style={styles.membersListContainer}>{
        isNonEmptyArray(members)
            ? <AppText style={styles.membersList} numberOfLines={1}>{
                members.filter(membersFilter).map(membersMap).join(", ")
            }</AppText>
            : <AppText style={styles.noMember}>Tap here to get more info</AppText>
    }</View>;
};

export default Members;

const styles = StyleSheet.create({
    membersList: {
        // flexDirection: "row",
        // maxWidth: "100%"
    },
    member: {
        fontSize: 14,
        marginRight: 5,
        // flex: 1,
        textTransform: "capitalize"
    },
    finalMember: {
        marginRight: 0
    }
});
