import React from "react";
import UsuarioService from "../app/service/usuarioService";
import LocalStorageService from "../app/service/localStorageService";
import { AuthContext } from "../main/provedorAutenticacao";

class Home extends React.Component {
    state = {
        saldo: 0
    }

    constructor() {
        super();
        this.usuarioService = new UsuarioService();
    }

    componentDidMount(){
        //const usuarioLogadoString = localStorage.getItem('_usuario_logado')
        //const usuarioLogadoObjeto = JSON.parse(usuarioLogadoString)
        //const usuarioLogadoObjeto = LocalStorageService.obterItem('_usuario_logado'); 
        const usuarioLogadoObjeto = this.context.usuarioAutenticado;
        console.log(usuarioLogadoObjeto)

        //console.log('usuario logado do local storage: ', usuarioLogadoObjeto)

        //axios.get(`http://localhost:8080/api/usuarios/${usuarioLogadoObjeto.id}/saldo`)
        //    .then(response => {
        //        this.setState({saldo: response.data})
        //    }).catch(erro => {
        //        console.error(erro.response)
        //    });

        this.usuarioService
            .obterSaldoPorUsuario(usuarioLogadoObjeto.id)
            .then(response => {
                this.setState({saldo: response.data})
            }).catch(erro => {
                console.error(erro.response)
            });

    }

    render() {
        return (
            <div className="jumbotron">
                <h1 className="display-3">Bem vindo!</h1>
                <p className="lead">Esse é seu sistema de finanças.</p>
                <p className="lead">Seu saldo para o mês atual é de R$ {this.state.saldo}</p>
                <hr className="my-4"/>
                <p>E essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema.</p>
                <p className="lead">
                    <a className="btn btn-primary btn-lg" 
                        href="#/cadastro-usuarios" 
                        role="button"><i className="fa fa-users"></i>  
                        <i className="pi pi-users"></i>Cadastrar Usuário</a>
                    <a className="btn btn-danger btn-lg" 
                        href="#/cadastro-lancamentos" 
                        role="button"><i className="fa fa-users"></i>  
                        <i className="pi pi-money-bill"></i>Cadastrar Lançamento</a>
                </p>
            </div>
        
        )
    }
}

Home.contextType = AuthContext;

export default Home