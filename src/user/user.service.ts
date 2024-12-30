import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as chalk from 'chalk';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const { nome, password } = loginUserDto;
    const user = await this.userModel.findOne({ nome, password }).exec();
    if (!user) {
      this.logger.error(
        chalk.red(
          `Login failed for user: ${nome} at ${new Date().toISOString()}`
        )
      );
      throw new NotFoundException('User not found or incorrect password');
    }
    this.logger.log(
      chalk.green(`User logged in: ${nome} at ${new Date().toISOString()}`)
    );
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ nome: createUserDto.nome })
      .exec();
    if (existingUser) {
      this.logger.error(
        chalk.yellow(
          `User creation failed: ${createUserDto.nome} already exists at ${new Date().toISOString()}`
        )
      );
      throw new BadRequestException('User already exists');
    }
    const createdUser = new this.userModel(createUserDto);
    this.logger.log(
      chalk.blue(
        `User created: ${createUserDto.nome} at ${new Date().toISOString()}`
      )
    );
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
      this.logger.error(
        chalk.hex('#FF00FF')(
          `Password update failed for user ID: ${id} at ${new Date().toISOString()}`
        )
      );
      throw new NotFoundException('User not found');
    }
    this.logger.log(
      chalk.cyan(
        `Password updated for user ID: ${id} at ${new Date().toISOString()}`
      )
    );
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      this.logger.error(
        chalk.hex('#FF00FF')(
          `User deletion failed for user ID: ${id} at ${new Date().toISOString()}`
        )
      );
      throw new NotFoundException('User not found');
    }

    await this.userModel.deleteOne({ _id: user._id }).exec();
    this.logger.log(
      chalk.cyan(
        `User deleted for user ID: ${id} at ${new Date().toISOString()}`
      )
    );
  }
}
