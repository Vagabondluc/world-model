
export const componentStyles = {
  button: {
    base: 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
    primary: 'bg-amber-700 text-white font-bold py-3 px-4 hover:bg-amber-800 transition-transform transform hover:scale-105 shadow-lg',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    icon: 'w-9 h-9 rounded-md flex items-center justify-center focus:outline-none focus:ring-2',
    toggle: 'px-4 py-2 rounded-md border-2 bg-gray-100 text-gray-700 border-gray-300 hover:bg-amber-100 hover:border-amber-400',
    toggleActive: 'bg-amber-600 text-white border-amber-800',
    eraBase: 'flex items-center gap-3 px-4 py-2 rounded-md font-semibold transition-all duration-200 ease-in-out transform hover:-translate-y-1 shadow-md border-b-4',
    eraCompleted: 'bg-green-600 text-white border-green-800 hover:bg-green-500',
    eraCurrent: 'bg-amber-600 text-white border-amber-800 ring-4 ring-amber-300 ring-offset-2 ring-offset-amber-900',
    eraLocked: 'bg-gray-400 text-gray-200 border-gray-600 cursor-not-allowed',
    eraAvailable: 'bg-blue-600 text-white border-blue-800 hover:bg-blue-500',
    menuTrigger: 'p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors',
  },
  card: {
    base: 'bg-white p-4 rounded-lg shadow-sm border flex flex-col',
    interactive: 'hover:shadow-md hover:border-amber-400 transition-all cursor-pointer',
    page: 'bg-white p-10 rounded-xl shadow-2xl w-full border-t-8 border-amber-600',
  },
  input: {
    base: 'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white text-gray-900 disabled:bg-gray-100',
    range: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600',
  },
  form: {
    label: 'block text-sm font-medium text-gray-700 mb-1',
  },
  dropdown: {
    menu: 'absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in-down',
    item: 'w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md',
  },
  layout: {
    centeredCard: 'min-h-screen flex items-center justify-center bg-gray-200 relative',
    contentBoxMain: 'w-full p-8 bg-white rounded-lg shadow-xl border-t-4 border-amber-600',
    filterBar: 'mb-4 p-4 bg-gray-50 rounded-lg border flex flex-col md:flex-row gap-4 items-center',
  },
  header: {
    main: 'bg-amber-900 text-amber-100 p-4 shadow-lg sticky top-0 z-50',
  },
  navigation: {
    container: 'flex items-center gap-2 bg-amber-900/50 p-1 rounded-lg',
    button: 'px-4 py-2 rounded-md font-semibold transition-colors duration-200',
    buttonActive: 'bg-amber-700 text-white',
    buttonInactive: 'bg-amber-800 hover:bg-amber-700',
  },
  pillBadge: 'text-sm font-semibold text-amber-200 bg-amber-800/70 px-3 py-1 rounded-full whitespace-nowrap',
  table: {
    container: 'overflow-x-auto my-4 rounded-lg border border-gray-200 shadow-sm',
    base: 'min-w-full divide-y-2 divide-gray-200 bg-white text-sm',
    header: 'bg-amber-50',
    th: 'whitespace-nowrap px-4 py-3 text-left font-semibold text-amber-900',
    td: 'px-4 py-3 text-gray-700',
    body: 'divide-y divide-gray-200',
    row: 'hover:bg-amber-50/50',
  },
  sectionHeader: 'text-3xl font-bold text-amber-800 border-b-2 border-amber-200 pb-2 mb-4',
  ruleText: 'text-gray-700 leading-relaxed',
  referenceLink: 'text-amber-800 underline font-bold hover:text-amber-600 bg-none border-none p-0 cursor-pointer',
  toggleGroup: 'flex items-center gap-1 bg-gray-200 p-1 rounded-lg',
  toggleBtn: 'px-3 py-1 rounded-md transition-colors text-gray-600 hover:bg-gray-300',
  toggleBtnActive: 'bg-white shadow text-amber-800 font-semibold',
  progressBar: {
      track: 'w-full bg-gray-600 rounded-full h-4',
      fill: 'bg-green-500 h-full rounded-full transition-all duration-500',
  },
  modal: {
      overlay: 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]',
      content: 'bg-white p-6 rounded-lg shadow-2xl m-4 overflow-y-auto max-h-[90vh]',
  }
};

/**
 * Safely retrieves a style token from the componentStyles object.
 * Usage: getStyle('button.primary')
 */
export const getStyle = (path: string, fallback: string = ''): string => {
  const keys = path.split('.');
  let result: any = componentStyles;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      console.warn(`Style token not found: ${path}`);
      return fallback;
    }
  }
  
  return typeof result === 'string' ? result : fallback;
};

export default componentStyles;
