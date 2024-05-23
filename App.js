  import * as React from 'react';
  import { TextInput, Text, View, Button, StyleSheet, TouchableOpacity, ImageBackground,FlatList } from 'react-native';
  import { NavigationContainer } from '@react-navigation/native';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import { MaterialCommunityIcons } from '@expo/vector-icons';
  import { createStackNavigator } from '@react-navigation/stack';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import firebase from './config/config';
  import { Vibration } from 'react-native';

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  class Principal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        usuario: '',
        senha: ''
      };
    }

 render() {
      return (
        <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
          <View style={estilos.container}>
            <Text style={estilos.texto}>Login:</Text>
            <TextInput
              style={estilos.caixa}
              onChangeText={(texto) => this.setState({ usuario: texto })}
              placeholder="            Usuário             " 
              placeholderTextColor="#38B6FF"
            />
            <Text style={estilos.texto}>Senha:</Text>
            <TextInput
              style={estilos.caixa}
              onChangeText={(texto) => this.setState({ senha: texto })}
              secureTextEntry={true}
              placeholder="            Senha                "
              placeholderTextColor="#38B6FF"
            />
            <Button title=" Login " onPress={() => this.ler()} color="red" />
          </View>
        </ImageBackground>
      );
    }

    async ler() {
      try {
        const senha = await AsyncStorage.getItem(this.state.usuario);
        if (senha !== null) {
          if (senha === this.state.senha) {
            this.props.navigation.navigate('Pedidos');
          } else {
            alert('Senha Incorreta!');
          }
        } else {
          alert('Usuário não encontrado!');
        }
      } catch (erro) {
        console.log(erro);
      }
    }
  }

  class SalvarItens extends React.Component {
  salvar(pedido, quantidade) {
    firebase.database().ref('/pedidos').push({
      pedidos: pedido,
      quantidade: quantidade,
    }).then(() => {
      Alert.alert("Salvo com sucesso");
      
    }).catch((error) => {
      Alert.alert("Erro ao salvar: " + error.message);
    });
  }
}
class RemoverItens extends React.Component {
  remover(chaveDoPedido) {
    firebase.database().ref(`/pedidos/${chaveDoPedido}`).remove()
      .then(() => {
        Alert.alert("Removido com sucesso");
      })
      .catch((error) => {
        Alert.alert("Erro ao remover: " + error.message);
      });
  }
}

