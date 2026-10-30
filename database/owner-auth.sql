-- Apply only with an operator/migration credential, not the website's runtime role.
BEGIN;
CREATE SCHEMA IF NOT EXISTS mitch_owner;
REVOKE ALL ON SCHEMA mitch_owner FROM PUBLIC;
CREATE TABLE IF NOT EXISTS mitch_owner.settings (id integer PRIMARY KEY CHECK(id=1),user_id text NOT NULL);
CREATE TABLE IF NOT EXISTS mitch_owner.credential (id integer PRIMARY KEY CHECK(id=1),value text NOT NULL);
CREATE TABLE IF NOT EXISTS mitch_owner.enrollment (id integer PRIMARY KEY CHECK(id=1),token text NOT NULL,expires bigint NOT NULL);
CREATE TABLE IF NOT EXISTS mitch_owner.challenges (nonce text PRIMARY KEY,value text NOT NULL,expires bigint NOT NULL);
CREATE TABLE IF NOT EXISTS mitch_owner.sessions (token text PRIMARY KEY,credential_id text NOT NULL,expires bigint NOT NULL);
CREATE TABLE IF NOT EXISTS mitch_owner.attempts (id integer PRIMARY KEY CHECK(id=1),count integer NOT NULL,until_at bigint NOT NULL);
REVOKE ALL ON ALL TABLES IN SCHEMA mitch_owner FROM PUBLIC;
COMMIT;
-- Seed settings.user_id with 32 random bytes encoded as base64url (operator script).
-- Create a separate LOGIN role for OWNER_DATABASE_URL and grant only:
-- GRANT USAGE ON SCHEMA mitch_owner TO <runtime_role>;
-- GRANT SELECT ON mitch_owner.settings TO <runtime_role>;
-- Row locks require UPDATE permission, but runtime must not change user_id:
-- GRANT UPDATE (id) ON mitch_owner.settings TO <runtime_role>;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON mitch_owner.credential,mitch_owner.enrollment,
--   mitch_owner.challenges,mitch_owner.sessions,mitch_owner.attempts TO <runtime_role>;
-- Do NOT grant CREATE, ALTER, DROP, role management, or privileges on other schemas.
