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

  /**
   * Fetches all users from the database.
   * @returns {Promise<User[]>} A promise that resolves to an array of users.
   */
  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    this.logger.log(
      chalk.greenBright(`Fetched all users at ${new Date().toISOString()}`)
    );
    return users;
  }

  /**
   * Logs in a user by checking their credentials.
   * @param {LoginUserDto} loginUserDto - The login credentials.
   * @returns {Promise<User>} A promise that resolves to the logged-in user.
   * @throws {NotFoundException} If the user is not found or the password is incorrect.
   */
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

  /**
   * Creates a new user in the database.
   * @param {CreateUserDto} createUserDto - The user data to create.
   * @returns {Promise<User>} A promise that resolves to the created user.
   * @throws {BadRequestException} If the user already exists.
   */
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

  /**
   * Updates the password of an existing user.
   * @param {string} id - The ID of the user.
   * @param {UpdatePasswordDto} updatePasswordDto - The new password data.
   * @returns {Promise<{ status: number; message: string }>} A promise that resolves to a status message.
   * @throws {NotFoundException} If the user is not found.
   */
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

  /**
   * Deletes a user from the database.
   * @param {string} id - The ID of the user.
   * @returns {Promise<{ status: number; message: string }>} A promise that resolves to a status message.
   * @throws {NotFoundException} If the user is not found.
   */
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
