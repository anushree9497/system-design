import { Module } from '@nestjs/common';
import { ComponentsModule } from './components/components.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [ComponentsModule, GithubModule],
})
export class AppModule {}
