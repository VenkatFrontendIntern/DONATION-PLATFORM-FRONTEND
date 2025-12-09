import { useState, type FC, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Heart,
  ArrowRight,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { newsletterService } from '../../services/newsletterService';

export const Footer: FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await newsletterService.subscribe(email);
      toast.success('Successfully subscribed to newsletter! Check your email for a welcome message.');
      setEmail('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const platformLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Campaigns', to: '/campaigns' },
    { label: 'Create Campaign', to: '/start-campaign' },
  ];

  return (
    <footer className="relative bg-slate-900 text-gray-300 overflow-hidden">
      {/* Background Pattern/Gradient Mesh */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-primary-500 fill-primary-500" />
                <h3 className="text-white font-bold text-2xl">Engala Trust</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                Empowering change through transparent and secure giving. Together, we make a difference.
              </p>

              {/* Newsletter Subscription */}
              <div className="mb-6">
                <h4 className="text-white font-semibold text-sm mb-3">Stay Updated</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px] sm:w-auto"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Social Media Icons */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Follow Us</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-500/50 transition-all duration-200"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Platform Links */}
          <FooterLinkSection title="Platform" links={platformLinks} delay={0.1} />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mb-8"></div>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-4 text-sm text-gray-500 text-center sm:text-left sm:flex-row sm:justify-between"
        >
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span>© {currentYear} Engala Trust. All rights reserved.</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-gray-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary-500 fill-primary-500" />
            <span>by Engala Trust</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Mail className="w-4 h-4" />
            <a
              href="mailto:support@engalatrust.org"
              className="hover:text-primary-400 transition-colors break-all sm:break-normal"
            >
              support@engalatrust.org
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

interface FooterLinkSectionProps {
  title: string;
  links: Array<{ label: string; to: string }>;
  delay?: number;
}

const FooterLinkSection: FC<FooterLinkSectionProps> = ({ title, links, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
            >
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

