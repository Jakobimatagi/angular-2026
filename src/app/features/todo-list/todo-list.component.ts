import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type TodoFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'feature-todo-list-component',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    DragDropModule,
    DatePipe,
    FormsModule
  ]
})
export class TodoListComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly todos = signal<Todo[]>([]);
  protected readonly currentFilter = signal<TodoFilter>('all');
  protected readonly newTodoText = signal<string>('');

  protected readonly filteredTodos = computed(() => {
    const todos = this.todos();
    const filter = this.currentFilter();
    
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  });

  protected readonly activeTodoCount = computed(() => {
    return this.todos().filter(todo => !todo.completed).length;
  });

  protected readonly completedTodoCount = computed(() => {
    return this.todos().filter(todo => todo.completed).length;
  });

  public ngOnInit(): void {
    this.loadTodosFromLocalStorage();
  }

  protected addTodo(): void {
    const text = this.newTodoText().trim();
    if (!text) return;
    
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date()
    };
    
    this.todos.update(todos => [...todos, newTodo]);
    this.newTodoText.set('');
    this.saveTodosToLocalStorage();
  }

  protected toggleTodo(id: number): void {
    this.todos.update(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    this.saveTodosToLocalStorage();
  }

  protected deleteTodo(id: number): void {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
    this.saveTodosToLocalStorage();
  }

  protected setFilter(filter: TodoFilter): void {
    this.currentFilter.set(filter);
  }

  protected clearCompleted(): void {
    this.todos.update(todos => todos.filter(todo => !todo.completed));
    this.saveTodosToLocalStorage();
  }

  protected onTodoDrop(event: CdkDragDrop<Array<Todo>>): void {
    const todos = [...this.filteredTodos()];
    moveItemInArray(todos, event.previousIndex, event.currentIndex);
    
    this.todos.set(todos);
    this.saveTodosToLocalStorage();
  }

  private saveTodosToLocalStorage(): void {
    if (this.isBrowser) {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
    }
  }

  private loadTodosFromLocalStorage(): void {
    if (!this.isBrowser) return;
    
    const stored = localStorage.getItem('todos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const todos = parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        this.todos.set(todos);
      } catch (error) {
        console.error('Failed to load todos from localStorage', error);
      }
    }
  }
}