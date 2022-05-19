import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note } from './@types/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl: string;

  private newNoteSource = new Subject<Note>();
  newNoteProvider = this.newNoteSource.asObservable();

  private editNoteSource = new Subject<Note>();
  editNoteProvider = this.editNoteSource.asObservable();

  private saveEditNoteSource = new Subject<Note>();
  saveEditNoteProvider = this.saveEditNoteSource.asObservable();

  constructor(private http: HttpClient) {
    this.apiUrl = "https://fiap-notes-api.herokuapp.com";
  }

  private notes = [
    {
      id: 1,
      date: new Date(),
      text: 'Um texto qualquer',
      urgent: false,
    },
    {
      id: 2,
      date: new Date(),
      text: 'Um texto qualquer 2',
      urgent: true,
    },
    {
      id: 3,
      date: new Date(),
      text: 'Um texto qualquer 3',
    },
    {
      id: 4,
      date: new Date(),
      text: 'Um texto qualquer 4',
      urgent: true,
    },
  ];

  notifyNewNoteAdded(note: Note){
    this.newNoteSource.next(note);
    // this.newNoteSource.error("algum exception");
  }
  /**
   * 
   */
  notifyNewNoteEdit(note: Note){
    this.editNoteSource.next(note);
  }
  
  /**
   * 
   */
  notifyNewNoteSaveEdit(note: Note){
    this.saveEditNoteSource.next(note);
  }
  getNotes(){
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  removeNote(noteId: number){
    return this.http.delete(`${this.apiUrl}/notes/${noteId}`);
  }

  postNotes(textNote: string){  
    return this.http.post<Note>(`${this.apiUrl}/notes`, {text: textNote});
  }
  
  putNotes(text: string, id: number){
    return this.http.put<Note>(`${this.apiUrl}/notes/${id}`, {text:text});
  }

}
