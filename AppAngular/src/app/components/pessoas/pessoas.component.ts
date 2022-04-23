import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pessoa } from 'src/app/Pessoa';
import { PessoasService } from 'src/app/pessoas.service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {
  formulario: any;
  tituloFormulario: string;
  pessoas: Pessoa[];
  nomePessoa: string;
  pessoaId: number;

  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false;

  modalRef: BsModalRef;

  constructor(private pessoasService: PessoasService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.pessoasService.PegarTodos().subscribe((resultado) => {
      this.pessoas = resultado;
    });
  }

  ExibirFormularioCadastro(): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.tituloFormulario = 'Nova Solicitação';
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      sobrenome: new FormControl(null),
      idade: new FormControl(null),
      profissao: new FormControl(null),
      email: new FormControl(null),
      limite: new FormControl(null),
      cpf: new FormControl(null),
    });
  }

  ExibirFormularioAtualizacao(pessoaId: number): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;

    this.pessoasService.PegarPeloId(pessoaId).subscribe((resultado) => {
      this.tituloFormulario = `Atualizar ${resultado.nome} ${resultado.sobrenome}`;

      this.formulario = new FormGroup({
        pessoaId: new FormControl(resultado.pessoaId),
        nome: new FormControl(resultado.nome),
        sobrenome: new FormControl(resultado.sobrenome),
        idade: new FormControl(resultado.idade),
        profissao: new FormControl(resultado.profissao),
        email: new FormControl(resultado.email),
        limite: new FormControl(resultado.limite),
        cpf: new FormControl(resultado.cpf)
      });
    });
  }

  EnviarFormulario(): void {
    const pessoa: Pessoa = this.formulario.value;

    if (pessoa.pessoaId > 0) {
      this.pessoasService.AtualizarPessoa(pessoa).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Pessoa atualizada com sucesso');
        this.pessoasService.PegarTodos().subscribe((registros) => {
          this.pessoas = registros;
        });
      });
    } else {
      this.pessoasService.SalvarPessoa(pessoa).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Pessoa inserida com sucesso');
        this.pessoasService.PegarTodos().subscribe((registros) => {
          this.pessoas = registros;
        });
      });
    }
  }

  Voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = false;
  }

  ExibirConfirmacaoExclusao(pessoaId: number, nomePessoa: string, conteudoModal: TemplateRef<any>): void{
    this.modalRef =this.modalService.show(conteudoModal);
    this.pessoaId = pessoaId;
    this.nomePessoa = nomePessoa;
  }


  ExcluirPessoa(pessoaId: number){
    this.pessoasService.ExcluirPessoa(pessoaId).subscribe(resultado => {
      this.modalRef.hide();
      alert('Pessoa excluída com sucesso');
      this.pessoasService.PegarTodos().subscribe(registros => {
        this.pessoas = registros;
      });
    });


  }
}
