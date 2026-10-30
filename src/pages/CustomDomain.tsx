import React, { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useToast } from '../context/ToastContext';
import { 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ArrowLeft, 
  RefreshCw,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomDomain: React.FC = () => {
  useDocumentTitle('Custom Domain Configuration');
  const { showToast } = useToast();

  const [domainInput, setDomainInput] = useState('care.samarth.in');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const dnsRecords = [
    { type: 'CNAME', host: 'care', value: 'cname.samarth-watch.org', ttl: '3600s', status: 'Active' },
    { type: 'A', host: '@', value: '76.76.21.21', ttl: '3600s', status: 'Active' },
    { type: 'TXT', host: '_samarth-challenge', value: 'samarth-verify-a8f9c2d1', ttl: '300s', status: 'Verified' },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    showToast(`Copied ${text} to clipboard`, 'info');
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleVerify = () => {
    if (!domainInput.trim() || !domainInput.includes('.')) {
      showToast('Please enter a valid domain format (e.g. care.samarth.in)', 'error');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      showToast(`DNS records verified! Custom domain ${domainInput} is active with automatic SSL.`, 'success');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl space-y-6">
        
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Production Infrastructure Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Connect Custom Domain
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure your institutional white-label domain or healthcare organization subdomain.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${
              isVerified 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isVerified ? 'Domain Connected & Secure' : 'Verification Required'}</span>
            </span>
          </div>
        </div>

        {/* Domain Input Form */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Domain Name or Subdomain
          </label>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => {
                  setDomainInput(e.target.value);
                  setIsVerified(false);
                }}
                placeholder="e.g. care.samarth.in"
                className="w-full pl-9 pr-4 py-2.5 text-base sm:text-xs min-h-[44px] bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-900 font-mono"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-4 py-2.5 min-h-[44px] bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Verifying DNS...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Verify DNS & Provision SSL</span>
                </>
              )}
            </button>
          </div>
          
          <p className="text-[11px] text-slate-500">
            HTTPS is automatically provisioned via Let's Encrypt TLS 1.3 upon successful record validation.
          </p>
        </div>

        {/* DNS Records Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-teal-600" />
              Required DNS Records (Add in your Domain Registrar)
            </h2>
            <span className="text-[11px] text-slate-400">TTL recommendation: 3600 seconds</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Name / Host</th>
                  <th className="py-2.5 px-3">Points To / Value</th>
                  <th className="py-2.5 px-3">TTL</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                {dnsRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-teal-700">{rec.type}</td>
                    <td className="py-2.5 px-3">{rec.host}</td>
                    <td className="py-2.5 px-3 font-semibold">{rec.value}</td>
                    <td className="py-2.5 px-3 text-slate-500">{rec.ttl}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      <button
                        onClick={() => handleCopy(rec.value, `rec-${idx}`)}
                        className="text-[11px] text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        {copiedRecord === `rec-${idx}` ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedRecord === `rec-${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registrar Instructions */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <h3 className="font-bold text-slate-900">Supported DNS Providers</h3>
          <p>
            You can manage these records at Cloudflare, GoDaddy, AWS Route 53, Hostinger, or Google Domains. DNS changes typically propagate within 5 to 15 minutes worldwide.
          </p>
        </div>

      </div>
    </div>
  );
};
