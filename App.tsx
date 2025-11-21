import React, { useState, useCallback } from 'react';
import { TaskPaneLayout } from './components/TaskPaneLayout';
import { TablePreview } from './components/TablePreview';
import { generateTableFromPrompt } from './services/geminiService';
import { downloadCSV, copyTableToClipboard } from './utils/exportUtils';
import { TableData, AppState } from './types';
import { Loader2, Download, ClipboardCopy, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const SUGGESTIONS = [
  "Monthly sales data for 2024 by region",
  "Comparison of renewable energy sources",
  "Project timeline for a website launch",
  "Nutritional breakdown of common fruits"
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<TableData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setStatus(AppState.LOADING);
    setErrorMsg("");
    setData(null);

    try {
      const result = await generateTableFromPrompt(prompt);
      setData(result);
      setStatus(AppState.SUCCESS);
    } catch (e: any) {
      setErrorMsg(e.message || "An unknown error occurred");
      setStatus(AppState.ERROR);
    }
  }, [prompt]);

  const handleCopy = async () => {
    if (status !== AppState.SUCCESS) return;
    const success = await copyTableToClipboard("generated-table");
    if (success) {
      showToast("Table copied! Paste into Word (Ctrl+V).");
    } else {
      showToast("Failed to copy to clipboard.");
    }
  };

  const handleDownload = () => {
    if (data) {
      downloadCSV(data);
      showToast("CSV downloaded.");
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <TaskPaneLayout title="Excel Generator">
      
      <div className="space-y-5">
        
        {/* Input Section */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Describe the table you need
          </label>
          <textarea
            id="prompt"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm min-h-[100px] shadow-sm resize-none"
            placeholder="e.g., Create a budget table for a marketing campaign..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          {status === AppState.IDLE && (
            <div className="flex flex-wrap gap-2 mt-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(s)}
                  className="text-xs bg-white border border-gray-200 hover:border-green-400 hover:text-green-700 text-gray-600 px-2 py-1 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={status === AppState.LOADING || !prompt.trim()}
          className={`w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${
            status === AppState.LOADING
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {status === AppState.LOADING ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="-ml-1 mr-2 h-4 w-4" />
              Generate Table
            </>
          )}
        </button>

        {/* Error State */}
        {status === AppState.ERROR && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Result Section */}
        {status === AppState.SUCCESS && data && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Preview</h2>
              <span className="text-xs text-gray-500">{data.rows.length} rows generated</span>
            </div>

            <TablePreview data={data} />

            <div className="grid grid-cols-2 gap-3 pt-2 sticky bottom-0 bg-gray-50 pb-2">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ClipboardCopy className="h-4 w-4 mr-2 text-gray-500" />
                Copy to Word
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow-lg text-sm flex items-center whitespace-nowrap z-50 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
          {toastMsg}
        </div>
      )}
      
    </TaskPaneLayout>
  );
}
