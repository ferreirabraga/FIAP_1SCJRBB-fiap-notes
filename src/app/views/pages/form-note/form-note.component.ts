import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Note } from 'src/app/services/@types/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-form-note',
  templateUrl: './form-note.component.html',
  styleUrls: ['./form-note.component.css'],
})

export class FormNoteComponent implements OnInit {
  title = 'FIAP NOTES';
  textNoteValue: string = "";
  logoImage = '/assets/logo.png';
  isEdit : Boolean = false;
  id : number = 0;

  //usado na função editar quando clicado no icone editar
  subscription: Subscription;

  checkoutForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {
    this.checkoutForm = this.formBuilder.group({
      textNote: ['', [Validators.required, Validators.minLength(5)]],
    });
    
    this.subscription = this.noteService.editNoteProvider.subscribe({
      next: (note: Note) => {
        if(note.id != undefined){
          this.textNoteValue = note.text;
          this.isEdit =true;
          this.id = note.id;
        }
      },
      error: () => {}
    });
  }

  ngOnInit(): void {}

  sendNote() {
    // console.log(this.checkoutForm.get('textNote')?.errors);
    if (this.checkoutForm.valid) {
      //verifica se é a ação de editar
      if(this.isEdit){
        this.noteService.putNotes(this.checkoutForm.value.textNote, this.id).subscribe({
          //next é chamado quando as coisas dão certo
          next: (note) => {
            this.checkoutForm.reset();
            this.noteService.notifyNewNoteSaveEdit(note);
            //reset a variavel isEdit
            this.isEdit =false;
          },
          //error é chamado no caso de excessões
          error: (error) => alert("Algo errado na inserção! " + error)
        });
      }else{
        this.noteService.postNotes(this.checkoutForm.value.textNote).subscribe({
          //next é chamado quando as coisas dão certo
          next: (note) => {
            this.checkoutForm.reset();
            this.noteService.notifyNewNoteAdded(note);
          },
          //error é chamado no caso de excessões
          error: (error) => alert("Algo errado na inserção! " + error)
        });
      }
    }
  }

  get textNote() {
    return this.checkoutForm.get('textNote');
  }
 
}
