export type SnippetType = 'link' | 'note' | 'command';

export type Snippet = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
  createdAt: string;
  updatedAt: string;
};

export type SnippetsResponse = {
  data: Snippet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateSnippetInput = {
  title: string;
  content: string;
  type: SnippetType;
  tags?: string[];
};

export type UpdateSnippetInput = Partial<CreateSnippetInput>;

export type FindSnippetsQuery = {
  q?: string;
  tag?: string;
  page?: number;
  limit?: number;
};
