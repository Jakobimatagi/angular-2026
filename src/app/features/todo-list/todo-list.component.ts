import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'feature-todo-list-component',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class TodoListComponent {}
