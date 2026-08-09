import { Module } from '@nestjs/common';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';
import { GithubModule } from '../github/github.module';
import { TemplateModule } from '../templates/template.module';

@Module({
  imports: [GithubModule, TemplateModule],
  controllers: [ComponentsController],
  providers: [ComponentsService],
})
export class ComponentsModule {}