class ListarItens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pedidos: []
    };
  }

  componentDidMount() {
    firebase.database().ref("pedidos").on('value', snapshot => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        let pedidos = Object.values(data);
        console.log("Dados recuperados:", pedidos); 
        this.setState({ pedidos });
      } else {
        console.log("Nenhum dado encontrado"); 
      }
    }, error => {
      console.error("Erro ao buscar os dados:", error); 
    });
  }

  clique(){
    db.ref('/pedidos').orderByChild("marca").equalTo(this.state.buscar).on('val'.once('value',snapshot =>{
      snapshot.forEach((child) =>{
        console.log(child.key)
        db.ref('/pedidos').child(child.key)
        console.log("removido");
      })
    }))
  }

  
  render() {
    return (
      <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
        <View style={estilos.container}>
          {this.state.pedidos.length > 0 ? 
            <FlatList
              data={this.state.pedidos}
              renderItem={({ item }) => (
                <View style={estilos.pedidoContainer}>
                  <Text style={estilos.textoPedido}>Pedido: {item.pedidos}</Text>
                  <Text style={estilos.textoQuantidade}>Quantidade: {item.quantidade}</Text>
                </View>
              )}
            /> 
            : 
            null 
          }
        </View>
      </ImageBackground>
    );
  }
}

  class Cadastro extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: '',
        password: ''
      };
    }

    async gravar() {
      try {
        await AsyncStorage.setItem(this.state.user, this.state.password);
        alert('Salvo com sucesso!!!');
      } catch (erro) {
        alert('Erro!');
      }
    }

    render() {
      return (
        <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
          <View style={estilos.container}>
            <Text style={estilos.texto}>Cadastrar usuário:</Text>
            <TextInput
              style={estilos.caixa}
              onChangeText={(texto) => this.setState({ user: texto })}
              placeholder="          Novo usuário          "
              placeholderTextColor="#38B6FF"
            />
            <Text style={estilos.texto}>Cadastrar senha:</Text>
            <TextInput
              style={estilos.caixa}
              onChangeText={(texto) => this.setState({ password: texto })}
              secureTextEntry={true}
              placeholder="         Nova senha             "
              placeholderTextColor="#38B6FF"
            />
            <Button title="   Cadastrar   " onPress={() => this.gravar()} color="red" />
          </View>
        </ImageBackground>
      );
    }
  }

  class Nav2 extends React.Component {   
    render() {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Principal} />
          <Stack.Screen name="Pedidos" component={Pedidos} />
          <Stack.Screen name="Lanches" component={Lanches} />
          <Stack.Screen name="Porções" component={Porções} />
          <Stack.Screen name="Pasteis" component={Pasteis} />
          <Stack.Screen name="Bebidas" component={Bebidas} />
          <Stack.Screen name="Salgados" component={Salgados} />
          <Stack.Screen name="SalvarItens" component ={SalvarItens}/>
          <Stack.Screen name="RemoverItens" component ={RemoverItens}/>
        </Stack.Navigator>
      );
    }
  }
  class Salgados extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      pedidos: {
        'Hamburgão': 0,
        'Bauru': 0,
        'Esfiha': 0,
        'Empadinha': 0,
        'Pão de Queijo': 0,
        'Coxinha': 0,
        'Kibe': 0,
        'Bolinho Japonês': 0,
        'Bolinho de Carne': 0,
      }
    };
    this.salvarItens = new SalvarItens();
  }
  handlePress(pedido) {
    Vibration.vibrate();
    this.setState(prevState => {
      const quantidade = prevState.pedidos[pedido] + 1;
      return {
        pedidos: {
          ...prevState.pedidos,
          [pedido]: quantidade
        }
      };
    }, () => {
      this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
    });
  }
  handleRemove(pedido) {
    if (this.state.pedidos[pedido] > 0) {
      this.setState(prevState => {
        const quantidade = prevState.pedidos[pedido] - 1;
        return {
          pedidos: {
            ...prevState.pedidos,
            [pedido]: quantidade
          }
        };
      }, () => {
        this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
      });
    }
  }
  render(){
    const { pedidos } = this.state;
    return (
      <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
      <View style={estilos.container}>
        <Text style={estilos.texto_sinopses}>
          Menu Salgados:
          {"\n"}1- Hamburgão <Button title={`+ (${pedidos['Hamburgão']})`} onPress={() => this.handlePress('Hamburgão')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Hamburgão')} color="red" />
          {"\n"}2- Bauru <Button title={`+ (${pedidos['Bauru']})`} onPress={() => this.handlePress('Bauru')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Bauru')} color="red" />
          {"\n"}3- Esfiha <Button title={`+ (${pedidos['Esfiha']})`} onPress={() => this.handlePress('Esfiha')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Esfiha')} color="red" />
          {"\n"}4- Empadinha <Button title={`+ (${pedidos['Empadinha']})`} onPress={() => this.handlePress('Empadinha')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Empadinha')} color="red" />
          {"\n"}5- Pão de Queijo <Button title={`+ (${pedidos['Pão de Queijo']})`} onPress={() => this.handlePress('Pão de Queijo')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Pão de Queijo')} color="red" />
          {"\n"}6- Coxinha <Button title={`+ (${pedidos['Coxinha']})`} onPress={() => this.handlePress('Coxinha')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Coxinha')} color="red" />
          {"\n"}7- Kibe <Button title={`+ (${pedidos['Kibe']})`} onPress={() => this.handlePress('Kibe')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Kibe')} color="red" />
          {"\n"}8- Bolinho Japonês <Button title={`+ (${pedidos['Bolinho Japonês']})`} onPress={() => this.handlePress('Bolinho Japonês')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Bolinho Japonês')} color="red" />
          {"\n"}9- Bolinho de Carne <Button title={`+ (${pedidos['Bolinho de Carne']})`} onPress={() => this.handlePress('Bolinho de Carne')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Bolinho de Carne')} color="red" />
        </Text>
      </View>
      </ImageBackground>
    );
  }
}


  class Bebidas extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      pedidos: {
        'Refrigerante': 0,
        'Suco': 0,
        'Água Mineral': 0,
        'Café': 0,
        'Energetico': 0,
        'Cerveja': 0,
      }
    };
    this.salvarItens = new SalvarItens();
  }
  handlePress(pedido) {
    Vibration.vibrate();
    this.setState(prevState => {
      const quantidade = prevState.pedidos[pedido] + 1;
      return {
        pedidos: {
          ...prevState.pedidos,
          [pedido]: quantidade
        }
      };
    }, () => {
      this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
    });
  }
  handleRemove(pedido) {
    if (this.state.pedidos[pedido] > 0) {
      this.setState(prevState => {
        const quantidade = prevState.pedidos[pedido] - 1;
        return {
          pedidos: {
            ...prevState.pedidos,
            [pedido]: quantidade
          }
        };
      }, () => {
        this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
      });
    }
  }
  render(){
    const { pedidos } = this.state;
    return (
       <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
      <View style={estilos.container}>
        <Text style={estilos.texto_sinopses}>
          Menu Bebidas:
          {"\n"}1- Refrigerante <Button title={`+ (${pedidos['Refrigerante']})`} onPress={() => this.handlePress('Refrigerante')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Refrigerante')} color="red" />
          {"\n"}2- Suco <Button title={`+ (${pedidos['Suco']})`} onPress={() => this.handlePress('Suco')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Suco')} color="red" />
          {"\n"}3- Água Mineral<Button title={`+ (${pedidos['Água Mineral']})`} onPress={() => this.handlePress('Água Mineral')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Água Mineral')} color="red" />
          {"\n"}4- Café <Button title={`+ (${pedidos['Café']})`} onPress={() => this.handlePress('Café')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Café')} color="red" />
          {"\n"}4- Energetico <Button title={`+ (${pedidos['Energetico']})`} onPress={() => this.handlePress('Energetico')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Energetico')} color="red" />
          {"\n"}4- Cerveja <Button title={`+ (${pedidos['Cerveja']})`} onPress={() => this.handlePress('Cerveja')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Cerveja')} color="red" />
        </Text>
      </View>
      </ImageBackground>
    );
  }
}

  class Pasteis extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      pedidos: {
        'Carne': 0,
        'Queijo': 0,
        'Calabresa': 0,
        'Frango c/Catupiry': 0,
        'Carne  c/Queijo': 0,
        'Pizza': 0,
        'Bauru': 0,
        'Carne Queijo e ovo': 0,
      }
    };
    this.salvarItens = new SalvarItens();
  }
  handlePress(pedido) {
    Vibration.vibrate();
    this.setState(prevState => {
      const quantidade = prevState.pedidos[pedido] + 1;
      return {
        pedidos: {
          ...prevState.pedidos,
          [pedido]: quantidade
        }
      };
    }, () => {
      this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
    });
  }
  handleRemove(pedido) {
    if (this.state.pedidos[pedido] > 0) {
      this.setState(prevState => {
        const quantidade = prevState.pedidos[pedido] - 1;
        return {
          pedidos: {
            ...prevState.pedidos,
            [pedido]: quantidade
          }
        };
      }, () => {
        this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
      });
    }
  }
  render(){
    const { pedidos } = this.state;
    return (
       <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
      <View style={estilos.container}>
        <Text style={estilos.texto_sinopses}>
          Menu Pasteis:
          {"\n"}1- Carne <Button title={`+ (${pedidos['Carne']})`} onPress={() => this.handlePress('Carne')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Carne')} color="red" />
          {"\n"}2- Queijo <Button title={`+ (${pedidos['Queijo']})`} onPress={() => this.handlePress('Queijo')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Queijo')} color="red" />
          {"\n"}3- Calabresa <Button title={`+ (${pedidos['Calabresa']})`} onPress={() => this.handlePress('Calabresa')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Calabresa')} color="red" />
          {"\n"}4- Frango c/Catupiry <Button title={`+ (${pedidos['Frango c/Catupiry']})`} onPress={() => this.handlePress('Frango c/Catupiry')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Frango c/Catupiry')} color="red" />
          {"\n"}5- Carne  c/Queijo <Button title={`+ (${pedidos['Carne  c/Queijo']})`} onPress={() => this.handlePress('Carne  c/Queijo')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Carne  c/Queijo')} color="red" />
          {"\n"}6- Pizza <Button title={`+ (${pedidos['Pizza']})`} onPress={() => this.handlePress('Pizza')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Pizza')} color="red" />
          {"\n"}7- Bauru <Button title={`+ (${pedidos['Bauru']})`} onPress={() => this.handlePress('Bauru')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Bauru')} color="red" />
          {"\n"}8- Carne Queijo e ovo <Button title={`+ (${pedidos['Carne Queijo e ovo']})`} onPress={() => this.handlePress('Carne Queijo e ovo')} color="red" />
          <Button title="   -   " onPress={() => this.handleRemove('Carne Queijo e ovo')} color="red" />
        </Text>
      </View>
      </ImageBackground>
    );
  }
}

  class Porções extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pedidos: {
        'Batata Frita': 0,
        'Calabresa': 0,
        'Churrasco': 0,
        'Torresmo': 0,
        'Salame': 0,
        'Queijo c/Salame': 0,
        'Batata c/Bacon': 0,
        'Pasteis': 0,
      }
    };
    this.salvarItens = new SalvarItens();
  }

  handlePress(pedido) {
    Vibration.vibrate();
    this.setState(prevState => {
      const quantidade = prevState.pedidos[pedido] + 1;
      return {
        pedidos: {
          ...prevState.pedidos,
          [pedido]: quantidade
        }
      };
    }, () => {
      this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
    });
  }
  handleRemove(pedido) {
    if (this.state.pedidos[pedido] > 0) {
      this.setState(prevState => {
        const quantidade = prevState.pedidos[pedido] - 1;
        return {
          pedidos: {
            ...prevState.pedidos,
            [pedido]: quantidade
          }
        };
      }, () => {
        this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
      });
    }
  }

  render() {
    const { pedidos } = this.state;
    return (
      <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
        <View style={estilos.container}>
          <Text style={estilos.texto_sinopses}>
            Menu Porções:
            {"\n"}1- Batata Frita <Button title={`+ (${pedidos['Batata Frita']})`} onPress={() => this.handlePress('Batata Frita')} color="red" />
            <Button title="   -   " onPress={() => this.handleRemove('Batata Frita')} color="red" />
            {"\n"}2- Calabresa <Button title={`+ (${pedidos['Calabresa']})`} onPress={() => this.handlePress('Calabresa')} color="red" />
            <Button title="   -   " onPress={() => this.handleRemove('Calabresa')} color="red" />
            {"\n"}3- Churrasco <Button title={`+ (${pedidos['Churrasco']})`} onPress={() => this.handlePress('Churrasco')} color="red" />
            <Button title="   -   " onPress={() => this.handleRemove('Churrasco')} color="red" />
            {"\n"}4- Torresmo <Button title={`+ (${pedidos['Torresmo']})`} onPress={() => this.handlePress('Torresmo')} color="red" />
            <Button title="   -   " onPress={() => this.handleRemove('Torresmo')} color="red" />
            {"\n"}5- Salame <Button title={`+ (${pedidos['Salame']})`} onPress={() => this.handlePress('Salame')} color="red" />
            <Button title="   -   " onPress={() => this.handleRemove('Salame')} color="red" />
            {"\n"}6- Queijo c/Salame <Button title={`+ (${pedidos['Queijo c/Salame']})`} onPress={() => this.handlePress('Queijo c/Salame')} color="red" />
            <Button title="   -   " onPress={() => this.handleRemove('Queijo c/Salame')} color="red" />
            {"\n"}7- Batata c/Bacon <Button title={`+ (${pedidos['Batata c/Bacon']})`} onPress={() => this.handlePress('Batata c/Bacon')} color="red" />
            <Button title="   -   " onPress={() => this.handleRemove('Batata c/Bacon')} color="red" />
            {"\n"}8- Pasteis <Button title={`+ (${pedidos['Pasteis']})`} onPress={() => this.handlePress('Pasteis')} color="red" />
            <Button title="   -   " onPress={() => this.handleRemove('Pasteis')} color="red" />
          </Text>
        </View>
      </ImageBackground>
    );
  }
}


  class Lanches extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        pedidos :{
          'X-Burguer': 0,
          'X-Salada': 0,
          'X-Bacon': 0,
          'X-Egg' : 0,
          'X-Calabrase': 0,
          'X-Tudo': 0,
          'Americano': 0,
          'Bauru':0,
          'Churrasco': 0,
          'Misto':0,
        }
      };
      this.salvarItens = new SalvarItens();
    }
    handlePress(pedido) {
      Vibration.vibrate();
    this.setState(prevState => {
      const quantidade = prevState.pedidos[pedido] + 1;
      return {
        pedidos: {
          ...prevState.pedidos,
          [pedido]: quantidade
        }
      };
    }, () => {
      this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
    });
  }
  handleRemove(pedido) {
    if (this.state.pedidos[pedido] > 0) {
      this.setState(prevState => {
        const quantidade = prevState.pedidos[pedido] - 1;
        return {
          pedidos: {
            ...prevState.pedidos,
            [pedido]: quantidade
          }
        };
      }, () => {
        this.salvarItens.salvar(pedido, this.state.pedidos[pedido]);
      });
    }
  }
  render(){
    const { pedidos } = this.state;
    return (
       <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
      <View style={estilos.container}>
        <Text style={estilos.texto_sinopses}>
          Menu Lanches:
            {"\n"}1- X-Burguer <Button title={`+ (${pedidos['X-Burguer']})`} onPress={() => this.handlePress('X-Burguer')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('X-Burguer')} color="red" />
            {"\n"}2- X-Salada  <Button  title={`+ (${pedidos['X-Salada']})`} onPress={() => this.handlePress('X-Salada')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('X-Salada')} color="red" />
            {"\n"}3- X-Bacon <Button title={`+ (${pedidos['X-Bacon']})`} onPress={() => this.handlePress('X-Bacon')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('X-Bacon')} color="red" />
            {"\n"}4- X-Egg <Button title={`+ (${pedidos['X-Egg']})`} onPress={() => this.handlePress('X-Egg')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('X-Egg')} color="red" />
            {"\n"}5- X-Calabrase <Button title={`+ (${pedidos['X-Calabrase']})`} onPress={() => this.handlePress('X-Calabrase')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('X-Calabrase')} color="red" />
            {"\n"}6- X-Tudo <Button title={`+ (${pedidos['X-Tudo']})`} onPress={() => this.handlePress('X-Tudo')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('X-Tudo')} color="red" />
            {"\n"}7- Americano <Button title={`+ (${pedidos['Americano']})`} onPress={() => this.handlePress('Americano')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('Americano')} color="red" />
            {"\n"}8- Bauru <Button title={`+ (${pedidos['Bauru']})`} onPress={() => this.handlePress('Bauru')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('Bauru')} color="red" />
            {"\n"}9- Churrasco <Button title={`+ (${pedidos['Churrasco']})`} onPress={() => this.handlePress('Churrasco')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('Churrasco')} color="red" />
            {"\n"}10- Misto <Button title={`+ (${pedidos['Misto']})`} onPress={() => this.handlePress('Misto')} color="#66ccff" />
            <Button title="   -   " onPress={() => this.handleRemove('Misto')} color="red" />
          
        </Text>
      </View>
      </ImageBackground>
    );
  }
}
 
  class Pedidos extends React.Component {
    render() {
      return (
        <ImageBackground source={require('./assets/fundo.png')} style={estilos.background}>
        <View style={estilos.container_filmes}>
          <TouchableOpacity style={estilos.botoes_pedidos} onPress={() => this.props.navigation.navigate('Lanches')}>
            <Text>Lanches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botoes_pedidos} onPress={() => this.props.navigation.navigate('Porções')}>
            <Text>Porções</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botoes_pedidos} onPress={() => this.props.navigation.navigate('Pasteis')}>
            <Text>Pasteis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botoes_pedidos} onPress={() => this.props.navigation.navigate('Bebidas')}>
            <Text>Bebidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botoes_pedidos} onPress={() => this.props.navigation.navigate('Salgados')}>
            <Text>Salgados</Text>
          </TouchableOpacity>
        </View>
        </ImageBackground>
      );
    }
  }

  class App extends React.Component {
    render() {
      return (
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Login"
              component={Nav2}
              options={{
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-account" color={color} size={size} />,
                headerShown: false
              }}
            />
            <Tab.Screen
              name="Criar Usuário"
              component={Cadastro}
              options={{
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-details" color={color} size={size} />
              }}
            />
            <Tab.Screen
            name="Carrinho"
          component={ListarItens}
          options={{
            tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
            
          </Tab.Navigator>
          
        </NavigationContainer>
      );
    }
  }
  

 const estilos = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center'
  },
  texto: {
    color: 'black',
    fontSize: 17,
    marginBottom: 10,
  },
  caixa: {
    padding: 10,
    borderColor: '#38B6FF',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    borderRadius: 50,
    width: '150%',
    backgroundColor: 'black',
    color: 'white'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  container_filmes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginTop: 150,
  },
  botoes_pedidos: {
    alignItems: 'center',
    backgroundColor: '#ffff00',
    padding: 25, 
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 50,
    width: '200%',
    marginTop: 20 
  },
  texto_sinopses: {
    marginTop:50,
    color: 'white', 
    fontSize: 25,
    textAlign: 'flex-end',
    marginLeft: 20,
  },
  pedidoContainer: {
    backgroundColor: 'rgba(0, 255, 255, 0.5)',
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
    marginTop: 30,
  },
  textoPedido: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  textoQuantidade: {
    fontSize: 16
  },
  
});
  



export default App;
