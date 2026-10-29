-- Maxora · importazione automatica DGT (functions/sync-dgt) ogni 5 minuti
select cron.schedule('maxora-sync-dgt', '*/5 * * * *', $$
  select net.http_post(
    url := 'https://<progetto>.supabase.co/functions/v1/sync-dgt',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-secret',(select value from public.app_secrets where key='cron_secret')),
    body := '{}'::jsonb, timeout_milliseconds := 60000)
$$);
