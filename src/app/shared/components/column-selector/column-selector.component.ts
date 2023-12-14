import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TableColumn } from '@shared/types/table.type';
import { MatSelectChange } from '@angular/material/select';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-column-selector',
  templateUrl: './column-selector.component.html',
  styleUrls: ['./column-selector.component.scss'],
})
export class ColumnSelectorComponent implements AfterContentInit {
  @Input() localStorageKey: string;
  @Input() columnDefinitions: TableColumn[];
  @Input() placeholder: string;

  optionalColumnsSelected: string[];
  optionalColumnOptions: TableColumn[];

  cogIcon = faCog;

  _displayedColumns: string[];
  @Input() set displayedColumns(val: string[]) {
    this.displayedColumnsChange.emit(val);
    this._displayedColumns = val;
  }
  get displayedColumns() {
    return this._displayedColumns;
  }
  @Output() displayedColumnsChange: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  constructor() {}

  ngAfterContentInit(): void {
    this.optionalColumnOptions = this.columnDefinitions.filter(
      (o) => o.toggleable
    );

    const userDisplayedColumns = localStorage.getItem(this.localStorageKey);
    if (userDisplayedColumns) {
      const chosenColumns = userDisplayedColumns.split(',');
      this.displayedColumns = chosenColumns;
      this.optionalColumnsSelected = chosenColumns;
    } else {
      this.optionalColumnsSelected = this.columnDefinitions
        .filter((o) => o.toggleable && o.default)
        .map((o) => o.id);
      this.displayedColumns = this.columnDefinitions
        .filter((o) => o.default)
        .map((o) => o.id);
    }
  }

  handleColumnSelection({
    source: { value: selectedColumns },
  }: MatSelectChange) {
    const displayedColumns = this.columnDefinitions
      .filter((o) => !o.toggleable || selectedColumns.includes(o.id))
      .map((o) => o.id);

    localStorage.setItem(this.localStorageKey, displayedColumns.join(','));
    this.displayedColumns = displayedColumns;
  }

  selectAll() {
    const allOptional = this.optionalColumnOptions.map((o) => o.id);
    this.handleColumnSelection({
      source: { value: allOptional },
    } as MatSelectChange);
    this.optionalColumnsSelected = allOptional;
  }

  deSelectAll() {
    this.handleColumnSelection({ source: { value: [] } } as MatSelectChange);
    this.optionalColumnsSelected = [];
  }
}
