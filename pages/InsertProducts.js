import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, Button, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import SubmitButton from '../components/SubmitButton';
import Title from '../components/Title';
import axios from 'axios'
export default function InsertProducts() {
    const [nome, setNome] = useState('');
    const [taxa, setTaxa] = useState('');
    const [prazo, setPrazo] = useState('');



    const validarPrazo = (valor) => {
        // Permite apenas números inteiros positivos
        const regex = /^\d*$/;
        return regex.test(valor);
    };

    const handleSubmit = async () => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'Informe o nome do produto.');
            return;
        }
        if (!taxa || isNaN(Number(taxa.replace(/\./g, '').replace('%', '').replace(',', '.')))) {
            Alert.alert('Erro', 'Informe uma taxa de juros anual válida.');
            return;
        }
        if (!prazo || isNaN(Number(prazo)) || prazo.includes('.')) {
            Alert.alert('Erro', 'Informe um prazo máximo válido (apenas números inteiros).');
            return;
        }

        // Tratamento dos dados antes do envio
        const nomeTratado = nome.trim();
        const prazoTratado = parseInt(prazo, 10);
        const taxaTratada = parseFloat(
            taxa
                .replace(/\./g, '') // remove pontos
                .replace(/%/g, '') // remove %
                .replace(',', '.') // troca vírgula por ponto
        );

        try {
            console.log('Enviando dados:', {
                nome: nomeTratado,
                taxa_juros_anual: taxaTratada,
                prazo_maximo_meses: prazoTratado,
            });
            await axios.post('https://backend-hackthon.vercel.app/produtos', {
                nome: nomeTratado,
                taxa_juros_anual: taxaTratada,
                prazo_maximo_meses: prazoTratado,
            });
            Alert.alert('Sucesso', 'Produto cadastrado!');
            setNome('');
            setTaxa('');
            setPrazo('');
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
        }
    };
    const handleTaxaBlur = () => {
        if (taxa && !taxa.endsWith('%')) {
            setTaxa(taxa + '%');
        }
    };
    // ...existing code...
    const formatarValor = (valor) => {
        // Remove tudo que não é número
        let clean = valor.replace(/\D/g, '');
        if (!clean) return '';
        // Adiciona zeros à esquerda para garantir pelo menos 3 dígitos
        while (clean.length < 3) clean = '0' + clean;
        // Remove zeros à esquerda dos reais, mas mantém pelo menos um zero

        let reais = clean.slice(0, -2).replace(/^0+(?!$)/, '');
        let cents = clean.slice(-2);
        // Adiciona pontos a cada 3 dígitos dos reais
        reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return reais + ',' + cents;
    };
    // ...existing code...

    // Remove % ao focar para facilitar edição
    const handleTaxaFocus = () => {
        if (taxa.endsWith('%')) {
            setTaxa(taxa.replace('%', ''));
        }
    };

    return (
        <>
            <Title TitleText="Cadastrar Novo Produto" />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >

                <Text style={styles.label}>Nome do produto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ex: Crédito Consignado"
                    value={nome}
                    onChangeText={setNome}
                    maxLength={50}
                />
                <Text style={styles.label}>Taxa de juros anual (%)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ex: 12,5%"
                    value={taxa}
                    onChangeText={valor => {
                        setTaxa(formatarValor(valor));
                        // Permite apenas números e até duas casas decimais (sem %)
                        /*let clean = valor.replace('%', '');
                        if (validarTaxa(clean)) setTaxa(clean);*/
                    }}
                    keyboardType="numeric"
                    maxLength={9}
                    onBlur={handleTaxaBlur}
                    onFocus={handleTaxaFocus}
                />
                <Text style={styles.label}>Prazo máximo (em meses)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ex: 36"
                    value={prazo}
                    onChangeText={valor => {
                        if (validarPrazo(valor)) setPrazo(valor);
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                />
                <SubmitButton onPress={handleSubmit} Text="Cadastrar" />
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F4F4F6',
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        alignItems: 'center',
        flexDirection: 'column',
        padding: 16,
    },
    title: {
        paddingTop: 20,
        color: '#005CA9',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 28,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#fff',
        width: '100%',
        borderColor: '#6ab2bfff',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
});
/*import { View,Text, StyleSheet,StatusBar } from 'react-native';
export default function InsertProducts() {
  return (
    <View style={styles.container}><Text>InsertProducts</Text></View>
  );
}
const styles = StyleSheet.create({
  container: {
   
    flex:1,
    paddingTop:  StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 16,
  },
  
});*/