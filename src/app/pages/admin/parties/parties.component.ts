import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartyService } from '../../../services/party.service';
import { Party } from '../../../models/models';

@Component({
  selector: 'app-parties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parties.component.html',
  styleUrl: './parties.component.scss'
})
export class PartiesComponent implements OnInit {
  parties = signal<Party[]>([]);
  showModal = signal(false);
  editingParty = signal<Party | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  formData: Party = { name: '', symbol: '', description: '' };

  constructor(private partyService: PartyService) {}

  ngOnInit(): void {
    this.loadParties();
  }

  loadParties(): void {
    this.partyService.getAllParties().subscribe({
      next: (data) => this.parties.set(data),
      error: () => {}
    });
  }

  openModal(): void {
    this.editingParty.set(null);
    this.formData = { name: '', symbol: '', description: '' };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingParty.set(null);
  }

  editParty(party: Party): void {
    this.editingParty.set(party);
    this.formData = { name: party.name, symbol: party.symbol || '', description: party.description || '' };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  saveParty(): void {
    if (!this.formData.name) {
      this.errorMessage.set('Party name is required');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const request = this.editingParty()
      ? this.partyService.updateParty(this.editingParty()!.id!, this.formData)
      : this.partyService.createParty(this.formData);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.closeModal();
        this.loadParties();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to save party');
      }
    });
  }

  deleteParty(party: Party): void {
    if (confirm(`Are you sure you want to delete "${party.name}"?`)) {
      this.partyService.deleteParty(party.id!).subscribe({
        next: () => this.loadParties(),
        error: () => {}
      });
    }
  }
}
