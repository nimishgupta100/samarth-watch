import React, { useEffect, useRef } from 'react';

const N8N_WEBHOOK = 'https://karisishma-1.app.n8n.cloud/webhook/bc8200be-63f4-4370-ac0c-fc4cab4da37d';
const N8N_CSS = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
const N8N_JS = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

const CSS_ID = 'n8n-chat-css';

/**
 * Deviathon AI Assistant n8n Chat Widget
 * Embedded in Senior Portal with exact webhook & greeting parameters provided.
 */
export const N8nChatWidget: React.FC<{ language?: string }> = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    // 1. Inject n8n stylesheet if not already present
    if (!document.getElementById(CSS_ID)) {
      const link = document.createElement('link');
      link.id = CSS_ID;
      link.rel = 'stylesheet';
      link.href = N8N_CSS;
      document.head.appendChild(link);
    }

    // 2. Initialize n8n chat via dynamic ES module import
    if (!initializedRef.current) {
      initializedRef.current = true;

      // Use native dynamic import with vite-ignore so bundler leaves the URL intact
      // @ts-ignore
      import(/* @vite-ignore */ N8N_JS)
        .then((module: any) => {
          if (module && typeof module.createChat === 'function') {
            module.createChat({
              webhookUrl: N8N_WEBHOOK,
              target: '#n8n-chat',
              mode: 'window',
              chatTitle: 'Deviathon AI Assistant',
              welcomeMessage: 'Namaste! How can I help you and your coordinator today?',
              initialMessages: [
                'Namaste! How can I help you and your coordinator today?'
              ],
              i18n: {
                en: {
                  title: 'Deviathon AI Assistant',
                  subtitle: 'Online',
                  footer: 'Powered by n8n',
                  getStarted: 'New Conversation',
                  inputPlaceholder: 'Type your message here...',
                },
              },
            });
          }
        })
        .catch((err: any) => {
          console.warn('n8n Chat dynamic import error:', err);
          // Fallback: append module script tag if dynamic import is blocked
          const scriptId = 'n8n-chat-script-fallback';
          if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.type = 'module';
            script.textContent = `
              import { createChat } from '${N8N_JS}';
              createChat({
                webhookUrl: '${N8N_WEBHOOK}',
                target: '#n8n-chat',
                mode: 'window',
                chatTitle: 'Deviathon AI Assistant',
                welcomeMessage: 'Namaste! How can I help you and your coordinator today?',
                initialMessages: [
                  'Namaste! How can I help you and your coordinator today?'
                ],
                i18n: {
                  en: {
                    title: 'Deviathon AI Assistant',
                    subtitle: 'Online',
                    footer: 'Powered by n8n',
                    getStarted: 'New Conversation',
                    inputPlaceholder: 'Type your message here...',
                  },
                },
              });
            `;
            document.head.appendChild(script);
          }
        });
    }
  }, []);

  return (
    <>
      {/* Target container for n8n chat widget */}
      <div id="n8n-chat" />

      {/* Style overrides so the widget sits above the 80px SOS bottom bar and matches design */}
      <style>{`
        #n8n-chat {
          --chat--color-primary: #1C3F32;
          --chat--color-secondary: #2E6B56;
          --chat--toggle--background: #1C3F32;
          --chat--toggle--hover--background: #132A22;
          --chat--toggle--active--background: #132A22;
          --chat--toggle--color: #ffffff;
          --chat--toggle--bottom: 96px;
          --chat--toggle--right: 20px;
          --chat--window--bottom: 96px;
          --chat--window--right: 20px;
          --chat--z-index: 9990;
        }
        /* Fallback positioning for n8n chat toggle button if CSS vars are not mapped */
        .chat-widget-toggle,
        #n8n-chat button[class*="toggle"],
        #n8n-chat div[class*="toggle"] {
          bottom: 96px !important;
          right: 20px !important;
          z-index: 9990 !important;
        }
        .chat-window,
        #n8n-chat div[class*="window"] {
          bottom: 96px !important;
          right: 20px !important;
          z-index: 9995 !important;
        }
      `}</style>
    </>
  );
};

export default N8nChatWidget;
