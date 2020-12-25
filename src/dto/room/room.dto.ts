import { UserDto } from '../user/user.dto';

export interface RoomDto {
  id: number;
  name: string;
  createdBy: string;
  createdByUserHash: string;
  createdAt: string;
  users: UserDto[];
}
