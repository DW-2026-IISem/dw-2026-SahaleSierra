import { SetMetadata } from '@nestjs/common';

export const RESOURCE_KEY = 'resource';
export const ResourceMeta = (path: string, method: string) =>
  SetMetadata(RESOURCE_KEY, { path, method });
