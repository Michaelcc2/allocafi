# Account Storage Setup

The account service uses Supabase Auth and PostgREST with the user's own token.
No service-role key is needed for account snapshots.

1. Create or select the Allocafi Supabase project.
2. Enable email/password auth and email confirmation. Configure the site's URL
   and allowed redirects in Supabase Auth. Use HTTPS for the hosted app.
3. Run `database/migrations/20260905_account_snapshots.sql` in its SQL editor.
4. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `ALLOCAFI_PUBLIC_ORIGIN` in
   `.env.local` (or the hosting environment). Never commit secret environment files.
   The snapshot service uses Row Level Security with the logged-in user's token,
   so it does not need `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL`.
5. Restart the server. Create an account, confirm the email, and log in.
6. In Settings > Your account, use Import local wallet data to attach the
   pre-existing guest data to an empty signed-in account. It is not imported
   into every account automatically.
7. Verify saving, logout, and restoration in a second browser with the same
   login. Verify that a different user cannot read the first user's snapshot.

Only a Supabase-confirmed `cobinsrn@gmail.com` identity receives creator access
to unlimited budget accounts and complete templates. Its registered master
wallet is `CkSczF3MMJcjNU7XzhXqQEr7mrv7xmroAT95JBpT2gGB`.
Knowing that address does not authenticate anyone or grant creator access.
Creator status does not grant access to other users' data or paid services.

Wallets (including budget accounts and their transactions), goals, contacts,
finance data, and onboarding progress are saved. Subscription entitlements
and authentication tokens are never restored from a client snapshot.

Access and refresh tokens use HttpOnly cookies. Production cookies require
HTTPS. Budget data also has a per-account local cache; logout removes it from
the active workspace, but keeps recovery backups on the device. Browser data
is not an encrypted vault. A failed save stays queued and is shown as unsaved;
logout waits for pending data to save. Conflicts require an explicit reload
of the online version and keep a local recovery snapshot.

Run `node tests/account-service.test.mjs` for isolated backend checks. Live
cross-device verification requires the project and migration above; merely
setting keys does not create the table or policies.
