import { IsOptional, IsString, IsEnum, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class UsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) => value?.toUpperCase())
  sortOrder?: SortOrder;

  @IsOptional()
  @Transform(({ value }) => value || 'createdAt')
  sortBy: 'createdAt' | 'email' | 'id' = 'createdAt';
}
