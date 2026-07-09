import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AppError } from '../common/AppError';
import { env } from '../config/env';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || user.password !== data.password) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async register(data: RegisterDto) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email already exists', 400);
    }
    
    // Using raw password since requirement is mock auth
    const user = await this.userRepository.create({
      email: data.email,
      password: data.password,
      role: data.role
    });

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, env.JWT_SECRET, { expiresIn: '1h' });
      return { token: newToken };
    } catch {
      throw new AppError('Invalid token', 401);
    }
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return { id: user.id, email: user.email, role: user.role };
  }
}
