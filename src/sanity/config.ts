'use client';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'mitchs-website', title: 'Mitch’s Landscaping', basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'notconfigured',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool({title:'Manage content',structure: S => S.list().title('Website editor').items([
    S.listItem().title('Team members').child(S.document().schemaType('website').documentId('website')),
    S.divider(), S.documentTypeListItem('project').title('Projects & spotlight'), S.documentTypeListItem('position').title('Job openings'),
  ])}), ...(process.env.NEXT_PUBLIC_SANITY_PREVIEW_ENABLED === 'true' ? [presentationTool({title:'Preview website',previewUrl:{initial:'/#team-heading',previewMode:{enable:'/api/draft-mode/enable',disable:'/api/draft-mode/disable'}},resolve:{locations:{project:defineLocations({select:{title:'title',slug:'slug.current'},resolve:doc=>({locations:[{title:doc?.title || 'Project',href:doc?.slug ? `/portfolio/${doc.slug}` : '/portfolio'},{title:'Portfolio',href:'/portfolio'}]})}),position:defineLocations({locations:[{title:'Careers',href:'/#careers'}]}),website:defineLocations({locations:[{title:'Our team',href:'/#team-heading'}]})}}})] : [])],
  tools: tools => tools.filter(tool => ['presentation','structure'].includes(tool.name)).sort((a, b) => Number(b.name === 'presentation') - Number(a.name === 'presentation')),
  schema: { types: schemaTypes },
  document: { actions: (actions, context) => context.schemaType === 'website' ? actions.filter(action => !['delete','unpublish','duplicate'].includes(action.action || '')) : context.schemaType === 'serviceDivision' ? [] : actions, newDocumentOptions: (options) => options.filter(option => ['project','position'].includes(option.templateId)) },
});
