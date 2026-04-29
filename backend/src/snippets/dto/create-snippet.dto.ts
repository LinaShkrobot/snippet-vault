import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsIn,
  IsOptional,
  MaxLength,
  MinLength,
  ArrayMaxSize,
} from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  tags?: string[];

  @IsIn(['link', 'note', 'command'])
  type: 'link' | 'note' | 'command';
}
