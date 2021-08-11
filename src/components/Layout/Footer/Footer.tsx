import React, { FC } from "react";
import { strings } from "../../../assets/LocalizedStrings";
import "@mozilla-protocol/core/protocol/css/protocol.css";

interface Link {
  /*Displayed string represents the link*/
  label: string;
  /*URL to which the link redirects*/
  url: string;
}

interface FooterLinksSection {
  /*Array of links to be displayed below the 
  footerLinkSectionName*/
  links: Link[];
  /*Name to be displayed at the top of the footer
  column*/
  footerLinksSectionName: string;
}

export interface FooterProps {
  /**Array of footer columns, each with a name to be displayed at 
  the top of the column, and an array of links to be displayed 
  below the name*/
  footerLinksSections: FooterLinksSection[];
}

function renderFooterLinksSection(footerLinksSection: FooterLinksSection) {
  return (
    <section className="mzp-c-footer-section">
      <h5 className="mzp-c-footer-heading">{footerLinksSection.footerLinksSectionName}</h5>
      <ul>
        {footerLinksSection.links.map((link) => {
          return (
            <li key={link.label}>
              <a href={link.url}>{link.label}</a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const Footer: FC<FooterProps> = ({ footerLinksSections }: FooterProps) => {
  return (
    <footer className="mzp-c-footer">
      <div className="mzp-l-content">
        <nav className="mzp-c-footer-primary" aria-label="footer">
          <div className="mzp-c-footer-sections">
            <section className="mzp-c-footer-section">
              <h5 className="mzp-c-footer-heading">{strings.about}</h5>
              <ul>
                <li>
                  <a href="https://councildataproject.github.io/">CouncilDataProject</a>
                </li>
                <li>
                  <a href="https://github.com/CouncilDataProject">GitHub</a>
                </li>
              </ul>
            </section>
            {footerLinksSections.map((footerLinksSection: FooterLinksSection) => {
              return renderFooterLinksSection(footerLinksSection);
            })}
          </div>
        </nav>

        <nav className="mzp-c-footer-secondary">
          <div className="mzp-c-footer-legal">
            <p className="mzp-c-footer-license">
              {strings.copyright_notice
                .replace("{date_range}", "2017-2021")
                .replace("{copyright_license_type}", "MIT License")}
              <br />
              {strings.styled_using.replace("{style_provider}", "Mozilla Protocol")}{" "}
              {strings.artwork_provided_by.replace("{artwork_provider}", "unDraw")}
            </p>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;