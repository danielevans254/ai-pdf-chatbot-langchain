'use client';

import dynamic from 'next/dynamic';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { PDFDocument } from '@/types/graphTypes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import JsonViewer from './json-viewer';
import CardView from './card-viewer';
import TableView from './table-viewer';

// Dynamically import react-json-view so it only loads on the client.
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface ChatMessageProps {
  viewType: 'json' | 'table' | 'card';
  message: {
    role: 'user' | 'assistant';
    content: string;
    jsonData?: any;
    sources?: PDFDocument[];
  };
}

const FinancialDataView = ({ data }: { data: any }) => (
  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
    <h3 className="font-semibold mb-2">Extracted Financial Data</h3>
    {Object.entries(data).map(([key, value]) => (
      <div key={key} className="grid grid-cols-3 gap-2">
        <span className="font-medium">{key}:</span>
        <span className="col-span-2">
          {typeof value === 'object' ? (
            <pre className="whitespace-pre-wrap overflow-x-auto text-xs">
              {JSON.stringify(value, null, 2)}
            </pre>
          ) : (
            value?.toString()
          )}
        </span>
      </div>
    ))}
  </div>
);

// Function to detect if a string is valid JSON
const isJsonString = (str: string): boolean => {
  try {
    const json = JSON.parse(str);
    return typeof json === 'object' && json !== null;
  } catch (e) {
    return false;
  }
};

const JsonDisplay = ({ data }: { data: any }) => {
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <h3 className="font-semibold mb-2">Extracted Data</h3>
      <div className="overflow-x-auto">
        <JsonViewer
          data={data}
          initialExpanded={true}
          maxInitialDepth={2}
        />
      </div>
    </div>
  );
};

export function ChatMessage({ message, viewType }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const isLoading = message.role === 'assistant' && message.content === '';

  // Extract text and JSON content from the message
  const jsonContent = (() => {
    // If parsed jsonData is already provided, use that
    if (message.jsonData) {
      return message.jsonData;
    }

    // For assistant messages, if the entire content is valid JSON, use it.
    if (!isUser && isJsonString(message.content)) {
      try {
        return JSON.parse(message.content);
      } catch (e) {
        return null;
      }
    }

    // Check if there's JSON embedded within markdown-style code blocks
    try {
      const jsonRegex = /```json\n([\s\S]*?)\n```/g;
      const matches = [...message.content.matchAll(jsonRegex)];

      if (matches.length > 0) {
        const jsonParts = matches.map(match => JSON.parse(match[1]));
        return jsonParts.length === 1 ? jsonParts[0] : jsonParts;
      }
    } catch (e) {
      // Fallback to null if JSON parsing fails
    }

    return null;
  })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const showSources =
    message.role === 'assistant' &&
    message.sources &&
    message.sources.length > 0;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-full ${isUser ? 'bg-black text-white' : 'bg-muted'} rounded-2xl px-4 py-2`}
      >
        {isLoading ? (
          <div className="flex space-x-1 h-6 items-center">
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-[loading_1s_ease-in-out_infinite]" />
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-[loading_1s_ease-in-out_0.2s_infinite]" />
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-[loading_1s_ease-in-out_0.4s_infinite]" />
          </div>
        ) : (
          <>
            {/* Conditionally render based on selected viewType */}
            {viewType === 'json' && jsonContent && <JsonDisplay data={jsonContent} />}
            {viewType === 'table' && jsonContent && (
              <TableView data={jsonContent} title="Table View" />
            )}
            {viewType === 'card' && jsonContent && typeof jsonContent === 'object' && !Array.isArray(jsonContent) && (
              <CardView data={jsonContent} title="Card View" />
            )}

            {/* Specifically render financial data if available */}
            {message.jsonData && message.jsonData.financialData && (
              <FinancialDataView data={message.jsonData.financialData} />
            )}

            {!isUser && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                  title={copied ? 'Copied!' : 'Copy to clipboard'}
                >
                  <Copy className={`h-4 w-4 ${copied ? 'text-green-500' : ''}`} />
                </Button>
              </div>
            )}
            {/* Uncomment below if you wish to display sources via an Accordion */}
            {/*
            {showSources && message.sources && (
              <Accordion type="single" collapsible className="w-full mt-2">
                <AccordionItem value="sources" className="border-b-0">
                  <AccordionTrigger className="text-sm py-2 justify-start gap-2 hover:no-underline">
                    View Sources ({message.sources.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {message.sources?.map((source, index) => (
                        <Card
                          key={index}
                          className="bg-background/50 transition-all duration-200 hover:bg-background hover:shadow-md hover:scale-[1.02] cursor-pointer"
                        >
                          <CardContent className="p-3">
                            <p className="text-sm font-medium truncate">
                              {source.metadata?.source ||
                                source.metadata?.filename ||
                                'N/A'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Page {source.metadata?.loc?.pageNumber || 'N/A'}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            */}
          </>
        )}
      </div>
    </div>
  );
}
