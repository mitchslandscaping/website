-- Apply as database administrator, never with the website's runtime connection.
BEGIN;
CREATE SCHEMA IF NOT EXISTS mitch_content;
REVOKE ALL ON SCHEMA mitch_content FROM PUBLIC;
CREATE TABLE IF NOT EXISTS mitch_content.documents (
 id text PRIMARY KEY CHECK (id='team' OR id ~ '^(project|position)-[a-zA-Z0-9_-]{1,140}$'),
 published jsonb, draft jsonb,
 published_revision uuid, draft_revision uuid,
 CHECK ((published IS NULL) = (published_revision IS NULL)),
 CHECK ((draft IS NULL) = (draft_revision IS NULL)),
 CHECK (published IS NOT NULL OR draft IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS mitch_content.history (
 sequence bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 document_id text NOT NULL, saved_at timestamptz NOT NULL DEFAULT now(),
 snapshot jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS mitch_content.media (
 id uuid PRIMARY KEY, bytes bytea NOT NULL CHECK (octet_length(bytes) <= 1048576),
 content_type text NOT NULL CHECK (content_type='image/webp'),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION mitch_content.record_revision() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, mitch_content AS $$
BEGIN
 INSERT INTO mitch_content.history(document_id,snapshot) VALUES (NEW.id,to_jsonb(NEW));
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION mitch_content.record_revision() FROM PUBLIC;
DROP TRIGGER IF EXISTS record_revision ON mitch_content.documents;
CREATE TRIGGER record_revision AFTER INSERT OR UPDATE ON mitch_content.documents
FOR EACH ROW EXECUTE FUNCTION mitch_content.record_revision();
REVOKE ALL ON ALL TABLES IN SCHEMA mitch_content FROM PUBLIC;
-- No runtime DELETE/TRUNCATE/DDL access or permission to alter revision history.
GRANT USAGE ON SCHEMA mitch_content TO mitch_owner_runtime;
GRANT SELECT, INSERT, UPDATE ON mitch_content.documents TO mitch_owner_runtime;
GRANT SELECT, INSERT ON mitch_content.media TO mitch_owner_runtime;
COMMIT;
