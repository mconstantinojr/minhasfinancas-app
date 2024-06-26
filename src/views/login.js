import React from "react";
import Card from '../components/card'
import FormGroup from "../components/form-group"
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import UsuarioService from "../app/service/usuarioService";
import LocalStorageService from "../app/service/localStorageService";
import { mensagemErro } from "../components/toastr";
import { AuthContext } from "../main/provedorAutenticacao";



class Login extends React.Component{

    state = {
        email: '',
        senha: ''
        //,
        //mensagemErro: null
    }

    constructor() {
        super();
        this.service = new UsuarioService();
    }

    entrar = () => {
        this.service.autenticar({
            email: this.state.email,
            senha: this.state.senha,
        }).then( response => {
            //console.log(response)
            LocalStorageService.adicionarItem('_usuario_logado', response.data);
            this.context.iniciarSessao(response.data);
            //localStorage.setItem('_usuario_logado', JSON.stringify(response.data))
            this.props.history.push("/home")
        }).catch( erro => {
            //this.setState({mensagemErro: erro.response.data})
            mensagemErro(erro.response.data)
        })
    }

    entrarAssinc = async () => {
        //requisicao assincrona
        //primeiro executa o post
        //depois executar o retorno da proxy
        //console.log('Email: ', this.state.email)
        //console.log('Senha: ', this.state.senha)
        try {
            const response = await axios
            .post('http://localhost:8080/api/usuarios/autenticar',
            {
                email: this.state.email,
                senha: this.state.senha,
                mensagemErro: null   
            })    
            console.log('resposta:', response)
            console.log('requisicao encerrada')
            this.props.history.push("/home")
        } catch (erro) {
            console.log(erro.response)
            //this.setState({mensagemErro: erro.response.data})
        }

    }

    entrar1 = () => {
        //requisicao assincrona
        //primeiro executa o post
        //depois executar o retorno da proxy
        //console.log('Email: ', this.state.email)
        //console.log('Senha: ', this.state.senha)
        axios
            .post('http://localhost:8080/api/usuarios/autenticar',
        {
            email: this.state.email,
            senha: this.state.senha,
            mensagemErro: null   
        }).then( response => {
            //console.log(response)
            localStorage.setItem('_usuario_logado', JSON.stringify(response.data))
            this.props.history.push("/home")
        }).catch( erro => {
            //console.log(erro.response)
            //console.log('entrou no erro')
            //this.setState({mensagemErro: erro.response.data})
        })
        //console.log('executado a requisição')
    }

    prepareCadastrar = () => {
        this.props.history.push("/cadastro-usuarios")
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6" style={{position : 'relative', left: '300px'}}>
                    <div className="bs-docs-section">
                        <Card title="Login">
                          {/*<div className="row">
                                  <span>{this.state.mensagemErro}</span>
                           </div>*/}
                           <div className="row">
                           <div className="col-lg-12">
                                <div className="bs-component">
                                    <fieldset>
                                        <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                            <input value={this.state.email}
                                            onChange={e => this.setState({email: e.target.value})}
                                            type="email"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            placeholder="Digite o Email"/>
                                        </FormGroup>
                                        <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                            <input value={this.state.senha}
                                            onChange={e => this.setState({senha: e.target.value})}
                                                type="password"
                                                   className="form-control"
                                                   id="exampleInputPassword1"
                                                   placeholder="Password"/>
                                        </FormGroup>
                                        <br></br>
                                        <button onClick={this.entrar} className="btn btn-success">
                                        <i className="pi pi-sign-in"></i>Entrar
                                        </button>
                                        <button onClick={this.prepareCadastrar} className="btn btn-danger">
                                        <i className="pi pi-plus"></i>Cadastrar
                                        </button>
                                    </fieldset>
                                </div>
                           </div>
                           </div>   
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

Login.contextType = AuthContext

export default withRouter(Login);