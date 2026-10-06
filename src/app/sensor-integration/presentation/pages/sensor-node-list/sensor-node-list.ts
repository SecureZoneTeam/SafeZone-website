import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { SensorIntegrationStore } from '../../../application/sensor-integration.store';

/** IoT device list with connection status (user story US02). */
@Component({
  selector: 'app-sensor-node-list',
  imports: [DatePipe, MatTableModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './sensor-node-list.html',
  styleUrl: './sensor-node-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorNodeList implements OnInit {
  protected readonly sensorIntegrationStore = inject(SensorIntegrationStore);
  protected readonly displayedColumns = ['macAddress', 'model', 'zone', 'connection', 'lastPing'];

  ngOnInit(): void {
    this.sensorIntegrationStore.loadSensorNodes();
  }
}
