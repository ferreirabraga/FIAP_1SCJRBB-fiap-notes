import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Note } from 'src/app/services/@types/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-list-notes',
  templateUrl: './list-notes.component.html',
  styleUrls: ['./list-notes.component.css'],
})
export class ListNotesComponent implements OnInit {
  title = 'Titulo da nota';
  notes = [] as Note[];

  //usado na função criar um novo note
  subscription: Subscription;
  //usado na função edita um note
  subscriptionSaveEdit: Subscription;

  //injetando a dependência do service
  constructor(private noteService: NoteService) {
    //pega nova notificação do Observable
    this.subscription = this.noteService.newNoteProvider.subscribe({
      next: (note: Note) => {
        // this.getApiNotes();
        this.notes.push(note);
      },
      error: () => {}
    });
    //pega nova notificação do Observable
    this.subscriptionSaveEdit = this.noteService.saveEditNoteProvider.subscribe({
      next: (note: Note) => {
        this.getApiNotes();
        },
      error: () => {}
    });
  
  }

  //método do cliclo de vida do componente
  ngOnInit(): void {
    this.getApiNotes();
  }

  //busca todos os notes
  getApiNotes(){
    this.noteService.getNotes().subscribe({
      next: (apiNotes) => this.notes = apiNotes,
      error: (error) => console.error(error),
      // complete: () => alert("Deu tudo certo")
    });
  }
  //apaga note informado
  removeNote(noteId: number){
    this.noteService.removeNote(noteId).subscribe(
      () => this.notes = this.notes.filter(note => note.id !== noteId)
    );
  }

  //  editNote(note: Note){
  //    if(note.id != undefined){
  //      //this.noteService.putNotes(note).subscribe(() => note);
  //      this.noteService.notifyNewNoteEdit(note);
  //    }
   
  //  }
}
