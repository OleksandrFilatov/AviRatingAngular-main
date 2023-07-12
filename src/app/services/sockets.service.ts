import { Injectable } from '@angular/core';
import io from 'socket.io-client/dist/socket.io';
@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  socket: io.Socket

  constructor() { 
  }

  createSocket(){
    this.socket = io.connect('http://192.168.114.57:5000');
    console.log("socket create");
  }

}
