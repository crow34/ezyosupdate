import React, { useState } from 'react';
import { Globe, Plus, X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
}

const Browser: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'https://www.google.com' }
  ]);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [inputUrl, setInputUrl] = useState<string>('https://www.google.com');

  const addTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'https://www.google.com'
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setInputUrl('https://www.google.com');
  };

  const removeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    if (newTabs.length === 0) {
      addTab();
    } else if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
      setInputUrl(newTabs[0].url);
    }
    setTabs(newTabs);
  };

  const navigate = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab) {
      let url = inputUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      const newTabs = tabs.map(tab =>
        tab.id === activeTab ? { ...tab, url, title: url } : tab
      );
      setTabs(newTabs);
    }
  };

  const getCurrentTab = () => tabs.find(tab => tab.id === activeTab);

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-100 px-2">
        <div className="flex-1 flex items-center space-x-2 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setInputUrl(tab.url);
              }}
              className={`flex items-center gap-2 px-4 py-2 max-w-[200px] ${
                activeTab === tab.id
                  ? 'bg-white border-t border-x border-gray-200'
                  : 'hover:bg-gray-200'
              } rounded-t-lg cursor-pointer group`}
            >
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-sm">{tab.title}</span>
              <button
                onClick={(e) => removeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 hover:bg-gray-300 p-1 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addTab}
          className="p-2 hover:bg-gray-200 rounded-full ml-2"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-t border-gray-200">
        <button className="p-1.5 hover:bg-gray-200 rounded-full">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded-full">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded-full">
          <RotateCcw className="w-4 h-4" />
        </button>
        <form onSubmit={navigate} className="flex-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
          />
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white">
        {getCurrentTab() && (
          <iframe
            src={getCurrentTab()?.url}
            className="w-full h-full border-none"
            title={getCurrentTab()?.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default Browser;