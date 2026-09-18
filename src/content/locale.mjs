// Shared routing and editorial translations. Both languages build to real HTML.
import { pages, services, steps, faqs } from './site.mjs';
export const languages = ['nl', 'en'];
export const translate = lang => (nl, en) => lang === 'en' ? en : nl;
const englishPaths = { home:'/en/', expertise:'/en/expertise/', about:'/en/about-lex/', network:'/en/network/', contact:'/en/contact/', privacy:'/en/privacy/', notfound:'/en/404.html' };
export function route(key, lang = 'nl') {
  if (!pages[key]) throw new Error('Unknown page: ' + key);
  return lang === 'en' ? englishPaths[key] : pages[key].path;
}
const metadata = {
  home:['Bridge2Connect | Connecting business with Defence & Security','Lex de Lange helps companies navigate the Defence and Security sector through sector insight, relevant introductions and personal advice.'],
  expertise:['Expertise | Bridge2Connect','Understand the sector, reach the right people and connect your solution with a real need. How Lex de Lange can support your company.'],
  about:['About Lex de Lange | Bridge2Connect','A former serviceman and qualified commando with experience working with Defence and Security from within large and small IT companies.'],
  network:['Network & collaboration | Bridge2Connect','Professional relationships within and around the Defence and Security sector. Companies and collaborations connected with Bridge2Connect.'],
  contact:['Meet Lex | Bridge2Connect','Discuss your company and your question about the Defence and Security sector with Lex de Lange.'],
  privacy:['Privacy & website information | Bridge2Connect','How this website works, how the contact process handles your information and where the images come from.'],
  notfound:['Page not found | Bridge2Connect','This page could not be found. Return to Bridge2Connect.'],
};
export function pageInfo(key, lang = 'nl') {
  if (!languages.includes(lang)) throw new Error('Unsupported language: ' + lang);
  return { ...pages[key], key, lang, path:route(key,lang), ...(lang === 'en' ? {title:metadata[key][0],description:metadata[key][1]} : {}) };
}
export function navigationFor(lang = 'nl') {
  const t=translate(lang);
  return [{key:'expertise',label:t('Expertise','Expertise')},{key:'about',label:t('Over Lex','About Lex')},{key:'network',label:t('Netwerk','Network')}].map(item=>({...item,href:route(item.key,lang)}));
}
const englishServices = [
  { id:'sectorinzicht', title:'Understanding the sector', short:'Establish where your offering fits the needs, working practices and decision-making of the sector.', heading:'See your offering from the sector’s perspective.', question:'Where does our offering meet the needs of the sector?', results:['Clear positioning','Insight into relevant challenges','A well-founded starting point for discussion'], paragraphs:['The Defence and Security sector has its own language, ways of working and decision-making processes. A strong solution is only part of the picture. It also needs to fit the organisation’s day-to-day work and actual requirements.','Lex helps you look at your offering from that perspective. What does it solve? Who is it relevant to? What is a sensible first step? This helps you explain your value and take a more focused approach.'] },
  { id:'verbinding', title:'Connecting the right people', short:'Move from an initial point of contact to a conversation with people who can help you progress.', heading:'Find relevant contacts and partners.', question:'Who should we speak to in order to move forward?', results:['Relevant points of contact','Connections with potential partners','Conversations grounded in the right context'], paragraphs:['The sector involves people with different perspectives: users, specialists, management and commercial partners. Who you speak to, when you approach them and what you ask all make a difference.','Through his network within and around the sector, Lex helps you find relevant contacts and potential partners. He understands how conversations at different organisational levels fit together: the practical side of multi-level selling.'] },
  { id:'samenwerking', title:'From a need to collaboration', short:'Connect what an organisation needs with what your company can genuinely provide.', heading:'Translate a need into a suitable solution.', question:'How do we turn a useful conversation into a meaningful next step?', results:['A shared understanding of the need','Clear expectations','Practical next steps'], paragraphs:['A need is not always described in the same terms as a solution. Lex brings the two sides together: what is the underlying challenge, what can your company contribute and where might other partners be needed?','From that shared starting point, he helps shape the next steps, with attention to the people, expectations and conditions involved. The aim is to build a sound collaboration, not to promise instant results.'] },
];
const englishSteps = [
  {title:'Getting to know your company',text:'We start with your company, your solution and the question you would like to explore. Understanding comes before advice.'},
  {title:'Choosing a direction',text:'We look at where your offering fits, which people and partners are relevant and what a useful next step could be.'},
  {title:'Connecting and following through',text:'We bring the relevant perspectives together and agree practical next steps, with attention to the working relationship.'},
];
const englishFaqs = [
  {question:'Which companies does Bridge2Connect support?',answer:'Companies looking to do business with the Defence and Security sector who could use support. This may involve an initial exploration, finding relevant contacts or developing an existing collaboration.'},
  {question:'Do we need to be active in Defence already?',answer:'No. A conversation can also be useful while you are still exploring the sector. We start with your company and where your solution could fit.'},
  {question:'What happens in an initial conversation?',answer:'We discuss what your company does, your experience with the sector and where you need support. We then consider whether and how Lex could contribute. The scope of any work and the terms are agreed separately.'},
  {question:'Does an introduction guarantee a contract?',answer:'No. A relevant introduction can make a conversation possible, but it does not guarantee a contract or a particular outcome. Bridge2Connect focuses on a good fit and carefully developed working relationships.'},
];
export const servicesFor = (lang='nl') => lang === 'en' ? englishServices : services;
export const stepsFor = (lang='nl') => lang === 'en' ? englishSteps : steps;
export const faqsFor = (lang='nl') => lang === 'en' ? englishFaqs : faqs;
export function subjectOptions(lang='nl') {
  const t=translate(lang);
  return [
    {value:'Een eerste kennismaking',label:t('Een eerste kennismaking','An initial conversation')},
    ...servicesFor(lang).map((item,i)=>({value:services[i].title,label:item.title})),
    {value:'Een andere vraag',label:t('Een andere vraag','Another question')},
  ];
}
