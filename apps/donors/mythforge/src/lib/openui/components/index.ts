import { registry } from '../registry';
import { z } from 'zod';
import DraftCard from './DraftCard';
import ChatLayout from './ChatLayout';
import EntityForm from './EntityForm';
import SchemaConfirmation from './SchemaConfirmation';
import RelationshipSuggestion from './RelationshipSuggestion';
import ConsistencyIssue from './ConsistencyIssue';
import CategorySuggestion from './CategorySuggestion';
import GraphAnalysis from './GraphAnalysis';
import OpenUIRenderer from './OpenUIRenderer';

// Loose prop schemas used to validate incoming component props at runtime.
const DraftCardSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  category: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  markdown: z.string().optional(),
  tags: z.array(z.string()).optional(),
  validationErrors: z.record(z.string(), z.string()).optional(),
});

const ChatLayoutSchema = z.object({
  messages: z.array(z.any()),
  isLoading: z.boolean().optional(),
  streamingContent: z.string().optional(),
});

const EntityFormSchema = z.object({
  category: z.string(),
  initialData: z.record(z.string(), z.any()).optional(),
});

const SchemaConfirmationSchema = z.object({
  title: z.string(),
  description: z.string(),
  field: z.string().optional(),
  fieldType: z.string().optional(),
  required: z.boolean().optional(),
});

const RelationshipSuggestionSchema = z.object({
  sourceTitle: z.string(),
  targetTitle: z.string(),
  relationshipType: z.string(),
  reason: z.string().optional(),
});

const ConsistencyIssueSchema = z.object({
  severity: z.string(),
  title: z.string(),
  description: z.string(),
  entityIds: z.array(z.string()).optional(),
  entityTitles: z.array(z.string()).optional(),
});

const CategorySuggestionSchema = z.object({
  suggestions: z.array(z.object({
    category: z.string().optional(),
    group: z.string().optional(),
    reason: z.string().optional(),
    fields: z.array(z.object({
      name: z.string().optional(),
      type: z.string().optional(),
      defaultValue: z.any().optional(),
    })).optional(),
  })),
});

const GraphAnalysisSchema = z.object({
  summary: z.string().optional(),
  orphanCount: z.number().optional(),
  orphanTitles: z.array(z.string()).optional(),
  clusterTitles: z.array(z.string()).optional(),
});

// Register components with the runtime registry so dynamic renders work.
registry.register('DraftCard', DraftCard, DraftCardSchema);
registry.register('ChatLayout', ChatLayout, ChatLayoutSchema);
registry.register('EntityForm', EntityForm, EntityFormSchema);
registry.register('SchemaConfirmation', SchemaConfirmation, SchemaConfirmationSchema);
registry.register('RelationshipSuggestion', RelationshipSuggestion, RelationshipSuggestionSchema);
registry.register('ConsistencyIssue', ConsistencyIssue, ConsistencyIssueSchema);
registry.register('CategorySuggestion', CategorySuggestion, CategorySuggestionSchema);
registry.register('GraphAnalysis', GraphAnalysis, GraphAnalysisSchema);

export {
  DraftCard,
  ChatLayout,
  EntityForm,
  SchemaConfirmation,
  RelationshipSuggestion,
  ConsistencyIssue,
  CategorySuggestion,
  GraphAnalysis,
  OpenUIRenderer,
};
const openuiComponents = {
  DraftCard,
  ChatLayout,
  EntityForm,
  SchemaConfirmation,
  RelationshipSuggestion,
  ConsistencyIssue,
  CategorySuggestion,
  GraphAnalysis,
  OpenUIRenderer,
};

export default openuiComponents;
