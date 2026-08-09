import { IsString, IsNotEmpty, IsArray, ValidateNested, IsEmail, MinLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class ComponentPropDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  defaultValue?: string;

  required: boolean;

  @IsString()
  description: string;
}

export class ComponentCodeDto {
  @IsString()
  @IsNotEmpty()
  typescript: string;

  @IsString()
  @IsNotEmpty()
  template: string;

  @IsString()
  styles: string;
}

export class AuthorInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  github: string;
}

export class StoryConfigDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  args: Record<string, unknown>;
  argTypes: Record<string, unknown>;
}

export class CreateComponentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z][a-z0-9-]*$/)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]+-[a-z0-9-]+$/)
  selector: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentPropDto)
  inputs: ComponentPropDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentPropDto)
  outputs: ComponentPropDto[];

  @ValidateNested()
  @Type(() => ComponentCodeDto)
  code: ComponentCodeDto;

  @ValidateNested()
  @Type(() => StoryConfigDto)
  storyConfig: StoryConfigDto;

  @ValidateNested()
  @Type(() => AuthorInfoDto)
  author: AuthorInfoDto;
}
