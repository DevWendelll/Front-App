import { Component, OnInit } from '@angular/core';
import { Evento } from '../../../models/Evento';
import { Modal } from 'bootstrap';
import { EventoService } from '../../../services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrl: './evento-lista.component.scss'
})
export class EventoListaComponent implements OnInit {
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

  public larguraImagem: number = 50;
  public margemImagem: number =2;
  public mostrarImagem: boolean = true;
  private _filtroLista: string = '';

  public modalIntance : Modal | undefined;

  public get filtroLista(): string{
    return this._filtroLista;
  }

  public set filtroLista(value: string)
  {
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this.filtroLista): this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[]
  {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local:string; }) =>
      evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  public alterarImagem(): void{
    this.mostrarImagem= !this.mostrarImagem;
  }

  constructor( 
   private eventoService: EventoService, 
   private spinner: NgxSpinnerService,
   private toastr : ToastrService,
   private router: Router
  //  private modalService: BsModalService
  ) {}

  modalInstance: any;


  public ngOnInit() {
    this.spinner.show();
    this.getEventos();
     const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    } else {
      console.error('Elemento do modal não encontrado!');
    }
  }

  openModal() {
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }

  confirModalYes(){
    this.modalInstance.hide();
    this.toastr.success('Evento deletado com sucesso!!!')
  }
  confirModalNo(){
    this.modalInstance.hide();
  }
  

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os Eventos','Error!')
      },
      complete: () => this.spinner.hide()
    });
  }

  detalheEvento(id: number): void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
