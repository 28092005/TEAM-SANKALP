import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Layers,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  X,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Compass,
  Database,
  BarChart3,
  Tag,
  Check,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Structured Inline Formatter for Executive Presentation
const parseInlineFormatting = (line: string, isUser: boolean): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      const code = token.slice(1, -1);
      parts.push(
        <code
          key={match.index}
          className={`font-mono text-[10.5px] px-1.5 py-0.5 rounded font-semibold ${
            isUser ? 'bg-white/20 text-white' : 'bg-slate-900 text-emerald-300'
          }`}
        >
          {code}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong
          key={match.index}
          className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}
        >
          {boldText}
        </strong>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts.length > 0 ? parts : line;
};

const renderStructuredContent = (content: string, isUser: boolean) => {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-1.5" />;
    }

    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      const headerText = trimmed.replace(/^#+\s*/, '');
      return (
        <h4
          key={idx}
          className={`font-bold text-xs mt-2.5 mb-1 flex items-center gap-1.5 ${
            isUser ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0" />
          <span>{parseInlineFormatting(headerText, isUser)}</span>
        </h4>
      );
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const bulletText = trimmed.replace(/^[-*•]\s*/, '');
      return (
        <div key={idx} className="flex items-start gap-2 pl-1 my-1">
          <span
            className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
              isUser ? 'bg-white/70' : 'bg-blue-600'
            }`}
          />
          <span className="flex-1 leading-relaxed text-[11.5px]">
            {parseInlineFormatting(bulletText, isUser)}
          </span>
        </div>
      );
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={idx} className="flex items-start gap-2 pl-1 my-1">
          <span
            className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 shrink-0 ${
              isUser
                ? 'bg-white/20 text-white'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {numMatch[1]}
          </span>
          <span className="flex-1 leading-relaxed text-[11.5px]">
            {parseInlineFormatting(numMatch[2], isUser)}
          </span>
        </div>
      );
    }

    return (
      <p key={idx} className="my-0.5 leading-relaxed text-[11.5px]">
        {parseInlineFormatting(line, isUser)}
      </p>
    );
  });
};

