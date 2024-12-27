import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const { nome, password } = loginUserDto;
    const user = await this.userModel.findOne({ nome, password }).exec();
    if (!user) {
      throw new NotFoundException('User not found or incorrect password');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ nome: createUserDto.nome })
      .exec();
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { password: updatePasswordDto.password },
        { new: true }
      )
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
