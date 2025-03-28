import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private idArray: number[] = [];
  private lastId: number = 0;

  private idArrayVertex: number[] = [];
  private lastIdVertex: number = 0;

  constructor() { }

  getUniqueId(): number {
    let id = this.lastId + 1;
    for (let i = 0; i < this.idArray.length; i++) {
      if (!this.idArray.includes(this.idArray[i])) {
        id = this.idArray[i];
        this.idArray.push(id);
        return id;
      }
    }

    if (this.idArray.includes(id)) {
      return this.getUniqueId();
    }
    this.idArray.push(id);
    this.lastId = id;
    return id;
  }

  removeId(id: number): void {
    this.idArray = this.idArray.filter((value) => value !== id);
  }


  getUniqueIdVertex(): number {
    let id = this.lastIdVertex + 1;
    for (let i = 0; i < this.idArrayVertex.length; i++) {
      if (!this.idArrayVertex.includes(this.idArrayVertex[i])) {
        id = this.idArrayVertex[i];
        this.idArrayVertex.push(id);
        return id;
      }
    }

    if (this.idArrayVertex.includes(id)) {
      return this.getUniqueId();
    }
    this.idArrayVertex.push(id);
    this.lastIdVertex = id;
    return id;
  }

}
