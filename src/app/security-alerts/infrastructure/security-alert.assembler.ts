import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import {
  AlertSeverity,
  AlertStatus,
  AlertType,
  SecurityAlert
} from '../domain/model/security-alert.entity';
import { SecurityAlertResponse } from './security-alert.response';

/** Translates SecurityAlert resources into SecurityAlert entities. */
export class SecurityAlertAssembler
  implements BaseAssembler<SecurityAlert, SecurityAlertResponse>
{
  toEntityFromResource(resource: SecurityAlertResponse): SecurityAlert {
    return new SecurityAlert({
      id: resource.id,
      warehouseId: resource.warehouseId,
      zoneId: resource.zoneId,
      physicalEventId: resource.physicalEventId,
      alertType: resource.alertType as AlertType,
      severity: resource.severity as AlertSeverity,
      status: resource.status as AlertStatus,
      message: resource.message,
      raisedAt: new Date(resource.raisedAt),
      justification: resource.justification
    });
  }

  toEntitiesFromResponse(response: SecurityAlertResponse[]): SecurityAlert[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: SecurityAlert): SecurityAlertResponse {
    return {
      id: entity.id,
      warehouseId: entity.warehouseId,
      zoneId: entity.zoneId,
      physicalEventId: entity.physicalEventId,
      alertType: entity.alertType,
      severity: entity.severity,
      status: entity.status,
      message: entity.message,
      raisedAt: entity.raisedAt.toISOString(),
      justification: entity.justification
    };
  }
}
