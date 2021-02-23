import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, Dropdown, ButtonToolbar, Navbar, Icon } from 'rsuite';
import { locales } from '../i18n';

export default function LanguagePicker() {
  //Set Up translation hook
  const [t, i18n] = useTranslation();

  const languageArr = i18n.language.split('-');
  const languageKey = languageArr.length >= 1 ? languageArr[0] : i18n.language;

  return (
    <Fragment>
      <Dropdown
        icon={<Icon icon="globe" />}
        title={t('languageName')}
        onSelect={(key) => i18n.changeLanguage(key)}
        placement="bottomEnd"
      >
        {locales.map((lang, key) => (
          <Dropdown.Item key={key} eventKey={lang.key}>
            <b>{lang.key}</b> &middot; {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </Fragment>
  );
}
