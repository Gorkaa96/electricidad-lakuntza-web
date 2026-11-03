import 'server-only';

// "accepted" means accepted by the mail provider, never proof of delivery.
export async function recordNotificationResult(client, table, id, accepted) {
  if (!['commercial_leads', 'invoice_review_leads'].includes(table)) return false;
  try {
    const { data, error } = await client.from(table).update({
      notification_status: accepted ? 'accepted' : 'failed',
    }).eq('id', id).select('id').maybeSingle();
    if (error || !data) {
      console.error('[intake-notification] Status not persisted; inspect pending requests', error?.code || 'missing');
      return false;
    }
    return true;
  } catch (error) {
    console.error('[intake-notification] Status unavailable', error?.name || 'unknown');
    return false;
  }
}
