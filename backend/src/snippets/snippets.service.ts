import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Snippet, SnippetDocument } from './entities/snippet.entity';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { FindSnippetsDto } from './dto/find-snippets.dto';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name)
    private readonly snippetModel: Model<SnippetDocument>,
  ) {}

  async create(dto: CreateSnippetDto): Promise<SnippetDocument> {
    return this.snippetModel.create(dto);
  }

  async findAll(query: FindSnippetsDto) {
    const { q, tag, page = 1, limit = 20 } = query;

    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$text = { $search: q };
    }
    if (tag) {
      filter.tags = tag.trim().toLowerCase();
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.snippetModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.snippetModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SnippetDocument> {
    this.assertValidId(id);
    const snippet = await this.snippetModel.findById(id).exec();
    if (!snippet) {
      throw new NotFoundException(`Snippet with id "${id}" not found`);
    }
    return snippet;
  }

  async update(id: string, dto: UpdateSnippetDto): Promise<SnippetDocument> {
    this.assertValidId(id);
    const snippet = await this.snippetModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!snippet) {
      throw new NotFoundException(`Snippet with id "${id}" not found`);
    }
    return snippet;
  }

  async remove(id: string): Promise<void> {
    this.assertValidId(id);
    const result = await this.snippetModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Snippet with id "${id}" not found`);
    }
  }

  private assertValidId(id: string): void {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Snippet with id "${id}" not found`);
    }
  }
}
