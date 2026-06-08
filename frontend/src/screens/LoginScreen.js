import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image,
    ActivityIndicator
} from 'react-native';
import { theme } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        setErrorMsg('');
        const mail = email.trim();
        const pass = password.trim();

        if (!mail || !pass) {
            setErrorMsg('Preencha todos os campos.');
            return;
        }

        // Atalho para o demandante (teste rápido)
        if (mail === '1' && pass === '1') {
            navigation.navigate('Demander');
            return;
        }

        // Atalho para o técnico
        if (mail === '2' && pass === '2') {
            navigation.navigate('Technician');
            return;
        }

        setIsSubmitting(true);
        const result = await login(mail, pass);
        setIsSubmitting(false);

        if (result.success) {
            navigation.navigate('Demander');
        } else {
            setErrorMsg(result.message);
        }
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
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Error feedback */}
                    {errorMsg ? (
                        <View style={styles.errorContainer}>
                            <Feather name="alert-circle" size={16} color="#EB5757" />
                            <Text style={styles.errorText}>{errorMsg}</Text>
                        </View>
                    ) : null}

                    <View style={styles.form}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Usuário / E-mail</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedField === 'email' && styles.inputFocused,
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="nome@email.com"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={email}
                                    onChangeText={(t) => { setEmail(t); setErrorMsg(''); }}
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
                                    placeholder="Sua senha"
                                    placeholderTextColor={theme.colors.textMuted}
                                    value={password}
                                    onChangeText={(t) => { setPassword(t); setErrorMsg(''); }}
                                    secureTextEntry
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, isSubmitting && styles.buttonDisabled]}
                            activeOpacity={0.85}
                            onPress={handleLogin}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Entrar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Ainda não tem conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.6}>
                            <Text style={styles.footerLink}> Criar conta</Text>
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
        alignItems: 'center',
        marginBottom: 36,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
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
        marginTop: 6,
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


    form: {
        marginBottom: 24,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: 8,
    },
    forgotText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 13,
        color: theme.colors.accent,
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


    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: theme.colors.textMuted,
        paddingHorizontal: 16,
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
});
