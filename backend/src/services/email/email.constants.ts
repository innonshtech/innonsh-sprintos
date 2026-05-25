export const EMAIL_MAPPINGS: Record<string, string> = {
  'Saket': 'saket.innonsh@gmail.com',
  'Lokeek': 'lokeek.innonsh@gmail.com',
  'Aniket': 'aniket.innonsh@gmail.com',
  'Chetana': 'chetana.innonsh@gmail.com',
  'Vaibhav': 'vaibhav.innonsh@gmail.com',
  'Yukta': 'yukta.innonsh@gmail.com',
  'Reshma': 'reshma.innonsh@gmail.com',
  'Naisha': 'naisha.innonsh@gmail.com',
};

export const MAIL_FROM = `SprintOS <${process.env.MAIL_USER || 'innonsh.technologies@gmail.com'}>`;
export const MAIL_CC = process.env.MAIL_CC || 'info@innonsh.com';
