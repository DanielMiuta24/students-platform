import type { CreateCategoryDTO } from '../types';
import { toSlug } from '../../../shared/utils/slug';

export class CategoryCreateBuilder {
  private data: any = {
    isActive: true,
    order: 0,
  };

  setName(name: string): this {
    this.data.name = name;
    return this;
  }

  setSlug(slug: string): this {
    this.data.slug = slug;
    return this;
  }

  setDescription(description?: string): this {
    this.data.description = description;
    return this;
  }

  setIcon(icon?: string): this {
    this.data.icon = icon;
    return this;
  }

  setIsActive(isActive: boolean): this {
    this.data.isActive = isActive;
    return this;
  }

  setOrder(order: number): this {
    this.data.order = order;
    return this;
  }

  fromDTO(dto: CreateCategoryDTO): this {
    return this
      .setName(dto.name)
      .setSlug(toSlug(dto.name))
      .setDescription(dto.description)
      .setIcon(dto.icon)
      .setIsActive(dto.isActive ?? true)
      .setOrder(dto.order ?? 0);
  }

  build(): any {
    return this.data;
  }
}
