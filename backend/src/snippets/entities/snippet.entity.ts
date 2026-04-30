import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SnippetDocument = HydratedDocument<Snippet>;

export type SnippetType = 'link' | 'note' | 'command';

@Schema({ timestamps: true, versionKey: false })
export class Snippet {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: [String],
    default: [],
    set: (tags: string[]) =>
      Array.from(
        new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean)),
      ),
  })
  tags: string[];

  @Prop({ required: true, enum: ['link', 'note', 'command'] })
  type: SnippetType;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

SnippetSchema.index({ title: 'text', content: 'text' });
