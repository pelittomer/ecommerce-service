import {
    ArgumentMetadata,
    BadRequestException,
    Param,
    PipeTransform,
} from '@nestjs/common';

export class RoleValidationPipe implements PipeTransform {
    private readonly validRoles = ['customer', 'seller'];

    transform(value: any, metadata: ArgumentMetadata) {
        if (!this.validRoles.includes(value)) {
            throw new BadRequestException('Invalid role!');
        }
        return value;
    }
}

export const RoleParam = () => Param('role', RoleValidationPipe)