import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Note } from 'src/app/services/@types/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  constructor(private noteService: NoteService){}

  @Input()
  noteProp = {} as Note;

  @Input()
  titleProp: any;

  @Output()
  notify = new EventEmitter();

  ngOnInit(): void { }

  confirmRemove(){
    if(confirm("Deseja realmente apagar?"))
      this.notify.emit();
  }

  /**
   * 
   * @param note executado quando o icone de editar na 
   */
  editNote(note:Note){
    //mostra popup de confirmação
    if(confirm("Deseja editar o note '"+note.text+"' ?" )){
      //notifica o observer
      this.noteService.notifyNewNoteEdit(note);      
      //destaca note em edição
      this.alterarCSSNote(note);

      this.noteService.getNotes().subscribe({
        next: (apiNotes) => {
          apiNotes.forEach(element => {
            if(element.id != note.id){
              this.escondeIcones(element.id);
            }
          });
        },
        error: (error) => console.error(error),
        // complete: () => alert("Deu tudo certo")
      });
    }
  }

  /**
   * Altera core de fundo e texto do note
   * em edição
   * @param note 
   */
  alterarCSSNote(note:Note){
    const element = document.getElementById(note.id+"");
    element!=undefined?element.style.backgroundColor = 'yellow':element;
    element!=undefined?element.style.color = 'black':element;
  }

  escondeIcones(id : number){
    const element = document.getElementById(id+"_edit");
    element!.style.display = 'none';
    const elementDelete = document.getElementById(id+"_delete");
    elementDelete!.style.display = 'none';
  }

}
