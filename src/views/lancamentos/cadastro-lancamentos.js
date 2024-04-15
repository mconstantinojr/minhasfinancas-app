import React from "react";

import { withRouter } from 'react-router-dom'
import * as messages from '../../components/toastr'

import Card from '../../components/card'
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";

import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from '../../app/service/localStorageService';

class CadastroLancamentos extends React.Component {
    state = {
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }
    
    constructor() {
        super();
        this.service = new LancamentoService();
    }

    componentDidMount() {
        //executado depois do render
        const params = this.props.match.params;
        console.log('params', params);
        if (params.id) {
            console.log('id', params.id);
            this.service
                .obterPorId(params.id)
                .then(response => {
                    //this.setState({...response.data})
                    console.log(response.data)
                    this.setState({...response.data, atualizando: true})
                })
                .catch(erros => {
                    messages.mensagemErro(erros.response.data)
                })
        }
        
    }

    atualizar = () => {

        const { descricao, valor, mes, ano, tipo, status, usuario, id } = this.state;

        const lancamento = { descricao, valor, mes, ano, tipo, status, usuario, id };


        this.service
            .atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento atualizado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
    }

    submit = () => {

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        console.log(this.state);

        const { descricao, valor, mes, ano, tipo } = this.state;

        const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id };

        try {
            this.service.validar(lancamento)
        } catch(erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg));
            return false;
        }

        

        this.service
            .salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento cadastrado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })


    }
    
    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({[name] : value})
    }

    render() {
        const tipos = this.service.obterListaTipos();
        const meses = this.service.obterListaMeses();

        return (
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id='inputDescricao' label="Descrição: *">
                            <input id='inputDescricao' 
                                name="descricao"
                                type="text" 
                                className="form-control"
                                value={this.state.descricao}
                                onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno" 
                                name="ano"
                                type="text" 
                                value={this.state.ano}
                                className="form-control"
                                onChange={this.handleChange}
                                />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" 
                                value={this.state.mes}
                                name="mes"
                                onChange={this.handleChange}
                                lista={meses} className="form-control"/> 
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor" 
                                name="valor"
                                type="text" 
                                className="form-control"
                                value={this.state.valor}
                                onChange={this.handleChange}
                                />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" 
                                value={this.state.tipo}
                                name="tipo"
                                onChange={this.handleChange}
                                lista={tipos}
                                className="form-control" />
                        </FormGroup>
                    </div>

                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status: *">
                            <input id="inputStatus" 
                                value={this.state.status}
                                name="mstatus"
                                onChange={this.handleChange}
                                type="text" 
                                className="form-control" 
                                disabled={true}/>
                        </FormGroup>
                    </div>


                </div>
                <div className="row">
                    <div className="col-md-6">
                        {
                            this.state.atualizando ?
                            (
                                <button onClick={this.atualizar} className="btn btn-primary">
                                        <i className="pi pi-refresh"></i>Atualizar</button>
                            ) : (
                                <button onClick={this.submit} className="btn btn-success">
                                    <i className="pi pi-save"></i>Salvar</button>
                            )
                        }
                        <button onClick={e => this.props.history.push('/consulta-lancamentos')} 
                            className="btn btn-danger">
                                <i className="pi pi-times"></i>Cancelar</button>
                    </div>

                </div>
            </Card>
        )        
    }
}

export default withRouter(CadastroLancamentos);