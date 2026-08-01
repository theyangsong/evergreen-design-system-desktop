/** Cregis 场景：EgNavBar 声明式 props 默认值（与文档代码片段一致）。 */
export const cregisNavBarDeclarativeProps = {
  moduleCount: 8,
  appEntryCount: 2,
  corporationTitle: 'Fat-Test',
  corporationSubtitle: 'Basic',
  avatarInitials: 'A',
  moduleLabel1: 'Wallet',
  moduleLabel2: 'Tasks',
  moduleLabel3: 'WaaS',
  moduleLabel4: 'Payment Engine',
  moduleLabel5: 'Report',
  moduleLabel6: 'Risk Control',
  moduleLabel7: 'Manage',
  moduleLabel8: 'Marketplace',
  moduleIcon1: 'eds-wallet',
  moduleFocusIcon1: 'eds-wallet-fill',
  moduleIcon2: 'eds-circulation',
  moduleFocusIcon2: 'eds-circulation-fill',
  moduleIcon3: 'eds-floder-favorite',
  moduleFocusIcon3: 'eds-floder-favorite-fill',
  moduleIcon4: 'eds-global-payments',
  moduleFocusIcon4: 'eds-global-payments-fill',
  moduleIcon5: 'eds-bill',
  moduleFocusIcon5: 'eds-bill-fill',
  moduleIcon6: 'eds-database-safety',
  moduleFocusIcon6: 'eds-database-safety-fill',
  moduleIcon7: 'eds-categorization',
  moduleFocusIcon7: 'eds-categorization-fill',
  moduleIcon8: 'eds-app-ecology',
  moduleFocusIcon8: 'eds-app-ecology-fill',
  appEntryLabel1: 'UniChain',
  appEntryIcon1: 'eds-application-22',
  appEntryFocusIcon1: 'eds-application-22',
  appEntryLabel2: 'MetaMask',
  appEntryIcon2: 'eds-application-5',
  appEntryFocusIcon2: 'eds-application-5',
} as const;

export const cregisNavBarUsageSnippet = `<EgNavBar
  wide
  module-count="8"
  app-entry-count="2"
  corporation-title="Fat-Test"
  corporation-subtitle="Basic"
  avatar-initials="A"
  module-label1="Wallet"
  module-label2="Tasks"
  module-label3="WaaS"
  module-label4="Payment Engine"
  module-label5="Report"
  module-label6="Risk Control"
  module-label7="Manage"
  module-label8="Marketplace"
  module-icon1="eds-wallet"
  module-focus-icon1="eds-wallet-fill"
  module-icon2="eds-circulation"
  module-focus-icon2="eds-circulation-fill"
  module-icon3="eds-floder-favorite"
  module-focus-icon3="eds-floder-favorite-fill"
  module-icon4="eds-global-payments"
  module-focus-icon4="eds-global-payments-fill"
  module-icon5="eds-bill"
  module-focus-icon5="eds-bill-fill"
  module-icon6="eds-database-safety"
  module-focus-icon6="eds-database-safety-fill"
  module-icon7="eds-categorization"
  module-focus-icon7="eds-categorization-fill"
  module-icon8="eds-app-ecology"
  module-focus-icon8="eds-app-ecology-fill"
  app-entry-label1="UniChain"
  app-entry-icon1="eds-application-22"
  app-entry-focus-icon1="eds-application-22"
  app-entry-label2="MetaMask"
  app-entry-icon2="eds-application-5"
  app-entry-focus-icon2="eds-application-5"
/>`;
