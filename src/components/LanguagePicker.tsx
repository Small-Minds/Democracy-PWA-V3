import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, Dropdown, ButtonToolbar, Navbar, Icon } from 'rsuite';
import { locales } from '../i18n';

export default function LanguagePicker() {
  //Set Up translation hook
  const [t, i18n] = useTranslation();

  // Returns true in development.
  const dev: boolean = useMemo(() => {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === ''
    );
  }, []);

  // TODO: Re-enable all other languages once
  return (
    <Fragment>
      <Dropdown
        icon={<Icon icon="globe" />}
        title={t('languageName')}
        onSelect={(key) => i18n.changeLanguage(key)}
        placement="bottomEnd"
      >
        {locales.map((lang, key) => (
          <Dropdown.Item
            key={key}
            eventKey={lang.key}
            disabled={lang.key !== 'en' && !dev}
          >
            <b>{lang.key}</b> &middot; {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </Fragment>
  );
}
