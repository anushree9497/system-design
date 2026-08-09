import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  async create(@Body() dto: CreateComponentDto) {
    return this.componentsService.createComponent(dto);
  }

  @Post('validate')
  async validate(@Body() dto: Partial<CreateComponentDto>) {
    return this.componentsService.validate(dto);
  }

  @Get('categories')
  getCategories() {
    return [
      'buttons', 'cards', 'inputs', 'layout',
      'navigation', 'feedback', 'data-display', 'overlays', 'other',
    ];
  }

  @Get('check-name/:name')
  async checkName(@Param('name') name: string) {
    return this.componentsService.checkNameAvailability(name);
  }
}
