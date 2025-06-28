import { Component, computed, EventEmitter, Inject, inject, Input, OnInit, Output, signal } from '@angular/core';
import { ProfileEntry } from '../../../../profile-entry/shared/models/profile-entry';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProfileEntryHelperMethods } from '../../../../profile-entry/shared/profile-entry-helper-methods';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ProfileEntryService } from '../../../../core/services/profile-entry.service';
import { ProfileEntryCategory } from '../../../../core/enums/profile-entry-category';

export interface Entry
{
  name: string;
  selected: boolean;
  entries?: EntryItem[];
}

export interface EntryItem
{
  selected: boolean;
  item: ProfileEntry;
}

@Component({
  selector: 'app-profile-entries-importer',
  imports: [CommonModule, CdkAccordionModule, MatCheckboxModule],
  templateUrl: './profile-entries-importer.component.html',
  styleUrl: './profile-entries-importer.component.scss'
})
export class ProfileEntriesImporterComponent implements OnInit
{
  profileEntryService = inject(ProfileEntryService);

  ProfileEntryHelperMethods = ProfileEntryHelperMethods;

  protected selectedEntriesIds: string[] = [];

  @Input() entries: { [key: string]: ProfileEntry[] } = {};
  @Input() acceptButtonText: string = "Save"

  @Output() onSubmit = new EventEmitter<ProfileEntry[]>();
  @Output() onCancel = new EventEmitter<void>();

  protected isLoading: boolean = false;

  readonly entriesManager = signal<Entry>({
    name: 'Select All Entries',
    selected: false,
    entries: [],
  });

  readonly partiallyComplete = computed(() =>
  {
    const entriesManager = this.entriesManager();
    if (!entriesManager.entries)
    {
      return false;
    }
    return entriesManager.entries.some(t => t.selected) && !entriesManager.entries.every(t => t.selected);
  });

  constructor(@Inject(DIALOG_DATA) public data: { entries: { [key in ProfileEntryCategory]: ProfileEntry[] } })
  {
    if (data && data.entries)
      this.entries = data.entries;
    this.isLoading = true;
  }

  ngOnInit(): void
  {
    this.isLoading = false;
  }

  update(selected: boolean, index?: number)
  {
    this.entriesManager.update(entry =>
    {
      if (index === undefined)
      {
        entry.selected = selected;
        entry.entries?.forEach(t => (t.selected = selected));
      } else
      {
        entry.entries![index].selected = selected;
        entry.selected = entry.entries?.every(t => t.selected) ?? true;
      }
      return { ...entry };
    });
  }

  protected getTitle(entryId: string): string
  {
    return ProfileEntryHelperMethods.getCategoryName(Number(entryId));
  }

  protected isSelected(id: string): boolean
  {
    return this.selectedEntriesIds.includes(id);
  }

  selectEntries(ids: string[]): void
  {
    for (const id of ids)
    {
      if (!this.selectedEntriesIds.includes(id))
      {
        this.selectedEntriesIds.push(id);
      }
    }
  }
  protected toggleEntrySelection(id: string): void
  {
    if (this.selectedEntriesIds.includes(id))
    {
      const index = this.selectedEntriesIds.indexOf(id);
      this.selectedEntriesIds.splice(index, 1);
    }
    else
    {
      this.selectedEntriesIds.push(id);
    }
  }

  protected save(): void
  {
    const entries = Object.keys(this.entries);
    const items: ProfileEntry[] = [];
    for (const entry of entries)
    {
      for (const item of this.entries[entry])
      {
        if (this.selectedEntriesIds.includes(item.id))
          items.push(item);
      }
    }
    this.onSubmit.emit(items);
  }

  protected cancel(): void
  {
    this.onCancel.emit();
  }
}
