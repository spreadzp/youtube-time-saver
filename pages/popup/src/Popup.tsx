// Popup.tsx

import '@src/Popup.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { t } from '@extension/i18n';
import { getUserLanguage } from '@extension/storage';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AITab from './components/tabs/AITab';
import AccountTab from './components/tabs/AccountTab';
import FeedbackTab from './components/tabs/FeedbackTab';
import { getIconByName } from './components/icons/Icons';
import HelpTab from './components/tabs/HelpTab';
import YouTubeTab from './components/tabs/YouTubeTab';

const Popup = () => {
  t.devLocale = "ko";
  getUserLanguage()
    .then((language) => console.log('getUserLanguage :>>', language))
  // getUserApiKey()
  //   .then((apiKey) => console.log('getUserApiKey :>>', apiKey))
  const tabs = ['YouTube', 'AI', 'Account', 'Feedback', 'Help'];
  return (
    <div className="bg-slate-50">

      <Tabs>
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab} data-tooltip-id="tab-tooltip"
              data-tooltip-content={tab}>
              {getIconByName(tab)}
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <YouTubeTab />
        </TabPanel>
        <TabPanel>
          <AITab />
        </TabPanel>
        <TabPanel>
          <AccountTab />
        </TabPanel>
        <TabPanel>
          <FeedbackTab />
        </TabPanel>
        <TabPanel>
          <HelpTab />
        </TabPanel>
      </Tabs>
      <Tooltip id="tab-tooltip" />
    </div>
  );
};



export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);