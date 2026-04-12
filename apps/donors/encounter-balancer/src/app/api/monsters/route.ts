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

// GET - Search/list monster templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const cr = searchParams.get('cr');
    const type = searchParams.get('type');
    const size = searchParams.get('size');
    const isLegendary = searchParams.get('legendary');
    const page = Math.max(1, parseInt(searchParams.get('page') || String(DEFAULT_PAGE)));
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT))));

    // Build where clause
    const where: {
      OR?: Array<{ name: { contains: string } } | { type: { contains: string } } | { tags: { contains: string } }>;
      cr?: string;
      type?: string;
      size?: string;
      isLegendary?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { type: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (cr) {
      where.cr = cr;
    }

    if (type) {
      where.type = type;
    }

    if (size) {
      where.size = size;
    }

    if (isLegendary === 'true') {
      where.isLegendary = true;
    }

    // Get total count
    const totalItems = await db.monsterTemplate.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    // Get monsters
    const monsters = await db.monsterTemplate.findMany({
      where,
      orderBy: [
        { cr: 'asc' },
        { name: 'asc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    const response: PaginatedResponse<typeof monsters[0]> = {
      data: monsters,
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
    console.error('Failed to fetch monsters:', error);
    return NextResponse.json({ error: 'Failed to fetch monsters' }, { status: 500 });
  }
}

// POST - Create a new monster template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cr, xp, size, type, ac, hp, speed, stats, abilities, actions, isLegendary, source, tags } = body;

    if (!name || !cr || !xp || !size || !type) {
      return NextResponse.json({ error: 'Missing required fields: name, cr, xp, size, type' }, { status: 400 });
    }

    const monster = await db.monsterTemplate.create({
      data: {
        name,
        cr,
        xp,
        size,
        type,
        ac: ac || null,
        hp: hp || null,
        speed: speed || null,
        stats: stats ? JSON.stringify(stats) : null,
        abilities: abilities ? JSON.stringify(abilities) : null,
        actions: actions ? JSON.stringify(actions) : null,
        isLegendary: isLegendary || false,
        source: source || null,
        tags: Array.isArray(tags) ? tags.join(',') : tags || null,
      },
    });

    return NextResponse.json(monster, { status: 201 });
  } catch (error) {
    console.error('Failed to create monster:', error);
    return NextResponse.json({ error: 'Failed to create monster' }, { status: 500 });
  }
}
