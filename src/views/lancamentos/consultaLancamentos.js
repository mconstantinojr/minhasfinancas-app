import React from "react";
import { withRouter } from 'react-router-dom'
import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import LancamentosTable from "./lancamentosTable";

import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localStorageService";

import * as messages from '../../components/toastr'

import {Dialog} from 'primereact/dialog'
import {Button} from 'primereact/button'


class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        //console.log(this.state)
        if(!this.state.ano) {
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório.')
            return false;
        }
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then(resposta => {
                const lista = resposta.data;
                if (lista.length < 1) {
                    messages.mensagemAlerta("Nenhum resultado encontrado!")
                }
                this.setState({lancamentos: lista})
            })
            .catch(error => {
                console.log(error)
            })

    }

    editar = (id) => {
        console.log('Editando o lancamento: ',id);
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmacao = (lancamento) => {
        console.log(lancamento);
        console.log(lancamento.id);
        this.lancamentoDeletar = lancamento;
        console.log( this.lancamentoDeletar);
        console.log( this.lancamentoDeletar.id);
        //const lancamentoTeste = Lancamento;
        //this.setState({lancamentoDeletar : lancamento})
        //this.setState({showConfirmDialog : true, lancamentoDeletar : Lancamento});
        //console.log(this.lancamentoDeletar);
        this.setState({showConfirmDialog : true});
        

    }

    cancelarDelecao = () => {
        this.lancamentoDeletar = {};
        //this.setState({showConfirmDialog : false, lancamentoDeletar: {}})
        this.setState({showConfirmDialog : false})
    }

    deletar = () => {
        console.log('Deletando o lancamento: ',this.lancamentoDeletar);
        console.log('Deletando o lancamento: ',this.lancamentoDeletar.id);
        this.service
            .deletar(this.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.lancamentoDeletar);
                lancamentos.splice(index,1);
                this.setState(lancamentos);

                messages.mensagemSucesso('Lançamento deletado com sucesso!')
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o lancamento!')
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then( response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if(index !== -1) {
                    lancamento['status'] = status;
                    lancamento[index] = lancamento;
                    this.setState({lancamento})
                }
                messages.mensagemSucesso("Status atualizado com sucesso!")
            })
    }

    render() {

        const meses = this.service.obterListaMeses();
        
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} className="p-button-secondary"/>
            </div>
        )

        //const lancamentos = [
        //    {id: 1, descricao: 'Salário', valor: 5000, mes: 1, tipo: 'Receita', status: 'Efetivado' }
       // ]

        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input tyoe="text"
                                       className="form-control"
                                       id="inputAno"
                                       value={this.state.ano}
                                       onChange={e => this.setState({ano: e.target.value})}
                                       placeholder="Digite o Ano"/>
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" label="Mês: ">
                                <SelectMenu id="inputMes" 
                                value={this.state.mes}
                                onChange={e => this.setState({mes: e.target.value})}
                                className="form-control" 
                                lista={meses} />
                            </FormGroup>
                            
                            <FormGroup htmlFor="inputDesc" label="Descrição: *">
                                <input tyoe="text"
                                       className="form-control"
                                       id="inputDesc"
                                       value={this.state.descricao}
                                       onChange={e => this.setState({descricao: e.target.value})}
                                       placeholder="Digite a Descrição"/>
                            </FormGroup>

                            <FormGroup htmlFor="inputTipo" label="Tipo Lançamento: ">
                                <SelectMenu id="inputTipo"
                                value={this.state.tipo}
                                onChange={e => this.setState({tipo: e.target.value})}
                                className="form-control" 
                                lista={tipos} />
                            </FormGroup>
                            <br/>
                            <button onClick={this.buscar} 
                                type="button" 
                                className="btn btn-success">
                                    <i className="pi pi-search"></i>Buscar</button>
                            <button onClick={this.preparaFormularioCadastro} 
                            type="button" 
                            className="btn btn-danger">
                                <i className="pi pi-plus"></i>Cadastrar</button>

                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos} 
                                deleteAction={this.abrirConfirmacao}
                                editAction={this.editar}
                                alterarStatus={this.alterarStatus}/>
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmação"
                        visible={this.state.showConfirmDialog}
                        style={{with: '50vw'}} 
                        footer={confirmDialogFooter}
                        modal={true}
                        onHide={() => this.setState({showConfirmDialog: false})}>
                            Confirma a exclusão deste Lançamento?

                    </Dialog>
                </div>
            </Card>

        )   
    }
} 

export default withRouter(ConsultaLancamentos);