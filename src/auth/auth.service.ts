import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ){}

  async userAuth(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{acessToken: string}>{
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);

    console.log(username);
    if(!username){
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const acessToken = await this.jwtService.sign(payload);

    return { acessToken };
  }

}
