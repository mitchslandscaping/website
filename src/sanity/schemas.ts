import { defineField, defineType } from 'sanity';

const text = (name: string, title: string, multiline = false) => defineField({ name, title, type: multiline ? 'text' : 'string', ...(multiline ? { rows: 3 } : {}) });
const image = (name: string, title: string) => defineField({ name, title, type: 'image', options: { hotspot: true } });
const local = (name: string) => defineField({ name, type: 'string', hidden: true });
const photoFields = [image('srcUpload', 'Photo'), local('src'), text('alt', 'Image description (accessibility)')];
const photo = defineType({ name: 'projectPhoto', title: 'Project photo', type: 'object', fields: photoFields, preview: { select: { title: 'alt', media: 'srcUpload' } } });
const divisions = [
  { title: 'Maintenance Services', value: 'maintenance' }, { title: 'Design / Build', value: 'design-build' },
  { title: 'Construction', value: 'construction' }, { title: 'Fencing & Access Control', value: 'fencing-access-control' },
];
const division = defineField({ name: 'serviceSlug', title: 'Division', type: 'string', options: { list: divisions }, validation: r => r.required() });
const active = defineField({ name: 'active', title: 'Show on website', type: 'boolean', initialValue: true, description: 'Turn off to remove this item from the website without deleting it.' });
const order = defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 10 });
const slug = defineField({ name: 'slug', title: 'Page address', type: 'slug', options: { source: 'title' }, validation: r => r.required() });
const member = defineType({ name: 'teamMember', title: 'Team member', type: 'object', fields: [defineField({name:'name',title:'Name',type:'string',validation:r=>r.required()}), text('role', 'Job title'), image('photoUpload', 'Portrait'), local('photo'), active], preview: { select: { title: 'name', subtitle: 'role', media: 'photoUpload' } } });
const customer = defineType({ name: 'customerLogo', title: 'Customer logo', type: 'object', fields: [text('id', 'Identifier'), local('clipPath'), text('name', 'Customer name'), image('imageUpload', 'Logo'), local('image'), defineField({ name: 'lightBackground', title: 'Light background', type: 'boolean' }), defineField({ name: 'lightMark', title: 'White logo treatment', type: 'boolean' }), defineField({ name: 'crop', type: 'object', hidden: true, fields: ['x','y','width','height','sourceWidth','sourceHeight'].map(name => ({ name, type: 'number' })) })], preview: { select: { title: 'name', media: 'imageUpload' } } });
const website = defineType({ preview: {prepare: () => ({title:'Company, homepage & contact'})}, name: 'website', title: 'Website settings', type: 'document', groups: [{name:'company',title:'Company & contact'},{name:'home',title:'Homepage'},{name:'team',title:'Team'},{name:'customers',title:'Customers & reviews'}], fields: [
  defineField({ name: 'site', title: 'Company content', type: 'object', group: 'company', fields: [text('name', 'Company name'), text('phone', 'Office phone'), text('email', 'Public email'), text('googleBusinessUrl', 'Google Business listing URL'), image('logoUpload','Company logo'), local('logo'),
    defineField({ name:'announcement', title:'Header announcement', type:'object', fields:[defineField({name:'enabled',title:'Show announcement',type:'boolean'}),text('message','Message'),text('action','Action text'),text('service','Selected service')] }),
    defineField({ name:'hero', title:'Homepage hero', type:'object', fields:[text('label','Small heading'),defineField({name:'headline',title:'Headline lines',type:'array',of:[{type:'string'}]}),text('description','Introduction',true),text('note','Short note'),image('imageUpload','Poster image'),local('image'),defineField({name:'videoUpload',title:'Hero video',type:'file',options:{accept:'video/mp4,video/webm'}}),local('video')] }),
    text('story','Company story',true),defineField({name:'aboutPhoto',title:'Company photo',type:'object',fields:[...photoFields,local('position'),defineField({name:'isStock',type:'boolean',hidden:true})]}),
    defineField({name:'serviceAreas',title:'Service areas (city names)',type:'array',of:[{type:'string'}]}),
    defineField({name:'team',title:'Team members',description:'Add an employee with Add item. Enter their name, job title, and optional portrait. Drag to reorder. Turn off Show on website to hide someone, then publish. The roster fits three employees per row on desktop and creates new rows automatically.',type:'array',of:[{type:'teamMember'}]}),
    defineField({name:'trustedBy',title:'Trusted by',type:'object',fields:[defineField({name:'enabled',title:'Show customer logos',type:'boolean'}),text('heading','Heading'),defineField({name:'logos',title:'Customer logos',type:'array',of:[{type:'customerLogo'}]})]}),
    defineField({name:'reviews',title:'Review excerpts',type:'array',of:[{type:'object',fields:[text('author','Author'),text('quote','Verified excerpt',true)]}]}),
  ]}),
  defineField({name:'office',title:'Contact page',type:'object',group:'company',fields:[text('street','Street address'),text('cityLine','City, state and ZIP'),text('weekdays','Weekdays'),text('weekdayHours','Weekday hours'),text('weekend','Weekend days'),text('weekendHours','Weekend hours'),text('directionsUrl','Directions URL'),defineField({name:'banner',title:'Contact banner',type:'object',fields:photoFields})]}),
  defineField({name:'home',title:'Homepage text',type:'object',group:'home',fields:[text('aboutHeading','Company heading',true),text('aboutIntro','Company introduction'),text('aboutDetail','Company supporting text',true),text('teamHeading','Team heading'),text('teamIntro','Team introduction',true),text('servicesHeading','Services heading'),text('servicesIntro','Services introduction',true),text('portfolioHeading','Portfolio heading'),text('portfolioIntro','Portfolio page introduction',true),text('careersHeading','Careers heading'),text('careersIntro','Careers introduction',true),text('closingHeading','Blue section heading'),text('closingIntro','Blue section introduction',true),text('responseNote','Response expectation')]}),
] });
const service = defineType({name:'serviceDivision',title:'Service division',type:'document',fields:[text('title','Division name'),slug,local('id'),local('number'),text('label','Short label'),text('cardDescription','Homepage summary',true),text('description','Introduction',true),text('introHeading','Page heading'),image('imageUpload','Banner photo'),local('image'),text('alt','Banner image description'),order,
 defineField({name:'services',title:'Services in this division',type:'array',of:[{type:'object',name:'divisionService',fields:[text('name','Service name'),text('description','Description',true),image('imageUpload','Service photo'),local('image'),text('alt','Image description'),local('position')],preview:{select:{title:'name',media:'imageUpload'}}}]})
]});
const project = defineType({name:'project',title:'Project',type:'document',fields:[text('title','Project name'),slug,active,order,defineField({name:'spotlight',title:'Spotlight project',type:'boolean',description:'Show among the large featured projects on the homepage and portfolio.'}),division,text('category','Division label'),text('description','Short project description',true),text('propertyType','Property type'),text('city','Location (city and state)'),text('completed','Completed (month and year)'),defineField({name:'services',title:'Services performed',type:'array',of:[{type:'string'}]}),defineField({name:'photos',title:'Project photos',description:'The first photo is the spotlight image. Drag to reorder.',type:'array',of:[{type:'projectPhoto'}]})], preview:{select:{title:'title',subtitle:'city',media:'photos.0.srcUpload'}},orderings:[{title:'Display order',name:'order',by:[{field:'order',direction:'asc'}]}]});
const position = defineType({name:'position',title:'Job opening',type:'document',fields:[local('id'),defineField({name:'title',title:'Position title',type:'string',validation:r=>r.required()}),text('division','Division'),defineField({name:'active',title:'Accepting applications',type:'boolean',initialValue:true,description:'Turn off and publish to hide this opening. Previous Fillout applications are retained.'}),order],preview:{select:{title:'title',active:'active'},prepare:({title,active})=>({title,subtitle:active?'Open for applications':'Closed'})}});
// Retain imported fixed content in the schema, but expose only the roster.
const teamWebsite = defineType({
  ...website,
  title: 'Team members',
  groups: [],
  preview: {prepare: () => ({title:'Team members'})},
  fields: website.fields.map(field => {
    if (field.name === 'site' && 'fields' in field && Array.isArray(field.fields)) {
      return {...field, title:'Our team', group:undefined, fields:field.fields.map(child =>
        child.name === 'team' ? child : {...child, hidden:true, readOnly:true}
      )};
    }
    return {...field, group:undefined, hidden:true, readOnly:true};
  }),
});
export const schemaTypes = [teamWebsite, {...service,readOnly:true},project,position,photo,member,customer];
