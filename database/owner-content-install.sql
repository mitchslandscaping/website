-- Install isolated content storage and seed the preserved website content.
-- No passkeys, sessions, fixed website settings, or existing content are changed.
DO $install$
BEGIN
-- Apply as database administrator, never with the website's runtime connection.

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



INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('team', '{"members":[{"_key":"item-0","_type":"teamMember","active":true,"name":"Mitch Pitre","photo":"","role":"Owner"},{"_key":"item-1","_type":"teamMember","active":true,"name":"Marcelle Pate","photo":"","role":"Landscape Designer"},{"_key":"item-2","_type":"teamMember","active":true,"name":"Kieran Pate","photo":"","role":"Operations Manager"},{"_key":"item-3","_type":"teamMember","active":true,"name":"Makenzie Hebert","photo":"","role":"Office Administrator"}]}'::jsonb,gen_random_uuid()) ON CONFLICT(id) DO NOTHING;
INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('project-ranch-training-facility', '{"_id":"project-ranch-training-facility","_type":"project","active":true,"category":"Fencing & Access Control","city":"Gray, LA","completed":"September 2026","description":"Mitch’s installed a 35-foot-tall backstop at The Ranch Training Facility, featuring 6-inch Schedule 40 posts, #36 nylon netting, and a wire rope support system. The installation provides ball containment behind home plate while maintaining clear sightlines across the training field.","order":0,"photos":[{"_key":"item-0","_type":"projectPhoto","alt":"Front view of the completed 35-foot backstop at The Ranch Training Facility","src":"/images/sports-field-fencing.jpg"},{"_key":"item-1","_type":"projectPhoto","alt":"Completed backstop at The Ranch Training Facility viewed from the pitching area","src":"/images/ranch-training-facility/img_3435.jpg"},{"_key":"item-2","_type":"projectPhoto","alt":"Side view of the backstop posts, netting, and support cables","src":"/images/ranch-training-facility/img_3430.jpg"},{"_key":"item-3","_type":"projectPhoto","alt":"Close-up of backstop netting behind home plate","src":"/images/ranch-training-facility/img_3431.jpg"},{"_key":"item-4","_type":"projectPhoto","alt":"Wide view of the backstop surrounding the home plate area","src":"/images/ranch-training-facility/img_3434.jpg"},{"_key":"item-5","_type":"projectPhoto","alt":"Two people beside the completed backstop at The Ranch Training Facility","src":"/images/ranch-training-facility/img_3436.jpg"}],"propertyType":"Sports training facility","serviceSlug":"fencing-access-control","services":["Backstop installation"],"slug":"ranch-training-facility","spotlight":true,"title":"The Ranch Training Facility"}'::jsonb,gen_random_uuid()) ON CONFLICT(id) DO NOTHING;
INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('project-laris-residence', '{"_id":"project-laris-residence","_type":"project","active":true,"category":"Design / Build","city":"Thibodaux, LA","completed":"October 2023","description":"A cohesive landscape installation featuring trees, shrubs, and ornamental grasses arranged to complement the home’s architecture. Defined bed edges and fresh mulch create a polished finish throughout the front landscape and courtyard.","order":1,"photos":[{"_key":"item-0","_type":"projectPhoto","alt":"Completed front landscaping at Laris Residence","src":"/images/laris-residence/photo-14.jpg"},{"_key":"item-1","_type":"projectPhoto","alt":"Finished landscape beds around the curved entrance path","src":"/images/laris-residence/photo-13.jpg"},{"_key":"item-2","_type":"projectPhoto","alt":"Completed courtyard planting beds around the central feature","src":"/images/laris-residence/photo-10.jpg"},{"_key":"item-3","_type":"projectPhoto","alt":"Completed landscaping at the driveway entrance","src":"/images/laris-residence/photo-19.jpg"},{"_key":"item-4","_type":"projectPhoto","alt":"Finished planting along the boundary wall","src":"/images/laris-residence/photo-16.jpg"},{"_key":"item-5","_type":"projectPhoto","alt":"Wide view of the completed corner landscaping","src":"/images/laris-residence/photo-17.jpg"},{"_key":"item-6","_type":"projectPhoto","alt":"New trees and planting beds beside the white boundary wall","src":"/images/laris-residence/photo-18.jpg"},{"_key":"item-7","_type":"projectPhoto","alt":"Curved planting beds with shrubs and ornamental grasses","src":"/images/laris-residence/photo-15.jpg"},{"_key":"item-8","_type":"projectPhoto","alt":"Mulched planting bed alongside the front walkway","src":"/images/laris-residence/photo-11.jpg"},{"_key":"item-9","_type":"projectPhoto","alt":"New shrubs lining the entrance walkway","src":"/images/laris-residence/photo-12.jpg"},{"_key":"item-10","_type":"projectPhoto","alt":"Newly planted beds beside the residence","src":"/images/laris-residence/photo-08.jpg"},{"_key":"item-11","_type":"projectPhoto","alt":"Planting layout along the residence’s white boundary wall","src":"/images/laris-residence/photo-01.jpg"},{"_key":"item-12","_type":"projectPhoto","alt":"Shrubs staged along the corner planting bed","src":"/images/laris-residence/photo-02.jpg"},{"_key":"item-13","_type":"projectPhoto","alt":"Planting preparations beside the entrance walkway","src":"/images/laris-residence/photo-03.jpg"},{"_key":"item-14","_type":"projectPhoto","alt":"Planting layout along the front of Laris Residence","src":"/images/laris-residence/photo-04.jpg"},{"_key":"item-15","_type":"projectPhoto","alt":"Trees and ornamental grasses staged for planting","src":"/images/laris-residence/photo-05.jpg"},{"_key":"item-16","_type":"projectPhoto","alt":"Front landscape beds before planting","src":"/images/laris-residence/photo-06.jpg"},{"_key":"item-17","_type":"projectPhoto","alt":"Tree and shrub installation in progress","src":"/images/laris-residence/photo-07.jpg"},{"_key":"item-18","_type":"projectPhoto","alt":"Courtyard planting work in progress","src":"/images/laris-residence/photo-09.jpg"}],"propertyType":"Residential","serviceSlug":"design-build","services":["Landscape Architecture","Design-Build"],"slug":"laris-residence","spotlight":true,"title":"Laris Residence"}'::jsonb,gen_random_uuid()) ON CONFLICT(id) DO NOTHING;
INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('project-project-02', '{"_id":"project-project-02","_type":"project","active":true,"category":"Construction","description":"Project photos and details are coming soon.","order":2,"serviceSlug":"construction","slug":"project-02","spotlight":true,"title":"Project coming soon","photos":[]}'::jsonb,gen_random_uuid()) ON CONFLICT(id) DO NOTHING;
INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('project-project-04', '{"_id":"project-project-04","_type":"project","active":true,"category":"Maintenance Services","description":"Project photos and details are coming soon.","order":3,"serviceSlug":"maintenance","slug":"project-04","title":"Project coming soon","photos":[]}'::jsonb,gen_random_uuid()) ON CONFLICT(id) DO NOTHING;
INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('project-project-05', '{"_id":"project-project-05","_type":"project","active":true,"category":"Design / Build","description":"Project photos and details are coming soon.","order":4,"serviceSlug":"design-build","slug":"project-05","title":"Project coming soon","photos":[]}'::jsonb,gen_random_uuid()) ON CONFLICT(id) DO NOTHING;
INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('position-lawn-maintenance-crew-lead', '{"_id":"position-lawn-maintenance-crew-lead","_type":"position","active":true,"division":"Lawn Maintenance","id":"lawn-maintenance-crew-lead","order":0,"title":"Lawn Maintenance Crew Lead"}'::jsonb,gen_random_uuid()) ON CONFLICT(id) DO NOTHING;
INSERT INTO mitch_content.documents(id,published,published_revision) VALUES ('position-lawn-maintenance-technician', '{"_id":"position-lawn-maintenance-technician","_type":"position","active":true,"division":"Lawn Maintenance","id":"lawn-maintenance-technician","order":1,"title":"Lawn Maintenance Technician"}'::jsonb,gen_random_uuid()) ON CONFLICT(id) DO NOTHING;


END
$install$;
