import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get a specific element
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const element = await db.savedElement.findUnique({
      where: { id },
    });

    if (!element) {
      return NextResponse.json({ error: 'Element not found' }, { status: 404 });
    }

    return NextResponse.json(element);
  } catch (error) {
    console.error('Failed to fetch element:', error);
    return NextResponse.json({ error: 'Failed to fetch element' }, { status: 500 });
  }
}

// PUT - Update an element
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, category, description, data, tags } = body;

    const element = await db.savedElement.update({
      where: { id },
      data: {
        name,
        type,
        category: category || null,
        description: description || null,
        data: typeof data === 'string' ? data : JSON.stringify(data),
        tags: Array.isArray(tags) ? tags.join(',') : tags || null,
      },
    });

    return NextResponse.json(element);
  } catch (error) {
    console.error('Failed to update element:', error);
    return NextResponse.json({ error: 'Failed to update element' }, { status: 500 });
  }
}

// DELETE - Delete an element
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.savedElement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete element:', error);
    return NextResponse.json({ error: 'Failed to delete element' }, { status: 500 });
  }
}
