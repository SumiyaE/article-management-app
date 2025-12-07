import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}

  findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find();
  }

  findOne(id: number): Promise<Organization | null> {
    return this.organizationsRepository.findOneBy({ id });
  }

  findBySlug(slug: string): Promise<Organization | null> {
    return this.organizationsRepository.findOneBy({ slug });
  }

  create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationsRepository.save(createOrganizationDto);
  }

  update(id: number, updateOrganizationDto: Partial<CreateOrganizationDto>): Promise<UpdateResult> {
    return this.organizationsRepository.update(id, updateOrganizationDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.organizationsRepository.delete(id);
  }
}
