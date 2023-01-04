import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'abc123@gmail.com',
    description: 'user email to use in this site',
  })
  public email: string;

  @ApiProperty({
    example: 'Jeanoza',
    description: 'user nickname in this site',
  })
  public nickname: string;

  @ApiProperty({
    example: 'q1w2e3r4t5!',
    description: 'user password in this site',
  })
  public password: string;
}
