import * as React from 'react';
import { Text, View, Button } from 'react-native';

class PaginaLogado extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      email: ""
    }
  }

  render(){
    return(
      <View> 
        <Text style={{
          fontSize: 22,
          borderColor: 'gray',
          borderWidth: 1,
          textAlign: 'center'
        }}
        > {"Acesso a plataforma"} </Text>
        <Text> {this.props.route.params.email}</Text>
        <Text> {"Sejá bem vindo!"}</Text>
      </View>
    )
    
  }
}

export default PaginaLogado;