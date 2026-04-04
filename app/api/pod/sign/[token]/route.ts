import { supabaseServer } from '@/lib/supabase-server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const { data, error } = await supabaseServer
      .from('pod_submissions')
      .select('*')
      .eq('signing_token', token)
      .limit(1);

    if (error || !data || data.length === 0) {
      return Response.json(
        { error: 'POD not found.' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: data[0],
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}