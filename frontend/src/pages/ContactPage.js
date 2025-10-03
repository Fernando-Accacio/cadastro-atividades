import React from 'react';
import ContactForm from '../components/ContactForm';

function ContactPage() {
  return (
    <div className="container">
      {/* O componente ContactForm agora vive dentro desta página */}
      <ContactForm />
    </div>
  );
}

export default ContactPage;