import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, FlatList, useWindowDimensions
} from 'react-native';
import { theme } from '../theme/colors';
import { useDemands } from '../context/DemandContext';
import { useAuth } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const STORES = [
    { id: 'id1', name: 'Loja 04 Santa Efigênia' },
    { id: 'id2', name: 'Loja 07 Buritis' },
    { id: 'id3', name: 'Loja 10 Belvedere' },
    { id: 'id4', name: 'Loja 12 Tupis' },
    { id: 'id5', name: 'Loja 13 Anchieta' },
    { id: 'id6', name: 'Loja 17 Savassi' },
    { id: 'id7', name: 'Loja 18 Floresta' },
    { id: 'id8', name: 'Loja 19 Assembleia' },
    { id: 'id9', name: 'Loja 20 Prudente' },
    { id: 'id10', name: 'Loja 21 Mangabeiras' },
];

export default function DemanderScreen({ navigation }) {
    const { demands, addDemand, deleteDemand, editDemand } = useDemands();
    const { currentUser, logout } = useAuth();
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 768;
    const [selectedStore, setSelectedStore] = useState('');
    const [description, setDescription] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [editingDemandId, setEditingDemandId] = useState(null);

    const userName = currentUser?.name || 'Usuário';

    const handleSaveDemand = () => {
        if (!selectedStore || !description.trim()) return;

        const store = STORES.find(s => s.id === selectedStore);

        if (editingDemandId) {
            editDemand(editingDemandId, store.name, description);
            setEditingDemandId(null);
        } else {
            const newDemand = {
                id: Math.random().toString().substring(2, 6),
                storeName: store.name,
                info: description,
                demanderName: userName,
                status: 'recebido',
                time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`
            };
            addDemand(newDemand);
        }

        setDescription('');
        setSelectedStore('');
    };

    const handleEditStart = (demand) => {
        const store = STORES.find(s => s.name === demand.storeName);
        if (store) setSelectedStore(store.id);
        setDescription(demand.info);
        setEditingDemandId(demand.id);
    };

    const handleCancelEdit = () => {
        setEditingDemandId(null);
        setDescription('');
        setSelectedStore('');
    };

    const handleLogout = () => {
        logout();
        navigation?.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    const renderStoreChip = ({ item }) => {
        const isSelected = selectedStore === item.id;
        return (
            <TouchableOpacity
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedStore(isSelected ? '' : item.id)}
                activeOpacity={0.7}
            >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderDemand = ({ item }) => (
        <View style={styles.demandCard}>
            <View style={styles.demandHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.demandStore} numberOfLines={1}>{item.storeName}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[
                        styles.badge,
                        item.status === 'recebido' ? styles.badgeRecebido :
                            item.status === 'em andamento' ? styles.badgeAndamento : styles.badgeConcluido
                    ]}>
                        <Text style={[
                            styles.badgeText,
                            item.status === 'recebido' ? styles.badgeTextRecebido :
                                item.status === 'em andamento' ? styles.badgeTextAndamento : styles.badgeTextConcluido
                        ]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                    {item.status === 'recebido' && (
                        <TouchableOpacity
                            onPress={() => handleEditStart(item)}
                            style={{ marginLeft: 12, padding: 4 }}
                            activeOpacity={0.6}
                        >
                            <Feather name="edit-2" size={18} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => deleteDemand(item.id)}
                        style={{ marginLeft: 12, padding: 4 }}
                        activeOpacity={0.6}
                    >
                        <Feather name="trash-2" size={18} color="#EB5757" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.demandInfo}>{item.info}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <Text style={styles.title} numberOfLines={2}>Olá, {userName}!</Text>
                            <Text style={styles.subtitle} numberOfLines={2}>
                                Abra um chamado para o suporte técnico
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleLogout}
                            style={styles.logoutButton}
                            activeOpacity={0.6}
                        >
                            <Feather name="log-out" size={24} color="#EB5757" />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.responsiveWrapper, isLargeScreen && styles.responsiveWrapperLarge]}>

                        <View style={styles.formContainer}>
                            <Text style={styles.sectionTitle}>Selecione a Loja</Text>
                            {isLargeScreen ? (
                                <View style={styles.chipList}>
                                    {STORES.map(item => (
                                        <React.Fragment key={item.id}>
                                            {renderStoreChip({ item })}
                                        </React.Fragment>
                                    ))}
                                </View>
                            ) : (
                                <FlatList
                                    data={STORES}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={item => item.id}
                                    renderItem={renderStoreChip}
                                    contentContainerStyle={{ paddingRight: 20 }}
                                    style={{ flexGrow: 0, marginBottom: 20 }}
                                />
                            )}

                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Descrição do Problema</Text>
                                <View style={[
                                    styles.inputContainer,
                                    focusedField === 'desc' && styles.inputFocused,
                                ]}>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Ex: Ponto de rede desativado..."
                                        placeholderTextColor={theme.colors.textMuted}
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        onFocus={() => setFocusedField('desc')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </View>
                            </View>

                            {editingDemandId ? (
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            { flex: 1, marginRight: 8, marginTop: 0 },
                                            (!selectedStore || !description.trim()) && styles.buttonDisabled
                                        ]}
                                        activeOpacity={0.85}
                                        onPress={handleSaveDemand}
                                        disabled={!selectedStore || !description.trim()}
                                    >
                                        <Text style={styles.buttonText}>Atualizar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton, { flex: 1, marginLeft: 8, marginTop: 0 }]}
                                        activeOpacity={0.85}
                                        onPress={handleCancelEdit}
                                    >
                                        <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        (!selectedStore || !description.trim()) && styles.buttonDisabled
                                    ]}
                                    activeOpacity={0.85}
                                    onPress={handleSaveDemand}
                                    disabled={!selectedStore || !description.trim()}
                                >
                                    <Text style={styles.buttonText}>Registrar Chamado</Text>
                                </TouchableOpacity>
                            )}
                        </View>


                        <View style={styles.demandsSection}>
                            <Text style={styles.sectionTitle}>Meus Chamados ({demands.length})</Text>
                            {demands.map(demand => (
                                <React.Fragment key={demand.id}>
                                    {renderDemand({ item: demand })}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    responsiveWrapper: {
        width: '100%',
        alignSelf: 'center',
    },
    responsiveWrapperLarge: {
        maxWidth: 700,
    },


    header: {
        marginBottom: 32,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(235, 87, 87, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(235, 87, 87, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 26,
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },


    formContainer: {
        marginBottom: 40,
        padding: 20,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: theme.colors.text,
        marginBottom: 16,
    },
    chipList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.inputBg,
        marginRight: 12,
        marginBottom: 12,
    },
    chipSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
    },
    chipText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    chipTextSelected: {
        color: '#FFF',
    },


    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: 8,
    },
    inputContainer: {
        backgroundColor: theme.colors.inputBg,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
    },
    inputFocused: {
        borderColor: theme.colors.primaryLight,
        backgroundColor: theme.colors.background,
    },
    input: {
        fontFamily: 'Poppins_400Regular',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: theme.colors.text,
    },
    textArea: {
        height: 100,
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.m,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: theme.colors.border,
    },
    buttonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    cancelButton: {
        backgroundColor: 'rgba(235, 87, 87, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(235, 87, 87, 0.3)',
    },
    cancelButtonText: {
        color: '#EB5757',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },


    demandsSection: {
        marginTop: 10,
    },
    demandCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    demandHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    demandStore: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: theme.colors.text,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeRecebido: {
        backgroundColor: 'rgba(245, 197, 24, 0.15)',
    },
    badgeTextRecebido: {
        color: theme.colors.yellow,
    },
    badgeAndamento: {
        backgroundColor: 'rgba(74, 124, 63, 0.15)',
    },
    badgeTextAndamento: {
        color: theme.colors.primaryLight,
    },
    badgeConcluido: {
        backgroundColor: 'rgba(157, 175, 148, 0.15)',
    },
    badgeTextConcluido: {
        color: theme.colors.textSecondary,
    },
    badgeText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 11,
    },
    demandInfo: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
});