export const AgentAssistant: React.FC = () => {
  const {
    agentMessages,
    isAgentThinking,
    activeExecutionPlan,
    submitUserPrompt,
    clearChat,
    isVoiceEnabled,
    setIsVoiceEnabled,
    isAgentPanelOpen,
    setIsAgentPanelOpen
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [showReasoningMap, setShowReasoningMap] = useState<Record<string, boolean>>({});
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      return;
    }

    setSpeechError(null);

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setInputPrompt(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech was detected. Please try speaking again.');
        } else if (event.error === 'audio-capture') {
          setSpeechError('No microphone detected. Please connect or enable a microphone.');
        } else {
          setSpeechError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechError('Unable to start speech recognition. Please check microphone settings.');
      setIsListening(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [agentMessages, isAgentThinking, activeExecutionPlan]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isAgentThinking) return;
    submitUserPrompt(inputPrompt.trim());
    setInputPrompt('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    submitUserPrompt(suggestion);
  };

  const toggleReasoning = (msgId: string) => {
    setShowReasoningMap((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const defaultSuggestions = [
    'Show Karnataka sales for last quarter',
    'Compare revenue this month vs last month',
    'Top 5 products by revenue',
    'Open the product performance page',
    'Show cancelled orders',
    'Analyze sales trend for 2025',
    'Export this report to CSV'
  ];

  if (!isAgentPanelOpen) {
    return (
      <button
        onClick={() => setIsAgentPanelOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105"
      >
        <Bot className="w-5 h-5" />
        <span className="text-sm font-semibold">Agent Assistant</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  return (
    <aside className="w-80 md:w-96 bg-white border-l border-slate-200 flex flex-col h-screen shrink-0 shadow-lg z-30 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold text-slate-900 tracking-wide">
                AGENT ASSISTANT
              </h2>
              <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Chief BI Analytics Companion</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsVoiceEnabled((prev) => !prev)}
            title={isVoiceEnabled ? 'Mute Speech' : 'Enable Voice Speech'}
            className={`p-1.5 rounded-md transition-colors ${
              isVoiceEnabled
                ? 'bg-blue-100 text-blue-600'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={clearChat}
            title="Clear Chat History"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAgentPanelOpen(false)}
            title="Collapse Panel"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active FSM Action Banner (when executing multi-step) */}
      {activeExecutionPlan && activeExecutionPlan.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 text-xs flex flex-col gap-1 shadow-inner animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between font-semibold text-[11px]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 animate-spin" />
              <span>HostAgent Executing {activeExecutionPlan.length} Subtask(s)</span>
            </span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Tier 3</span>
          </div>
          <div className="space-y-0.5">
            {activeExecutionPlan.map((act) => (
              <div key={act.id} className="flex items-center space-x-1.5 text-[11px] text-blue-50">
                <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />
                <span className="truncate">{act.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/40 text-xs">
        {agentMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[90%] rounded-xl px-3.5 py-2.5 shadow-sm text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : isSystem
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 text-[10px]">
                    <div className="flex items-center space-x-1.5 text-blue-700 font-bold bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-200/60">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>HostAgent BI Orchestrator</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[9px] font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </div>
                  </div>
                )}

                <div className="font-normal space-y-1">
                  {renderStructuredContent(msg.content, isUser)}
                </div>

                {/* Refusal Card (Red/Amber Banner with reason code & clickable suggestions) */}
                {msg.refusal && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-800 flex items-center gap-1.5 text-[11px]">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        Validator Refusal: {msg.refusal.code}
                      </span>
                      <span className="bg-rose-200/70 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                        BLOCKED
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700 leading-tight">
                      {msg.refusal.message}
                    </p>
                    {msg.refusal.suggestions && msg.refusal.suggestions.length > 0 && (
                      <div className="pt-1.5 border-t border-rose-200/60 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-rose-600 block">
                          Suggested Valid Targets:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {msg.refusal.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => submitUserPrompt(sug)}
                              className="text-[10px] bg-white hover:bg-rose-100 text-rose-800 px-2 py-1 rounded border border-rose-200 font-medium cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <Compass className="w-2.5 h-2.5 text-rose-500" />
                              <span>{sug}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Clarification Card (Cyan/Blue with options for typos) */}
                {msg.clarification && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-cyan-50 border border-cyan-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-900 flex items-center gap-1.5 text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
                        {msg.clarification.question}
                      </span>
                      <span className="bg-cyan-200/70 text-cyan-800 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                        TYPO / CLARIFY
                      </span>
                    </div>
                    <div className="pt-1 flex flex-col gap-1">
                      {msg.clarification.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => submitUserPrompt(opt)}
                          className="text-left text-[11px] bg-white hover:bg-cyan-100 text-cyan-900 px-2.5 py-1.5 rounded border border-cyan-200 font-medium cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-1.5">
                            <Compass className="w-3 h-3 text-cyan-500" />
                            <span>{opt}</span>
                          </span>
                          <ArrowRight className="w-3 h-3 text-cyan-500 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data Insights badges with Lucide icons */}
                {msg.dataInsights && msg.dataInsights.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-1 gap-1.5">
                    {msg.dataInsights.map((ins, idx) => {
                      const isNegative = ins.change?.startsWith('-');
                      return (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px]"
                        >
                          <div className="flex items-center space-x-1.5 text-slate-600">
                            <BarChart3 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-medium text-slate-700 truncate">{ins.metric}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 block font-mono">{ins.value}</span>
                            {ins.change && (
                              <span
                                className={`inline-flex items-center gap-0.5 text-[9.5px] font-bold px-1 py-0.2 rounded font-mono ${
                                  isNegative
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {isNegative ? (
                                  <TrendingDown className="w-2.5 h-2.5" />
                                ) : (
                                  <TrendingUp className="w-2.5 h-2.5" />
                                )}
                                <span>{ins.change}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Chain of Thought / Reasoning Toggle */}
                {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                  <div className="mt-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="flex items-center space-x-1 text-[10px] text-blue-600 font-medium hover:underline"
                    >
                      <span>
                        {showReasoningMap[msg.id] ? 'Hide' : 'Inspect'} Agent Chain of Thought (
                        {msg.reasoningSteps.length} steps)
                      </span>
                      {showReasoningMap[msg.id] ? (
                        <ChevronUp className="w-2.5 h-2.5" />
                      ) : (
                        <ChevronDown className="w-2.5 h-2.5" />
                      )}
                    </button>
                    {showReasoningMap[msg.id] && (
                      <div className="mt-1.5 pl-2 border-l-2 border-blue-400 space-y-1 text-[11px] text-slate-600 bg-blue-50/40 p-1.5 rounded">
                        {msg.reasoningSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start space-x-1.5">
                            <span className="text-blue-500 font-mono text-[9px] mt-0.5">
                              {sIdx + 1}.
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isAgentThinking && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs bg-white border border-slate-200 p-2.5 rounded-xl w-fit shadow-sm">
            <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span className="font-medium text-[11px]">
              Orchestrating intent & querying metadata...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Insights Quick Pills */}
      <div className="p-2.5 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            Suggested Insights
          </span>
        </div>
        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
          {defaultSuggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(sug)}
              disabled={isAgentThinking}
              className="w-full text-left px-2.5 py-1.5 rounded-md text-[11px] bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-100 transition-colors flex items-center justify-between group disabled:opacity-50"
            >
              <span className="truncate">{sug}</span>
              <ArrowRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60">
        {speechError && (
          <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center justify-between animate-in fade-in duration-150">
            <span className="flex-1 pr-2 leading-tight">{speechError}</span>
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="text-amber-500 hover:text-amber-800 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isListening && (
          <div className="mb-2 px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-700 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="font-semibold">Listening to speech... Speak now</span>
            </div>
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className="text-xs text-red-600 font-bold hover:underline"
            >
              Stop
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={isListening ? "Listening... speak now into your microphone..." : "Type your request (e.g. 'Show Karnataka sales')"}
              disabled={isAgentThinking}
              className={`w-full text-xs pl-3 pr-9 py-2.5 bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs ${
                isListening ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Stop listening' : 'Start voice input (Click and speak)'}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-sm shadow-red-500/40'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              {isListening ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isAgentThinking}
            className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-all shrink-0 shadow-sm shadow-blue-500/20"
          >
            {isAgentThinking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </form>
      </div>
    </aside>
  );
};
