import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get a specific encounter
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const encounter = await db.encounter.findUnique({
      where: { id },
    });

    if (!encounter) {
      return NextResponse.json({ error: 'Encounter not found' }, { status: 404 });
    }

    return NextResponse.json(encounter);
  } catch (error) {
    console.error('Failed to fetch encounter:', error);
    return NextResponse.json({ error: 'Failed to fetch encounter' }, { status: 500 });
  }
}

// PUT - Update an encounter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, description, data } = body;

    const encounter = await db.encounter.update({
      where: { id },
      data: {
        name,
        type,
        description: description || null,
        data: typeof data === 'string' ? data : JSON.stringify(data),
      },
    });

    return NextResponse.json(encounter);
  } catch (error) {
    console.error('Failed to update encounter:', error);
    return NextResponse.json({ error: 'Failed to update encounter' }, { status: 500 });
  }
}

// DELETE - Delete an encounter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.encounter.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete encounter:', error);
    return NextResponse.json({ error: 'Failed to delete encounter' }, { status: 500 });
  }
}
