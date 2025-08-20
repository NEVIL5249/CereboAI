-- Create chat_sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comparison_sessions table
CREATE TABLE public.comparison_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  model_ids TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comparison_responses table
CREATE TABLE public.comparison_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.comparison_sessions(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  response TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" 
ON public.chat_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for chat_messages
CREATE POLICY "Users can view messages from their chat sessions" 
ON public.chat_messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.chat_sessions 
  WHERE id = chat_messages.session_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their chat sessions" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.chat_sessions 
  WHERE id = chat_messages.session_id AND user_id = auth.uid()
));

-- Create policies for comparison_sessions
CREATE POLICY "Users can view their own comparison sessions" 
ON public.comparison_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comparison sessions" 
ON public.comparison_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparison sessions" 
ON public.comparison_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for comparison_responses
CREATE POLICY "Users can view responses from their comparison sessions" 
ON public.comparison_responses 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.comparison_sessions 
  WHERE id = comparison_responses.session_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create responses in their comparison sessions" 
ON public.comparison_responses 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.comparison_sessions 
  WHERE id = comparison_responses.session_id AND user_id = auth.uid()
));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_comparison_sessions_user_id ON public.comparison_sessions(user_id);
CREATE INDEX idx_comparison_responses_session_id ON public.comparison_responses(session_id);
