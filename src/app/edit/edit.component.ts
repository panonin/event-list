import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventItem } from '../core/models/event.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.styl'],
  providers: [MessageService]
})
export class EditComponent implements OnInit {

  event: EventItem;
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(),
    date: new FormControl('', [Validators.required]),
    id: new FormControl(),
    editable: new FormControl()
  });

  constructor(private router: Router, private messageService: MessageService) {
    this.event = this.router.getCurrentNavigation().extras.state as EventItem;
  }

  ngOnInit(): void {
    if (this.event) {
      this.patchForm();
    }
  }

  patchForm(): void {
    this.form.patchValue({
      name: this.event.name,
      description: this.event.description,
      date: new Date(this.event.date),
      id: this.event.id,
      editable: this.event.editable
    });
  }

  updateStorage(save: boolean): void {
    if (!this.form.valid) {
      return;
    }
    const event = this.form.value as EventItem;
    const eventList: EventItem[] = JSON.parse(localStorage.getItem('events')) || [];
    save ? eventList.map((i: EventItem) => {
        if (i.id === this.event.id) {
          eventList[eventList.indexOf(i)] = event;
        }
      }) :
      eventList.push(event);
    localStorage.setItem('events', JSON.stringify(eventList));
  }

  create(): void {
    const eventList: EventItem[] = JSON.parse(localStorage.getItem('events')) || [];
    this.form.patchValue({
      editable: true,
      id: eventList.length < 1 ? 0 : eventList.pop().id + 1
    });
    this.updateStorage(false);
    this.messageService.add({ key: 'ct', severity: 'success', summary: 'Событие создано' });
    setTimeout(() => {
      this.router.navigateByUrl('/list');
    }, 1000);
  }

  save(): void {
    this.updateStorage(true);
    this.messageService.add({ severity: 'success', summary: 'Сохранено' });
  }

  undo(): void {
    this.patchForm();
    this.updateStorage(true);
    console.log(this.event);
    this.messageService.add({ key: 'ud', severity: 'info', summary: 'Изменения отменены' });
  }

  isControlInvalid(control: string): boolean {
    return this.form.controls[control].invalid && this.form.controls[control].touched;
  }
}
