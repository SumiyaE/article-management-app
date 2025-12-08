import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from './entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity])],
})
export class OrganizationsModule { }
