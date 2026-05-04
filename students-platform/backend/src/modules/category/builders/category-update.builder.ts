import type { UpdateCategoryDTO } from '../types';
import { toSlug } from '../../../shared/utils/slug';

export class CategoryUpdateBuilder {
  private data: any = {};

  setName(name: string): this {
    this.data.name = name;
    if (!this.data.slug) {
      this.data.slug = toSlug(name);
    }
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

  fromDTO(dto: UpdateCategoryDTO): this {
    return this
      .setName(dto.name!)
      .setSlug(dto.slug || toSlug(dto.name!))
      .setDescription(dto.description)
      .setIcon(dto.icon)
      .setIsActive(dto.isActive!)
      .setOrder(dto.order!);
  }

  build(): any {
    return this.data;
  }
}
