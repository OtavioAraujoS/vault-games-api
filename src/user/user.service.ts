import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as chalk from 'chalk';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserDocument } from './schemas/user.schemas';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    this.logger.log(
      chalk.green(`Fetched all users at ${new Date().toISOString()}`)
    );
    return users;
  }

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
  ): Promise<{ status: number; message: string }> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      this.logger.error(
        chalk.hex('#FF00FF')(
          `Password update failed for user ID: ${id} at ${new Date().toISOString()}`
        )
      );
      throw new NotFoundException('User not found');
    }
    await this.userModel
      .findByIdAndUpdate(
        id,
        { password: updatePasswordDto.password },
        { new: true }
      )
      .exec();
    this.logger.log(
      chalk.cyan(
        `Password updated for user ID: ${id} at ${new Date().toISOString()}`
      )
    );
    return { status: HttpStatus.OK, message: 'Password updated successfully' };
  }

  async deleteUser(id: string): Promise<{ status: number; message: string }> {
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
    return { status: HttpStatus.OK, message: 'User deleted successfully' };
  }
}
