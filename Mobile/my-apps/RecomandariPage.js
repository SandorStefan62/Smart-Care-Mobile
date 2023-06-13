import React, { useState, useEffect, version } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Dimensions, StyleSheet, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function RecomandariPage({ navigation }) {
    const [error, setError] = useState('');
    const [readings, setReadings] = useState('');
    const [idPacient, setIdPacient] = useState('');
    const [idRecomandare, setIdRecomandare] = useState('');
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
                getIdRecomandare();
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

    const getIdRecomandare = async () => {
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
                if (data.data.id_recomandare) {
                    setIdRecomandare(data.data.id_recomandare);
                }
                fetchRecomandari();
            } else {
                console.log("NOK idalarma");
            }

        } catch (error) {
            console.error(error);
            localStorage.removeItem("token");
        }
    }

    const fetchRecomandari = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const responseRecomandari = await fetch(
                `https://server-ip2023.herokuapp.com/api/get-recomandari-details/${idRecomandare}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const dataRecomandari = await responseRecomandari.json();
            setReadings(dataRecomandari.data);
        } catch (error) {
            setError(error);
            console.log(error);
        }
    }

    console.log(readings);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recomandari</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={() => navigation.navigate('Home')}>Inapoi</Text>
            </TouchableOpacity>
            <Text>{readings.recomandare}</Text>
        </View>
    );
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F28',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    text: {
        color: 'white'
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
    readingItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#3C3F4D',
        borderRadius: 10,
    },
    readingText: {
        color: '#FFFFFF',
    },
})

export default RecomandariPage;