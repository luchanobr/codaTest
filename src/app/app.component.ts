import {
  MiaField,
  MiaFormConfig,
  MiaFormModalComponent,
  MiaFormModalConfig,
} from '@agencycoda/mia-form';
import { MiaTableComponent, MiaTableConfig } from '@agencycoda/mia-table';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { Client } from './entities/client';
import { ClientService } from './services/client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('miaTable') miaTable!: MiaTableComponent;
  title = 'Coda Test Angular';
  miaTableConfig = new MiaTableConfig();

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTableConfig();
  }

  loadTableConfig() {
    this.miaTableConfig.id = 'clients-talbe';
    this.miaTableConfig.columns = [
      {
        key: 'firstname',
        title: 'Nombre',
        type: 'string',
        field_key: 'firstname',
      },
      {
        key: 'lastname',
        title: 'Apellido',
        type: 'string',
        field_key: 'lastname',
      },
      {
        key: 'email',
        title: 'Email',
        type: 'string',
        field_key: 'email',
      },
      {
        key: 'more',
        type: 'more',
        title: 'Acciones',
        extra: {
          actions: [
            { icon: 'edit', title: 'Editar', key: 'edit' },
            { icon: 'delete', title: 'Borrar', key: 'remove' },
          ],
        },
      },
    ];
    this.miaTableConfig.loadingColor = 'purple';
    this.miaTableConfig.service = this.clientService;
    this.miaTableConfig.onClick.subscribe(
      (result: { key: string; item: Client }) => {
        if (result.key === 'remove') {
          this.openConfirmationModal(result.item);
        } else if (result.key === 'edit') {
          this.openModalClienteForm(result.item);
        } else {
          throw new Error(`Accion no soportada: ${result.key}`);
        }
      }
    );
  }

  openConfirmationModal(client: Client) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: client,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result)
        this.clientService.removeOb(result).subscribe((res: any) => {
          if (res) this.miaTable.loadItems();
        });
    });
  }

  openModalClienteForm(client?: Client) {
    let item = client ? client : { id: 0 };
    let data = new MiaFormModalConfig();
    data.item = item;
    data.service = this.clientService;
    data.titleNew = 'Agregar Cliente';
    data.titleEdit = 'Editar  Cliente';
    let config = new MiaFormConfig();
    config.hasSubmit = false;
    config.errorMessages = [
      { key: 'required', message: 'The  "%label%"  is required.' },
    ];
    config.fields = [
      {
        key: 'firstname',
        type: MiaField.TYPE_STRING,
        label: 'Nombre',
        validators: [Validators.required],
      },
      {
        key: 'lastname',
        type: MiaField.TYPE_STRING,
        label: 'Apellido',
        validators: [Validators.required],
      },
      {
        key: 'email',
        type: MiaField.TYPE_STRING,
        label: 'Email',
        validators: [Validators.required],
      },
    ];
    data.config = config;

    const dialogRef = this.dialog.open(MiaFormModalComponent, {
      width: '520px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.id) this.miaTable.loadItems();
    });
  }

  ngOnDestroy(): void {
    this.miaTableConfig.onClick.unsubscribe();
  }
}
