import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

type Produto = {
  _id?: string,
  nome: string,
  preco: number,
}

const API_URL = 'http://localhost:3000'

export default function App() {
  // Inicializando a state 'tarefas' com o valor [ "Tarefa 1", "Tarefa 2" ]
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');

  useEffect(() => {
    getProdutos();
  }, [])

  const getProdutos = async () => {
    try {
      const resposta = await axios.get(`${API_URL}/produtos`);
      const listaDeProdutos: Produto[] = [];
      
      for(let i = 0; i < resposta.data.length; i++)
        listaDeProdutos.push({
          _id: resposta.data[i]._id,
          nome: resposta.data[i].nome,
          preco: resposta.data[i].preco,
        })

      setProdutos(listaDeProdutos);

    } catch (error) {
      console.error("Erro no GET do /produtos", error);
    }
  }


  // Função que adicionar produto
  const addProduto = async () => {
    try {
      const novoProduto = {
        nome: nomeProduto,
        preco: precoProduto
      }

      const resposta = await axios.post(`${API_URL}/produto`, novoProduto);
      await getProdutos();
      setNomeProduto('');
      setPrecoProduto('');

    } catch (error) {
      console.log('Erro no Post do /produto', error);
      
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <TextInput 
          style={styles.input} 
          value={nomeProduto} 
          placeholder="Digite o nome" 
          onChangeText={setNomeProduto}>
        </TextInput>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric"
          value={precoProduto} 
          placeholder="Digite o preço" 
          onChangeText={setPrecoProduto}>
        </TextInput>

        <TouchableOpacity style={styles.button} onPress={addProduto}>
          <Text style={{ color: 'white' }}>Add</Text>
        </TouchableOpacity>
      </View>


      {produtos.length > 0 && 
      <FlashList
        data={produtos}
        estimatedItemSize={20}
        renderItem={({ item }) => 
          <View style={styles.item} >
            <Text>{item.nome} - R${item.preco}</Text>
            <View style={styles.linha}>
              <TouchableOpacity style={styles.btnEditar} > 
                <MaterialIcons name="edit-square" size={22} /> 
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnRemover}> 
                <MaterialIcons name="remove-circle-outline" size={22} /> 
              </TouchableOpacity>
            </View>
          </View>
        }
      />}
      {produtos.length === 0 && <Text>Sem produtos cadastrados!</Text> }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#8aff86',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '60%',
    padding: 5
  },
  button: {
    backgroundColor: 'blue',
    width: 50,
    padding: 10,
    borderRadius: 5,
    alignContent: 'center'
  },
  btnEditar: {
    backgroundColor: 'orange',
    width: 40,
    padding: 10,
    borderRadius: 5,
    alignContent: 'center'
  },
  btnRemover: {
    backgroundColor: 'red',
    width: 40,
    padding: 10,
    borderRadius: 5,
    alignContent: 'center'
  },
  linha: {
    flexDirection: 'row',
    gap: 15,
  }
});