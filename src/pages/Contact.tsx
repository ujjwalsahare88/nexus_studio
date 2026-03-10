import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { photographerInfo } from '@/data/photographer';
import { ContactForm } from '@/components/forms/ContactForm';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/seo/SEOHead';

/**
 * Contact page with form and contact information
 * Features validated contact form and availability status
 */
export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact"
        description={`Get in touch with ${photographerInfo.name} for photography inquiries, collaborations, and project bookings. ${photographerInfo.availability}`}
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
      <section className="py-24 md:py-32 px-6 lg:px-8 border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide mb-4">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
              Let's discuss your next project
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0.8, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-light tracking-wide">
                  Send a Message
                </h2>
                <p className="text-muted-foreground font-light">
                  Fill out the form below and I'll get back to you within 24-48 hours. {photographerInfo.availability}
                </p>
              </div>

              <ContactForm />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0.8, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-light tracking-wide">
                  Contact Information
                </h2>
                <p className="text-muted-foreground font-light">
                  Prefer to reach out directly? Here's how you can contact me.
                </p>
              </div>

              <Separator />

              {/* Contact Details */}
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-sm bg-accent">
                    <Mail className="size-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light tracking-wide text-muted-foreground">
                      Email
                    </p>
                    <a
                      href={`mailto:${photographerInfo.email}`}
                      className="text-base md:text-lg font-light hover:text-muted-foreground transition-colors"
                    >
                      {photographerInfo.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-sm bg-accent">
                    <Phone className="size-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light tracking-wide text-muted-foreground">
                      Phone
                    </p>
                    <a
                      href={`tel:${photographerInfo.phone}`}
                      className="text-base md:text-lg font-light hover:text-muted-foreground transition-colors"
                    >
                      {photographerInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-sm bg-accent">
                    <MapPin className="size-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light tracking-wide text-muted-foreground">
                      Location
                    </p>
                    <p className="text-base md:text-lg font-light">
                      {photographerInfo.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </>
  );
}
