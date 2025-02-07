import { Contact } from '../types';

export const getContactNameSurname = (id: number, contacts: Contact[]): string => {
  const contact = contacts.find((c) => c.id === id);
  return contact ? `${contact.name} ${contact.surname}` : '';
};
