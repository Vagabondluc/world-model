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

// GET - List all encounters with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = Math.max(1, parseInt(searchParams.get('page') || String(DEFAULT_PAGE)));
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT))));

    const where: { type?: string } = {};
    if (type) {
      where.type = type;
    }

    // Get total count for pagination metadata
    const totalItems = await db.encounter.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    const encounters = await db.encounter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const response: PaginatedResponse<typeof encounters[0]> = {
      data: encounters,
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
    console.error('Failed to fetch encounters:', error);
    return NextResponse.json({ error: 'Failed to fetch encounters' }, { status: 500 });
  }
}

// POST - Create a new encounter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description, data } = body;

    if (!name || !type || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const encounter = await db.encounter.create({
      data: {
        name,
        type,
        description: description || null,
        data: typeof data === 'string' ? data : JSON.stringify(data),
      },
    });

    return NextResponse.json(encounter, { status: 201 });
  } catch (error) {
    console.error('Failed to create encounter:', error);
    return NextResponse.json({ error: 'Failed to create encounter' }, { status: 500 });
  }
}
