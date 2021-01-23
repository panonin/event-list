import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { EventItem } from '../core/models/event.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.styl'],
  providers: [ConfirmationService, MessageService]
})
export class ListComponent implements OnInit {

  event: EventItem;
  events: EventItem[];

  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.events = JSON.parse(localStorage.getItem('events'));
  }

  editEvent(event: EventItem): void {
    this.router.navigateByUrl('/edit', { state: event });
  }

  deleteEvent(event: EventItem): void {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите удалить это событие?',
      accept: () => {
        this.events = this.events.filter(i => i !== event);
        localStorage.setItem('events', JSON.stringify(this.events));
        this.messageService.add({ severity: 'success', summary: 'Событие удалено!' });
      }
    });
  }

  undoEventEdit(event: EventItem): void {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите отменить редактировние этого события?',
      accept: () => {
        event.editable = false;
        localStorage.setItem('events', JSON.stringify(this.events));
        this.messageService.add({ severity: 'success', summary: 'Редактирование отменено!' });
      }
    });
  }
}
