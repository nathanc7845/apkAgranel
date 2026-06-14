import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image, FlatList, useWindowDimensions,
    Alert, ActivityIndicator
} from 'react-native';
import { theme } from '../theme/colors';
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

export default function SignupScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 768;
    const { signup } = useAuth();

    const [name, setName] = useState('');
    const [selectedStore, setSelectedStore] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const validate = () => {
        if (!name.trim()) return 'Informe seu nome.';
        if (!selectedStore) return 'Selecione a loja onde você trabalha.';
        if (!email.trim()) return 'Informe seu e-mail.';
        if (!email.includes('@')) return 'E-mail inválido.';
        if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
        return null;
    };

    const handleSignup = async () => {
        setErrorMsg('');
        setSuccessMsg('');

        const validationError = validate();
        if (validationError) {
            setErrorMsg(validationError);
            return;
        }

        setIsSubmitting(true);

        const store = STORES.find(s => s.id === selectedStore);
        const result = await signup(name, email, password, store.name);

        setIsSubmitting(false);

        if (result.success) {
            setSuccessMsg(result.message);           
            setName('');
            setEmail('');
            setPassword('');
            setSelectedStore('');
            setTimeout(() => {
                navigation.navigate('Login');
            }, 1500);
        } else {
            setErrorMsg(result.message);
        }
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

                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.6}
                        >
                            <Feather name="arrow-left" size={20} color={theme.colors.text} />
                        </TouchableOpacity>

                        <View style={styles.headerContent}>
                            <Image
                                source={require('../../assets/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <View>
                                <Text style={styles.title}>Criar conta</Text>
                                <Text style={styles.subtitle}>
                                    Cadastre-se como demandante
                                </Text>
                            </View>
                        </View>
                    </View>

                    {errorMsg ? (
                        <View style={styles.errorContainer}>
                            <Feather name="alert-circle" size={16} color="#EB5757" />
                            <Text style={styles.errorText}>{errorMsg}</Text>
                        </View>
                    ) : null}

                    {successMsg ? (
                        <View style={styles.successContainer}>
                            <Feather name="check-circle" size={16} color={theme.colors.primary} />
                            <Text style={styles.successText}>{successMsg}</Text>
                        </View>
                    ) : null}

                   
                    <View style={styles.form}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Nome completo</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'name' && styles.inputFocused,
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Seu nome"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Loja que você trabalha</Text>
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
                                    style={{ flexGrow: 0, marginTop: 4 }}
                                />
                            )}
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>E-mail</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'email' && styles.inputFocused,
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="nome@email.com"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>


                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Senha</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'password' && styles.inputFocused,
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mínimo 6 caracteres"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, isSubmitting && styles.buttonDisabled]}
                            activeOpacity={0.85}
                            onPress={handleSignup}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Cadastrar</Text>
                            )}
                        </TouchableOpacity>
                    </View>


                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Já tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.6}>
                            <Text style={styles.footerLink}>Fazer login</Text>
                        </TouchableOpacity>
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
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 40,
    },


    header: {
        marginBottom: 32,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        marginRight: 16,
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },


    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(235, 87, 87, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(235, 87, 87, 0.3)',
        borderRadius: theme.borderRadius.m,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    errorText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: '#EB5757',
        marginLeft: 10,
        flex: 1,
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(74, 124, 63, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(74, 124, 63, 0.3)',
        borderRadius: theme.borderRadius.m,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    successText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: theme.colors.primaryLight,
        marginLeft: 10,
        flex: 1,
    },


    form: {
        marginBottom: 24,
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
        backgroundColor: theme.colors.surface,
    },
    input: {
        fontFamily: 'Poppins_400Regular',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: theme.colors.text,
    },
    button: {
        backgroundColor: theme.colors.accent,
        borderRadius: theme.borderRadius.m,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },


    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    footerLink: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: theme.colors.primary,
    },
    chipList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.inputBg,
        marginRight: 10,
        marginBottom: 10,
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
});
