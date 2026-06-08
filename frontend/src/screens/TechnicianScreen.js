import React from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity,
    SafeAreaView, FlatList, useWindowDimensions
} from 'react-native';
import { theme } from '../theme/colors';
import { useDemands } from '../context/DemandContext';
import { Feather } from '@expo/vector-icons';

export default function TechnicianScreen({ navigation }) {
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 768;
    const { demands, updateDemandStatus, deleteDemand } = useDemands();

    const renderActionButtons = (item) => {
        if (item.status === 'recebido') {
            return (
                <TouchableOpacity
                    style={[styles.actionButton, styles.btnPrimary]}
                    onPress={() => updateDemandStatus(item.id, 'em andamento')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>Iniciar Serviço</Text>
                </TouchableOpacity>
            );
        }

        if (item.status === 'em andamento') {
            return (
                <TouchableOpacity
                    style={[styles.actionButton, styles.btnAccent]}
                    onPress={() => updateDemandStatus(item.id, 'concluido')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>Concluir Tarefa</Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={[styles.actionButton, styles.btnDisabled]}>
                <Text style={styles.actionButtonTextDisabled}>Tarefa Concluída</Text>
            </View>
        );
    };

    const renderDemand = ({ item }) => (
        <View style={styles.demandCard}>
            <View style={styles.demandHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.demandStore} numberOfLines={1}>{item.storeName}</Text>
                    <Text style={styles.demandId}>Chamado #{item.id}</Text>
                </View>
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
                <TouchableOpacity
                    onPress={() => deleteDemand(item.id)}
                    style={{ marginLeft: 12, padding: 4 }}
                    activeOpacity={0.6}
                >
                    <Feather name="trash-2" size={18} color="#EB5757" />
                </TouchableOpacity>
            </View>

            <Text style={styles.demandInfo}>{item.info}</Text>

            {item.demanderName ? (
                <View style={styles.demanderRow}>
                    <Feather name="user" size={13} color={theme.colors.textMuted} />
                    <Text style={styles.demanderText}>{item.demanderName}</Text>
                </View>
            ) : null}

            <View style={styles.demandFooter}>
                <Text style={styles.timeText}>Aberto em {item.time}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.actionContainer}>
                {renderActionButtons(item)}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={styles.title} numberOfLines={2}>Painel do Técnico</Text>
                    <Text style={styles.subtitle} numberOfLines={2}>Todas as Lojas</Text>
                </View>

                <TouchableOpacity
                    onPress={() => navigation?.reset({ index: 0, routes: [{ name: 'Login' }] })}
                    style={styles.logoutButton}
                    activeOpacity={0.6}
                >
                    <Feather name="log-out" size={24} color="#EB5757" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <View style={[styles.responsiveWrapper, isLargeScreen && styles.responsiveWrapperLarge]}>
                    <FlatList
                        data={demands}
                        keyExtractor={item => item.id}
                        renderItem={renderDemand}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Feather name="inbox" size={48} color={theme.colors.border} style={{ marginBottom: 16 }} />
                                <Text style={styles.emptyText}>Nenhum chamado aberto no momento.</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    responsiveWrapper: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
    },
    responsiveWrapperLarge: {
        maxWidth: 700,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
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
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: theme.colors.primary,
        marginTop: 4,
    },

    listContent: {
        padding: 24,
        flexGrow: 1,
    },
    demandCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    demandHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    demandStore: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 15,
        color: theme.colors.primary,
    },
    demandId: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 2,
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
        fontSize: 15,
        color: theme.colors.text,
        lineHeight: 22,
        marginBottom: 8,
    },
    demanderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    demanderText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: theme.colors.textMuted,
        marginLeft: 6,
    },
    demandFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 16,
    },
    actionContainer: {
        alignItems: 'center',
    },
    actionButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPrimary: {
        backgroundColor: theme.colors.primary,
    },
    btnAccent: {
        backgroundColor: theme.colors.accent,
    },
    btnDisabled: {
        backgroundColor: theme.colors.inputBg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    actionButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    actionButtonTextDisabled: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    }
});
