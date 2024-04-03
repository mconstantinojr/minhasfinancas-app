import React from 'react';

class App extends React.Component {
  state = {
    nome : '',
    numero1 : null,
    numero2 : null,
    resultado : null
  }

  render() {
    return(
      <div>
          {/*Hello {this.state.nome}*/}
          <label>Nome:</label>
          <input type='text' value={this.state.nome} onChange={(e) => this.setState({nome: e.target.value})}></input>
          <br/>
          <label>Primeiro numero:</label>
          <input type='text' value={this.state.numero1} onChange={(e) => this.setState({numero1: e.target.value})}></input>
          <br/>
          <label>Segundo numero:</label>
          <input type='text' value={this.state.numero2} onChange={(e) => this.setState({numero2: e.target.value})}></input>
          <br/>
          <button onClick={() => this.setState({resultado: parseInt(this.state.numero1) + parseInt(this.state.numero2)})}>Somar</button>
          <br/>

          O nome digitado foi: {this.state.nome}
          <br/>
          O resultado é: {this.state.resultado}
      </div>
    )  
  }
}

export default App;
