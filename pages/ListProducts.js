import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import Title from '../components/Title';
import axios from 'axios';

export default function ListProducts({ isFocused }) {
  const [produtos, setProdutos] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    axios.get('https://backend-hackthon.vercel.app/produtos')
      .then(response => {
        setProdutos(response.data);
      })
      .catch(error => {
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

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
        style={styles.header}
        activeOpacity={0.7}
      >
        <Text style={styles.productName}>{item.nome}</Text>
        <Text style={styles.expandIcon}>{expandedIndex === index ? '-' : '+'}</Text>
      </TouchableOpacity>
      {expandedIndex === index && (
        <View style={styles.details}>
          <Text style={styles.detailText}>Taxa de juros anual: {item.taxa_juros_anual}%</Text>
          <Text style={styles.detailText}>Prazo máximo: {item.prazo_maximo_meses} meses</Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Title TitleText="Produtos Cadastrados" />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#005CA9" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={produtos}
            renderItem={renderItem}
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={{ paddingVertical: 16 }}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Nenhum produto encontrado.</Text>}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F6',
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#005CA9',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  header: {
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
  title: {
    paddingTop: 20,
    textAlign: 'center',
    color: '#005CA9',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
