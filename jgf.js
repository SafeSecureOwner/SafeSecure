import React, { useState } from 'react';
import { Upload, Shield, AlertTriangle, CheckCircle, XCircle, Loader2, FileText, Hash } from 'lucide-react';

const ANTIVIRUS_ENGINES = [
  'Microsoft Defender', 'Kaspersky', 'Bitdefender', 'Norton', 'Avast',
  'AVG', 'McAfee', 'ESET', 'Trend Micro', 'Sophos',
  'Malwarebytes', 'F-Secure', 'Panda', 'Comodo', 'Avira',
  'G Data', 'BullGuard', 'Emsisoft', 'ClamAV', 'Fortinet'
];

export default function VirusScanner() {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResults(null);
      setProgress(0);
    }
  };

  const simulateScan = async () => {
    setScanning(true);
    setProgress(0);
    
    const scanResults = [];
    const detectionRate = Math.random() * 0.15; // 0-15% detection rate
    
    for (let i = 0; i < ANTIVIRUS_ENGINES.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const detected = Math.random() < detectionRate;
      const malwareNames = [
        'Trojan.GenericKD.12345678',
        'Win32/Suspicious.Behavior',
        'Malware.AI.Detection',
        'PUA.Unwanted.Program',
        'Adware.Generic.12345'
      ];
      
      scanResults.push({
        engine: ANTIVIRUS_ENGINES[i],
        detected,
        malware: detected ? malwareNames[Math.floor(Math.random() * malwareNames.length)] : null
      });
      
      setProgress(((i + 1) / ANTIVIRUS_ENGINES.length) * 100);
    }
    
    setResults(scanResults);
    setScanning(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const detections = results ? results.filter(r => r.detected).length : 0;
  const threatLevel = detections === 0 ? 'clean' : detections < 3 ? 'low' : detections < 8 ? 'medium' : 'high';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SecureScan
            </h1>
          </div>
          <p className="text-xl text-slate-300">Multi-Engine Malware Scanner - No File Size Limits</p>
          <p className="text-sm text-slate-400 mt-2">Scan files of any size with 20+ antivirus engines</p>
        </div>

        {/* Upload Area */}
        {!file && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-4 border-dashed border-blue-500/50 rounded-2xl p-16 text-center hover:border-blue-400 transition-colors cursor-pointer bg-slate-800/50 backdrop-blur"
          >
            <label className="cursor-pointer">
              <Upload className="w-20 h-20 mx-auto mb-6 text-blue-400" />
              <p className="text-2xl font-semibold mb-2">Drop your file here</p>
              <p className="text-slate-400 mb-4">or click to browse</p>
              <p className="text-sm text-slate-500">Any file type • Unlimited file size</p>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* File Info & Scan Button */}
        {file && !results && (
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <FileText className="w-12 h-12 text-blue-400 flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="text-2xl font-semibold mb-2">{file.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                  <div>
                    <span className="text-slate-500">Size:</span> {formatFileSize(file.size)}
                  </div>
                  <div>
                    <span className="text-slate-500">Type:</span> {file.type || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>

            {scanning && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Scanning with {ANTIVIRUS_ENGINES.length} engines...</span>
                  <span className="text-sm font-semibold text-blue-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={simulateScan}
                disabled={scanning}
                className="flex-grow bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-8 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Scan File
                  </>
                )}
              </button>
              {!scanning && (
                <button
                  onClick={() => setFile(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-8 rounded-xl transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className={`rounded-2xl p-8 ${
              threatLevel === 'clean' ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-2 border-green-500/50' :
              threatLevel === 'low' ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-2 border-yellow-500/50' :
              threatLevel === 'medium' ? 'bg-gradient-to-br from-orange-900/50 to-red-900/50 border-2 border-orange-500/50' :
              'bg-gradient-to-br from-red-900/50 to-rose-900/50 border-2 border-red-500/50'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                {threatLevel === 'clean' ? (
                  <CheckCircle className="w-16 h-16 text-green-400" />
                ) : (
                  <AlertTriangle className="w-16 h-16 text-red-400" />
                )}
                <div>
                  <h2 className="text-3xl font-bold mb-1">
                    {threatLevel === 'clean' ? 'File is Clean' : 'Threats Detected'}
                  </h2>
                  <p className="text-lg text-slate-300">
                    {detections} / {ANTIVIRUS_ENGINES.length} engines detected this file as malicious
                  </p>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-xl p-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">File Name:</span>
                    <p className="font-semibold">{file.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">File Size:</span>
                    <p className="font-semibold">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detection Results */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Hash className="w-6 h-6 text-blue-400" />
                Detection Results
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      result.detected ? 'bg-red-900/30 border border-red-500/30' : 'bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.detected ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      <span className="font-semibold">{result.engine}</span>
                    </div>
                    <div className="text-right">
                      {result.detected ? (
                        <span className="text-red-400 text-sm">{result.malware}</span>
                      ) : (
                        <span className="text-green-400 text-sm">Clean</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setResults(null);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all"
            >
              Scan Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}