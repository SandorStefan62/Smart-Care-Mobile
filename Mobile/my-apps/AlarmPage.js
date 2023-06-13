import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Dimensions, StyleSheet, Touchable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function AlarmPage({ navigation }) {
    const [error, setError] = useState('');
    const [mesaj, setMesaj] = useState('Nu exista nici o alarma in acest moment.');
    const [idPacient, setIdPacient] = useState('');
    const [idAlarma, setIdAlarma] = useState('');
    const [rol, setRol] = useState('');

    useEffect(() => {
        verifyToken();
    })

    const verifyToken = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch("https://server-ip2023.herokuapp.com/api/verifytoken", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok) {
                console.log("OK");
                const data = await response.json();
                setRol(data.data.rol);
                if (data.data.rol === 'Pacient') {
                    setIdPacient(data.data.id_pacient);

                } else {
                    getIngrijitor();
                }
                getIdAlarma();
                console.log(idPacient);
            } else {
                console.log("NOK verify");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getIngrijitor = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await fetch("https://server-ip2023.herokuapp.com/api/get-ingrijitor", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json();
            setIdPacient(data.data.id_pacient);
        } catch (error) {
            console.error("eroare ingrijitor");
        }
    }

    const getIdAlarma = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            console.log(idPacient);
            const response = await fetch(`https://server-ip2023.herokuapp.com/api/get-pacient-details/${idPacient}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok) {
                console.log("OK");
                const data = await response.json();
                console.log(data.data);
                if (data.data.id_alarma) {
                    setIdAlarma(data.data.id_alarma);
                }
                fetchAlarm();
            } else {
                console.log("NOK idalarma");
            }
        } catch (error) {
            console.error(error);
            localStorage.removeItem("token");
        }
    }

    const fetchAlarm = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const responseAlarme = await fetch(
                `https://server-ip2023.herokuapp.com/api/get-alarm-details/${idAlarma}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const dataAlarme = await responseAlarme.json();
            console.log(dataAlarme);
            setMesaj(dataAlarme.data.mesaj);
            console.log(mesaj);
        } catch (error) {
            setError(error);
            console.log(error);
        }
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.text}>{mesaj}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={() => navigation.navigate('Home')}>Inapoi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'red',
    },
    text: {
        color: 'white'
    },
    button: {
        backgroundColor: 'crimson',
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
})

export default AlarmPage;