import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sensor-node-form',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './sensor-node-form.html',

  styleUrl: './sensor-node-form.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorNodeForm {

  private readonly formBuilder = inject(FormBuilder);


  protected readonly form = this.formBuilder.nonNullable.group({

    macAddress: [
      '',
      [
        Validators.required
      ]
    ],

    model: [
      '',
      [
        Validators.required
      ]
    ],

    sensorType: [
      'MAGNETIC_CONTACT',
      [
        Validators.required
      ]
    ],

    zoneId: [
      1,
      [
        Validators.required
      ]
    ]

  });


  protected submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    console.log(
      'Sensor to register:',
      this.form.getRawValue()
    );

  }

}
