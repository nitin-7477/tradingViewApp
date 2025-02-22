import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HEIGHT, WIDTH } from '../theme';
import Feather from "react-native-vector-icons/Feather"


interface Holding {
    symbol: string;
    quantity: number;
    ltp: number;
    avgPrice: number;
    close: number;
}

const MyHoldings: React.FC = () => {
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);

    const fetchMyHoldings = async () => {
        try {
            const response = await axios.get('https://json-jvjm.onrender.com/test');
            setHoldings(response?.data?.userHolding);
        } catch (error) {
            console.error('Error fetching holdings:', error);
        }
    };

    useEffect(() => {
        fetchMyHoldings();
    }, []);

    console.log(holdings, "holdings------>");

    const calculateTotalValue = (ltp: number, quantity: number) => ltp * quantity;
    const calculatePnl = (ltp: number, avgPrice: number, quantity: number) => (ltp - avgPrice) * quantity;

    const totalCurrentValue = holdings.reduce((acc, item) => acc + calculateTotalValue(item?.ltp, item?.quantity), 0);
    const totalInvestment = holdings.reduce((acc, item) => acc + calculateTotalValue(item?.avgPrice, item?.quantity), 0);
    const totalPnl = totalCurrentValue - totalInvestment;
    const todayPnl = holdings.reduce((acc, item) => acc + ((item.close - item.ltp) * item.quantity), 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>My Holdings</Text>
            </View>

            <FlatList
                data={holdings}
                keyExtractor={(item) => item.symbol}
                renderItem={({ item }) => {
                    const pnl = calculatePnl(item?.ltp, item?.avgPrice, item?.quantity);
                    const isProfit = pnl >= 0;
                    return (
                        <View style={styles.item}>
                            <View style={styles.row}>
                                <Text style={styles.symbol}>{item.symbol.replace(/\s/g, "")}</Text>
                                <Text style={styles.symbol}>Rs {item?.avgPrice}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.grayText}>{item.symbol}</Text>
                                <Text style={styles.grayText}>Qty: {item?.quantity}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.symbol}>Total Value: ₹{calculateTotalValue(item.ltp, item.quantity).toFixed(2)}</Text>
                                <Text style={[styles.pnlText, { color: isProfit ? 'green' : 'red' }]}>
                                    {isProfit ? <Feather name='arrow-up-right' size={20} color='green' /> : <Feather name='arrow-down-right' size={20} color='red' />} ₹{pnl?.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    );
                }}
            />

            {/* Button to Open Bottom Sheet */}
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Total P&L {totalPnl.toFixed(2)}</Text>
            </TouchableOpacity>

            {/* Bottom Sheet (Modal) */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
               <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
        <View style={styles.modalRow}>
            <Text  >Total Current Value:</Text>
            <Text style={styles.modalText}>₹{totalCurrentValue.toFixed(2)}</Text>
        </View>

        <View style={styles.modalRow}>
            <Text  >Total Investment:</Text>
            <Text style={styles.modalText}>₹{totalInvestment.toFixed(2)}</Text>
        </View>

        <View style={styles.modalRow}>
            <Text >Today's P&L:</Text>
            <Text style={[styles.modalText, { color: todayPnl >= 0 ? 'green' : 'red' }]}>
                ₹{todayPnl.toFixed(2)}
            </Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
    </View>
</View>

            </Modal>

        </SafeAreaView>
    );
};

export default MyHoldings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5
    },
    headerContainer: {
        backgroundColor: '#BF40BF',
        height: HEIGHT * 0.1,
        width: "100%",
        justifyContent: 'center',
        alignItems: "center",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "white",
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    symbol: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
    },
    grayText: {
        color: "gray",
    },
    pnlText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: '#BF40BF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        // Dim the background
    },
    modalContent: {
        backgroundColor: 'lightgray',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        alignSelf: 'center',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensures text & value are spaced evenly
        alignItems: 'center',
        marginVertical: 5,
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#BF40BF',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
