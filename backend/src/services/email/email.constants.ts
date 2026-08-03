export const EMAIL_MAPPINGS: Record<string, string> = {
  'Saket': 'saket.innonsh@gmail.com',
  'Lokeek': 'lokeek.innonsh@gmail.com',
  'Vaibhav': 'vaibhav.innonsh@gmail.com',
  'Ashish Jain': 'ashish.jain@hyperlocalventures.com',
  'Pratik Kotangale': 'kotangale.pratik18@dmsiitd.org',
  'Shashank Mohore': 'shashank.mohore@hyperlocalventures.com',
};

export const MAIL_FROM = `SprintOS <${process.env.MAIL_USER || 'innonsh.technologies@gmail.com'}>`;
export const MAIL_CC = process.env.MAIL_CC || 'info@innonsh.com';
