import { Controller, Get, Param, UseGuards, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { GetUser } from './get-user.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UsersQueryDto } from './dto/users-query.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@GetUser() user: any) {
    return user;
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllUsers(@Query() query: UsersQueryDto) {
    return this.usersService.findAllPaginated(query);
  }
}
