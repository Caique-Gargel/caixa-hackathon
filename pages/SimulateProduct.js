import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  Platform,
  Modal,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Title from '../components/Title';
import SubmitButton from '../components/SubmitButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SimulateProduct({ isFocused }) {
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [valorEmprestimo, setValorEmprestimo] = useState('');
  const [numMeses, setNumMeses] = useState('');
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [resultadoSimulacao, setResultadoSimulacao] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
        style={styles.header}
        activeOpacity={0.7}
      >
        <Text style={styles.productName}>MÊS: {item.mes}</Text>
        <Text style={styles.expandIcon}>{expandedIndex === index ? '-' : '+'}</Text>
      </TouchableOpacity>
      {expandedIndex === index && (
        <View style={styles.details}>
          <Text style={styles.detailText}>Juros: {item.juros}%</Text>
          <Text style={styles.detailText}>Amortizacao: R$ {item.amortizacao} </Text>
          <Text style={styles.detailText}>Saldo: R$ {item.saldo} </Text>
        </View>
      )}
    </View>
  );

  const fetchData = () => {
    setLoading(true);
    axios
      .get('https://backend-hackthon.vercel.app/produtos')
      .then((response) => {
        setProdutos(response.data);
        if (response.data.length > 0) {
          setProdutoSelecionado(response.data[0].nome);
        }
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível carregar os produtos.');
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const produto = produtos.find((p) => p.nome === produtoSelecionado);

  const formatarValor = (valor) => {
    let clean = valor.replace(/\D/g, '');
    if (!clean) return '';
    while (clean.length < 3) clean = '0' + clean;
    let reais = clean.slice(0, -2).replace(/^0+(?!$)/, '');
    let cents = clean.slice(-2);
    reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return reais + ',' + cents;
  };

  const valorParaDouble = (valor) => {
    if (!valor) return 0;
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
  };

  const validarMeses = (valor) => {
    const regex = /^\d{0,3}$/;
    return regex.test(valor);
  };

  const handleSubmit = async () => {
    if (!produtoSelecionado) {
      Alert.alert('Erro', 'Selecione um produto.');
      return;
    }
    if (!valorEmprestimo || isNaN(valorParaDouble(valorEmprestimo))) {
      Alert.alert('Erro', 'Informe um valor de empréstimo válido.');
      return;
    }
    if (!numMeses || isNaN(Number(numMeses)) || numMeses.includes('.')) {
      Alert.alert('Erro', 'Informe um número de meses válido.');
      return;
    }
    if (produto && Number(numMeses) > produto.prazo_maximo_meses) {
      Alert.alert(
        'Erro',
        `O número de meses não pode ser maior que ${produto.prazo_maximo_meses}.`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://backend-hackthon.vercel.app/simulacoes', {
        produto: produtoSelecionado,
        valor_emprestimo: valorParaDouble(valorEmprestimo),
        numero_meses: Number(numMeses),
      });

      setResultadoSimulacao(response.data);
      setModalVisible(true);
    } catch (error) {
      //Alert.alert('Erro ao simular', error?.response?.data?.message || error.message);
      console.log( error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title TitleText="Simular Produto" />
      <View style={styles.container}>
        <Text style={styles.label}>Selecione um produto</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={produtoSelecionado}
            onValueChange={setProdutoSelecionado}
            style={Platform.OS === 'ios' ? styles.pickerIOS : styles.picker}
          >
            {produtos.map((p, idx) => (
              <Picker.Item key={idx} label={p.nome} value={p.nome} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Valor do empréstimo</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          value={valorEmprestimo}
          onChangeText={(valor) => setValorEmprestimo(formatarValor(valor))}
          keyboardType="numeric"
          maxLength={16}
        />

        <Text style={styles.label}>Número de meses</Text>
        <TextInput
          style={styles.input}
          placeholder={`Máximo: ${produto?.prazo_maximo_meses || ''}`}
          value={numMeses}
          onChangeText={(valor) => {
            if (validarMeses(valor)) setNumMeses(valor);
          }}
          keyboardType="numeric"
          maxLength={3}
        />

        <SubmitButton
          onPress={handleSubmit}
          Text={loading ? 'Simulando...' : 'Simular'}
          disabled={loading}
        />
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resultado da Simulação</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 10, }}>
              {resultadoSimulacao && (
                <>
                  <Text style={styles.modalTextTitle}>Produto: {resultadoSimulacao.produto}</Text>
                  <Text style={styles.modalText}>
                    Valor solicitado: R$ {resultadoSimulacao.valor_solicitado.toFixed(2)}
                  </Text>
                  <Text style={styles.modalText}>
                    Prazo: {resultadoSimulacao.prazo_meses} meses
                  </Text>
                  <Text style={styles.modalText}>
                    Taxa efetiva mensal: {resultadoSimulacao.taxa_efetiva_mensal}%
                  </Text>
                  <Text style={styles.modalText}>
                    Parcela mensal: R$ {resultadoSimulacao.parcela_mensal.toFixed(2)}
                  </Text>
                  <Text style={styles.modalText}>
                    Valor total com juros: R$ {resultadoSimulacao.valor_total_com_juros.toFixed(2)}
                  </Text>

                  <Text style={[styles.modalText, { marginTop: 10, fontWeight: 'bold' }]}>
                    Memória de Cálculo:
                  </Text>
                 
                  <FlatList
                    data={resultadoSimulacao.memoria_de_calculo}
                    renderItem={renderItem}
                    keyExtractor={(_, idx) => idx.toString()}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Nenhum produto encontrado.</Text>}
                  />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F6',
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 16,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    marginTop: 12,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#6ab2bfff',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  pickerIOS: {
    width: '100%',
    height: 120,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    borderColor: '#6ab2bfff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '95%',
    maxHeight: '85%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    alignItems:'center',
    fontSize: 20,
    marginTop: 4,
  },
  modalTextTitle: {
    alignItems:'center',
    fontSize: 25,
    marginTop: 4,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#005CA9',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  }, header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  expandIcon: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    backgroundColor: '#D0E0E3',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});
