export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  credentialId?: string
  /** URL to the verification page or PDF. */
  url?: string
  /** Optional preview image (put it in /public/certs/ and use "/certs/name.png"). */
  image?: string
}

/**
 * Add only verified certificates here. Example:
 * { id: 'aws-ccp', title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services',
 *   date: 'Jan 2026', credentialId: 'XXXX', url: 'https://…', image: '/certs/aws-ccp.png' }
 */
export const certificates: Certificate[] = [
    {
    id: 'docker-essentials',                 // unique, no spaces
    title: 'Docker Essentials: A Developer Introduction',
    issuer: 'IBM · Cognitive Class · CO0101EN',
    date: 'Nov 2026',
    credentialId: '9aeeb3dfdae346bb9f7e41dd197da198',   // optional
    url: 'https://courses.cognitiveclass.ai/certificates/9aeeb3dfdae346bb9f7e41dd197da198', // optional
    image: '/docker-essentials.jpg',   // optional
  },
]
