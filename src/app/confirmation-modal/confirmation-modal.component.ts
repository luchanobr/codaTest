import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from '../entities/client';

@Component({
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Client) {}

  ngOnInit(): void {}
}
