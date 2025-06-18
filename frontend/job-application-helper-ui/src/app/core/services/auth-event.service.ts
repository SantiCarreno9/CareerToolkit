// auth-event.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthEventService {
  private unauthorizedEvent = new Subject<void>();

  onUnauthorized$ = this.unauthorizedEvent.asObservable();

  triggerUnauthorized() {
    this.unauthorizedEvent.next();
  }
}