export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'login': undefined;
  'forgot-password': undefined;
  'dashboard': undefined;
  'report': undefined;
  'history': undefined;
  'threats': undefined;
  'network': undefined;
  'notifications': undefined;
  'profile': undefined;
  'sos': undefined;
  'upload': { caseId?: string } | undefined;
  'case/[id]': { id: string };
  'settings': undefined;
};
