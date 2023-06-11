import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons';

function ChangePassPage({ navigation }) {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(true);

    const handlePasswordReset = async () => {
        if (isValid) {
            try {
                const response = await fetch(
                    "https://server-ip2023.herokuapp.com/email/change-password-email",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                } else {
                    const data = await response.json();
                }
            } catch (error) {
                console.log("Error:", error);
            }
        }

        navigation.navigate("Login");
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.label}>Introduceti e-mailul contului</Text>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="email-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.label}>E-mail: </Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail}></TextInput>
                </View>
                <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                    <Text style={styles.buttonText}>Schimbare parola</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.buttonText}>Inapoi</Text>
                </TouchableOpacity>
            </View >
        </View >
    );
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1F28',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#1E1F28',
    },
    button: {
        backgroundColor: '#5C5EDD',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        width: windowWidth - 40,
        maxWidth: 400,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3C3F4D',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        width: windowWidth - 40,
        maxWidth: 400,
    },
    label: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 5,
        flexShrink: 1,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 5,
    },
});

export default ChangePassPage;