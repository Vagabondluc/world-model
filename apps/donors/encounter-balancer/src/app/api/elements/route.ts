import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// GET - List all saved elements with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const page = Math.max(1, parseInt(searchParams.get('page') || String(DEFAULT_PAGE)));
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT))));

    const where: {
      OR?: Array<{ name: { contains: string }; description: { contains: string }; tags: { contains: string } }>;
      type?: string;
    } = {};

    if (type && type !== 'all') {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    // Get total count for pagination metadata
    const totalItems = await db.savedElement.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    const elements = await db.savedElement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const response: PaginatedResponse<typeof elements[0]> = {
      data: elements,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch elements:', error);
    return NextResponse.json({ error: 'Failed to fetch elements' }, { status: 500 });
  }
}

// POST - Create a new saved element
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, category, description, data, tags } = body;

    if (!name || !type || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const element = await db.savedElement.create({
      data: {
        name,
        type,
        category: category || null,
        description: description || null,
        data: typeof data === 'string' ? data : JSON.stringify(data),
        tags: Array.isArray(tags) ? tags.join(',') : tags || null,
      },
    });

    return NextResponse.json(element, { status: 201 });
  } catch (error) {
    console.error('Failed to create element:', error);
    return NextResponse.json({ error: 'Failed to create element' }, { status: 500 });
  }
}
