import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersQueryDto } from './dto/users-query.dto';

export interface PaginatedUsersResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAllPaginated(query: UsersQueryDto): Promise<PaginatedUsersResult> {
    const qb = this.userRepository.createQueryBuilder('user');
    
    if (query.search) {
      qb.andWhere('(user.email ILIKE :search OR CAST(user.id AS TEXT) ILIKE :search)', {
        search: `%${query.search}%`
      });
    }
    
    qb.orderBy(`user.${query.sortBy}`, query.sortOrder)
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const [users, total] = await qb.getManyAndCount();
    
    return {
      users,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit)
    };
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
