import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container border-t border-outline-variant py-8 mt-12">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="material-symbols-outlined text-primary-container text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
              <span className="font-headline-md text-headline-md font-bold text-primary">
                MoneyFlow
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Take control of your money
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {['Dashboard', 'Transactions', 'Reports'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {['Documentation', 'Blog', 'Support'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {['Privacy', 'Terms', 'Security'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline-variant pt-8 flex justify-between items-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            © {currentYear} MoneyFlow. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-on-surface-variant hover:text-primary transition-colors"
                title={social}
              >
                <span className="material-symbols-outlined">{social.toLowerCase()}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
