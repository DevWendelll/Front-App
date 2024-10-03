import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  // modalRef?: BsModalRef;

  public ngOnInit() {
    this.spinner.show();
    this.getEventos();
 
  }

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

  public larguraImagem: number = 50;
  public margemImagem: number =2;
  public mostrarImagem: boolean = true;
  private _filtroLista: string = '';

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


  constructor( 
   private eventoService: EventoService, 
   private spinner: NgxSpinnerService,
  //  private modalService: BsModalService
  ) {}


 
  public alterarImagem(): void{
    this.mostrarImagem= !this.mostrarImagem;
  }


  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
      },
      complete: () => this.spinner.hide()
    });

  }
  //  openModal(template: TemplateRef<void>) {
  //     this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  //     }
     
  //     public confirm(): void {
  //       this.modalRef!.hide();  // Afirma que modalRef não é null
  //     }
      
  //     public decline(): void {
  //       this.modalRef!.hide();
  //     }

}
