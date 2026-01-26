/**
 * Supabase Data Layer
 * Production-ready data access layer for RealCo platform
 *
 * This module provides typed CRUD operations for all main entities,
 * real-time subscriptions, and helper functions for common queries.
 */

import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// =============================================================================
// RESULT TYPES - Standardized response types for all operations
// =============================================================================

export interface DataResult<T> {
  data: T | null;
  error: DataError | null;
}

export interface DataListResult<T> {
  data: T[];
  count: number | null;
  error: DataError | null;
}

export interface DataError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

// =============================================================================
// ENUMS - Database enum types
// =============================================================================

export type ProjectPhase =
  | 'PRE_CONSTRUCTION'
  | 'FOUNDATION'
  | 'FRAMING'
  | 'MEP_ROUGH_IN'
  | 'ENCLOSURE'
  | 'INTERIOR_FINISH'
  | 'CLOSEOUT'
  | 'COMPLETED';

export type TaskStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WeatherCondition =
  | 'CLEAR'
  | 'CLOUDY'
  | 'RAIN'
  | 'SNOW'
  | 'WIND'
  | 'EXTREME_HEAT'
  | 'EXTREME_COLD'
  | 'OTHER';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFYING'
  | 'QUALIFIED'
  | 'NEGOTIATING'
  | 'UNDER_CONTRACT'
  | 'CLOSED'
  | 'LOST'
  | 'COLD';

export type LeadScore = 'HOT' | 'WARM' | 'COLD';

export type LeadSource =
  | 'BROKER'
  | 'LOOPNET'
  | 'COSTAR'
  | 'CREXI'
  | 'DIRECT_MAIL'
  | 'COLD_CALL'
  | 'REFERRAL'
  | 'WEBSITE'
  | 'AI_SOURCED'
  | 'NETWORKING'
  | 'AUCTION'
  | 'OTHER';

export type DealStage =
  | 'SOURCING'
  | 'INITIAL_REVIEW'
  | 'UNDERWRITING'
  | 'DUE_DILIGENCE'
  | 'NEGOTIATION'
  | 'UNDER_CONTRACT'
  | 'CLOSING'
  | 'CLOSED'
  | 'PASSED';

export type PropertyType =
  | 'MULTIFAMILY'
  | 'COMMERCIAL'
  | 'INDUSTRIAL'
  | 'RETAIL'
  | 'OFFICE'
  | 'MIXED_USE'
  | 'LAND'
  | 'HOSPITALITY';

export type PropertyStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'UNDER_CONTRACT'
  | 'SOLD'
  | 'OFF_MARKET'
  | 'COMING_SOON';

export type OfferingStatus = 'draft' | 'active' | 'funded' | 'closed' | 'cancelled';

export type RegulationMode = '506b' | '506c' | 'internal';

export type TransactionType =
  | 'INVESTMENT'
  | 'DISTRIBUTION'
  | 'REFUND'
  | 'FEE'
  | 'DRAW_REQUEST'
  | 'PROVIDER_PAYMENT'
  | 'TRANSFER'
  | 'DEPOSIT'
  | 'WITHDRAWAL';

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'ON_HOLD'
  | 'REQUIRES_APPROVAL';

export type PaymentMethod = 'ACH' | 'WIRE' | 'CHECK' | 'CARD' | 'INTERNAL';

export type DistributionType =
  | 'RETURN_OF_CAPITAL'
  | 'PREFERRED_RETURN'
  | 'PROFIT_SPLIT'
  | 'SPECIAL_DISTRIBUTION'
  | 'EXIT_PROCEEDS';

export type DistributionStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'PARTIALLY_COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type InvestmentStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

// =============================================================================
// ENTITY TYPES - Database entity interfaces
// =============================================================================

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationData {
  name: string;
}

export interface UpdateOrganizationData {
  name?: string;
}

export interface Property {
  id: string;
  org_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  county?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  type: PropertyType;
  sub_type?: string | null;
  status: PropertyStatus;
  units?: number | null;
  sqft?: number | null;
  lot_size?: number | null;
  year_built?: number | null;
  parking_spaces?: number | null;
  stories?: number | null;
  asking_price: number;
  cap_rate?: number | null;
  noi?: number | null;
  price_per_unit?: number | null;
  price_per_sqft?: number | null;
  occupancy?: number | null;
  deal_stage?: DealStage | null;
  is_saved: boolean;
  notes?: string | null;
  tags: string[];
  source?: string | null;
  source_url?: string | null;
  listing_date?: string | null;
  days_on_market?: number | null;
  photos: string[];
  documents: string[];
  created_by_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyData {
  org_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  county?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  type: PropertyType;
  sub_type?: string | null;
  status?: PropertyStatus;
  units?: number | null;
  sqft?: number | null;
  lot_size?: number | null;
  year_built?: number | null;
  parking_spaces?: number | null;
  stories?: number | null;
  asking_price: number;
  cap_rate?: number | null;
  noi?: number | null;
  source?: string | null;
  source_url?: string | null;
  tags?: string[];
  created_by_id?: string | null;
}

export interface UpdatePropertyData extends Partial<Omit<CreatePropertyData, 'org_id'>> {
  deal_stage?: DealStage | null;
  is_saved?: boolean;
  notes?: string | null;
  photos?: string[];
  documents?: string[];
}

export interface Lead {
  id: string;
  org_id: string;
  property_id?: string | null;
  property_name: string;
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  property_type: string;
  status: LeadStatus;
  score: LeadScore;
  probability: number;
  estimated_value: number;
  target_price?: number | null;
  source: LeadSource;
  source_details?: string | null;
  contacts: LeadContact[];
  assigned_to_id?: string | null;
  expected_close_date?: string | null;
  actual_close_date?: string | null;
  last_contact_date?: string | null;
  next_follow_up_date?: string | null;
  next_action?: string | null;
  next_action_due_date?: string | null;
  tags: string[];
  notes?: string | null;
  pipeline_stage?: string | null;
  stage_entered_at?: string | null;
  days_in_stage: number;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface LeadContact {
  id: string;
  name: string;
  type: 'OWNER' | 'BROKER' | 'AGENT' | 'ATTORNEY' | 'PROPERTY_MANAGER' | 'OTHER';
  company?: string | null;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  is_primary: boolean;
  notes?: string | null;
}

export interface CreateLeadData {
  org_id: string;
  property_name: string;
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  property_type: string;
  property_id?: string | null;
  estimated_value: number;
  target_price?: number | null;
  source: LeadSource;
  source_details?: string | null;
  contacts?: Omit<LeadContact, 'id'>[];
  assigned_to_id?: string | null;
  tags?: string[];
  notes?: string | null;
  created_by_id: string;
}

export interface UpdateLeadData extends Partial<Omit<CreateLeadData, 'org_id' | 'created_by_id'>> {
  status?: LeadStatus;
  score?: LeadScore;
  probability?: number;
  expected_close_date?: string | null;
  last_contact_date?: string | null;
  next_follow_up_date?: string | null;
  next_action?: string | null;
  next_action_due_date?: string | null;
  pipeline_stage?: string | null;
}

export interface Deal {
  id: string;
  org_id: string;
  property_id?: string | null;
  lead_id?: string | null;
  name: string;
  stage: DealStage;
  value: number;
  probability: number;
  expected_close_date?: string | null;
  actual_close_date?: string | null;
  assigned_to_id?: string | null;
  notes?: string | null;
  tags: string[];
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDealData {
  org_id: string;
  property_id?: string | null;
  lead_id?: string | null;
  name: string;
  stage?: DealStage;
  value: number;
  probability?: number;
  expected_close_date?: string | null;
  assigned_to_id?: string | null;
  notes?: string | null;
  tags?: string[];
  created_by_id: string;
}

export interface UpdateDealData extends Partial<Omit<CreateDealData, 'org_id' | 'created_by_id'>> {}

export interface Offering {
  id: string;
  org_id: string;
  name: string;
  status: OfferingStatus;
  regulation_mode: RegulationMode;
  description?: string | null;
  target_raise?: number | null;
  minimum_investment?: number | null;
  target_return?: string | null;
  hold_period?: string | null;
  asset_type?: string | null;
  location?: string | null;
  current_raised?: number | null;
  investor_count?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOfferingData {
  org_id: string;
  name: string;
  status?: OfferingStatus;
  regulation_mode: RegulationMode;
  description?: string | null;
  target_raise?: number | null;
  minimum_investment?: number | null;
  target_return?: string | null;
  hold_period?: string | null;
  asset_type?: string | null;
  location?: string | null;
}

export interface UpdateOfferingData extends Partial<Omit<CreateOfferingData, 'org_id'>> {}

export interface Project {
  id: string;
  project_code: string;
  development_project_id: string;
  phase: ProjectPhase;
  percent_complete: number;
  planned_start_date?: string | null;
  planned_end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  total_budget?: number | null;
  spent_to_date: number;
  schedule_variance_days?: number | null;
  cost_variance?: number | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  development_project?: DevelopmentProject;
}

export interface DevelopmentProject {
  id: string;
  org_id: string;
  offering_id?: string | null;
  name: string;
  address?: string | null;
  project_type?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  project_code: string;
  development_project_id: string;
  phase?: ProjectPhase;
  planned_start_date?: string | null;
  planned_end_date?: string | null;
  total_budget?: number | null;
}

export interface UpdateProjectData extends Partial<Omit<CreateProjectData, 'development_project_id'>> {
  percent_complete?: number;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  spent_to_date?: number;
  schedule_variance_days?: number | null;
  cost_variance?: number | null;
}

export interface Task {
  id: string;
  project_id: string;
  parent_id?: string | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  percent_complete: number;
  planned_start_date?: string | null;
  planned_end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  duration_days?: number | null;
  predecessor_task_ids: string[];
  lag_days: number;
  is_critical_path: boolean;
  budget_amount?: number | null;
  actual_cost?: number | null;
  assigned_to_id?: string | null;
  attachment_urls: string[];
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  project_id: string;
  parent_id?: string | null;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  planned_start_date?: string | null;
  planned_end_date?: string | null;
  duration_days?: number | null;
  predecessor_task_ids?: string[];
  lag_days?: number;
  is_critical_path?: boolean;
  budget_amount?: number | null;
  assigned_to_id?: string | null;
  attachment_urls?: string[];
}

export interface UpdateTaskData extends Partial<Omit<CreateTaskData, 'project_id'>> {
  percent_complete?: number;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  actual_cost?: number | null;
}

export interface DailyLog {
  id: string;
  project_id: string;
  log_date: string;
  weather?: WeatherCondition | null;
  temperature?: number | null;
  labor_count?: LaborCountEntry[] | null;
  equipment_used: string[];
  materials_delivered?: string | null;
  work_completed?: string | null;
  issues_delays?: string | null;
  visitor_log?: string | null;
  safety_observations?: string | null;
  created_by_id?: string | null;
  photo_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface LaborCountEntry {
  trade: string;
  count: number;
}

export interface CreateDailyLogData {
  project_id: string;
  log_date: string;
  weather?: WeatherCondition | null;
  temperature?: number | null;
  labor_count?: LaborCountEntry[] | null;
  equipment_used?: string[];
  materials_delivered?: string | null;
  work_completed?: string | null;
  issues_delays?: string | null;
  visitor_log?: string | null;
  safety_observations?: string | null;
  created_by_id?: string | null;
  photo_urls?: string[];
}

export interface UpdateDailyLogData extends Partial<Omit<CreateDailyLogData, 'project_id'>> {}

export interface Transaction {
  id: string;
  offering_id?: string | null;
  from_user_id?: string | null;
  to_user_id?: string | null;
  bank_account_id?: string | null;
  escrow_account_id?: string | null;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  stripe_payment_id?: string | null;
  plaid_transfer_id?: string | null;
  description: string;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  fee_amount?: number | null;
  net_amount: number;
  initiated_at: string;
  processed_at?: string | null;
  completed_at?: string | null;
  failed_at?: string | null;
  cancelled_at?: string | null;
  error_message?: string | null;
  created_by?: string | null;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionData {
  offering_id?: string | null;
  from_user_id?: string | null;
  to_user_id?: string | null;
  bank_account_id?: string | null;
  escrow_account_id?: string | null;
  transaction_type: TransactionType;
  amount: number;
  currency?: string;
  payment_method: PaymentMethod;
  description: string;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  fee_amount?: number | null;
  created_by?: string | null;
}

export interface Distribution {
  id: string;
  offering_id: string;
  escrow_account_id?: string | null;
  distribution_type: DistributionType;
  distribution_date: string;
  period_start?: string | null;
  period_end?: string | null;
  total_amount: number;
  status: DistributionStatus;
  calculations?: Record<string, unknown> | null;
  created_by?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  processed_at?: string | null;
  completed_at?: string | null;
  failed_at?: string | null;
  error_message?: string | null;
  notification_sent: boolean;
  notification_sent_at?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDistributionData {
  offering_id: string;
  escrow_account_id?: string | null;
  distribution_type: DistributionType;
  distribution_date: string;
  period_start?: string | null;
  period_end?: string | null;
  total_amount: number;
  calculations?: Record<string, unknown> | null;
  created_by?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface Investment {
  id: string;
  investor_id: string;
  offering_id: string;
  investment_amount: number;
  current_balance: number;
  returned_capital: number;
  preferred_return_rate: number;
  preferred_return_owed: number;
  preferred_return_paid: number;
  profits_paid: number;
  status: InvestmentStatus;
  funded_at?: string | null;
  completed_at?: string | null;
  ownership_percentage?: number | null;
  equity_shares?: number | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvestmentData {
  investor_id: string;
  offering_id: string;
  investment_amount: number;
  preferred_return_rate?: number;
  ownership_percentage?: number | null;
  equity_shares?: number | null;
  metadata?: Record<string, unknown> | null;
}

export interface DashboardMetrics {
  total_properties: number;
  active_deals: number;
  total_pipeline_value: number;
  total_invested: number;
  total_distributions: number;
  active_projects: number;
  projects_on_schedule: number;
  open_tasks: number;
  leads_by_status: Record<LeadStatus, number>;
  deals_by_stage: Record<DealStage, number>;
  monthly_transactions: MonthlyTransactionSummary[];
}

export interface MonthlyTransactionSummary {
  month: string;
  investments: number;
  distributions: number;
  count: number;
}

export interface PortfolioSummary {
  total_invested: number;
  current_value: number;
  total_gain: number;
  total_gain_percent: number;
  weighted_avg_irr: number;
  portfolio_tvpi: number;
  active_investments: number;
  properties: number;
  funds: number;
  investments: InvestmentSummary[];
}

export interface InvestmentSummary {
  id: string;
  offering_name: string;
  invested_amount: number;
  current_value: number;
  return_to_date: number;
  status: InvestmentStatus;
}

// =============================================================================
// HELPER FUNCTIONS - Error handling and response formatting
// =============================================================================

function formatError(error: unknown): DataError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: (error as { code?: string }).code,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
    };
  }
  return { message: String(error) };
}

function handleSupabaseResult<T>(
  data: T | null,
  error: { message: string; code?: string; details?: string; hint?: string } | null
): DataResult<T> {
  if (error) {
    return { data: null, error: formatError(error) };
  }
  return { data, error: null };
}

function handleSupabaseListResult<T>(
  data: T[] | null,
  count: number | null,
  error: { message: string; code?: string; details?: string; hint?: string } | null
): DataListResult<T> {
  if (error) {
    return { data: [], count: null, error: formatError(error) };
  }
  return { data: data || [], count, error: null };
}

// =============================================================================
// ORGANIZATIONS
// =============================================================================

export async function getOrganization(id: string): Promise<DataResult<Organization>> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createOrganization(
  data: CreateOrganizationData
): Promise<DataResult<Organization>> {
  const { data: result, error } = await supabase
    .from('organizations')
    .insert(data)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateOrganization(
  id: string,
  data: UpdateOrganizationData
): Promise<DataResult<Organization>> {
  const { data: result, error } = await supabase
    .from('organizations')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

// =============================================================================
// PROPERTIES
// =============================================================================

export interface GetPropertiesOptions {
  limit?: number;
  offset?: number;
  status?: PropertyStatus;
  type?: PropertyType;
  dealStage?: DealStage;
  savedOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  search?: string;
  sortBy?: 'created_at' | 'asking_price' | 'cap_rate' | 'days_on_market';
  sortOrder?: 'asc' | 'desc';
}

export async function getProperties(
  orgId: string,
  options: GetPropertiesOptions = {}
): Promise<DataListResult<Property>> {
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId);

  if (options.status) {
    query = query.eq('status', options.status);
  }
  if (options.type) {
    query = query.eq('type', options.type);
  }
  if (options.dealStage) {
    query = query.eq('deal_stage', options.dealStage);
  }
  if (options.savedOnly) {
    query = query.eq('is_saved', true);
  }
  if (options.minPrice !== undefined) {
    query = query.gte('asking_price', options.minPrice);
  }
  if (options.maxPrice !== undefined) {
    query = query.lte('asking_price', options.maxPrice);
  }
  if (options.city) {
    query = query.ilike('city', `%${options.city}%`);
  }
  if (options.state) {
    query = query.eq('state', options.state);
  }
  if (options.search) {
    query = query.or(
      `name.ilike.%${options.search}%,address.ilike.%${options.search}%`
    );
  }

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function getProperty(id: string): Promise<DataResult<Property>> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createProperty(
  data: CreatePropertyData
): Promise<DataResult<Property>> {
  const { data: result, error } = await supabase
    .from('properties')
    .insert({
      ...data,
      is_saved: false,
      tags: data.tags || [],
      photos: [],
      documents: [],
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateProperty(
  id: string,
  data: UpdatePropertyData
): Promise<DataResult<Property>> {
  const { data: result, error } = await supabase
    .from('properties')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function deleteProperty(id: string): Promise<DataResult<null>> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  return handleSupabaseResult(null, error);
}

// =============================================================================
// LEADS
// =============================================================================

export interface GetLeadsOptions {
  limit?: number;
  offset?: number;
  status?: LeadStatus | LeadStatus[];
  score?: LeadScore | LeadScore[];
  source?: LeadSource | LeadSource[];
  assignedToId?: string;
  minValue?: number;
  maxValue?: number;
  needsFollowUp?: boolean;
  search?: string;
  sortBy?: 'created_at' | 'updated_at' | 'estimated_value' | 'probability' | 'next_follow_up_date';
  sortOrder?: 'asc' | 'desc';
}

export async function getLeads(
  orgId: string,
  options: GetLeadsOptions = {}
): Promise<DataListResult<Lead>> {
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId);

  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status);
    } else {
      query = query.eq('status', options.status);
    }
  }
  if (options.score) {
    if (Array.isArray(options.score)) {
      query = query.in('score', options.score);
    } else {
      query = query.eq('score', options.score);
    }
  }
  if (options.source) {
    if (Array.isArray(options.source)) {
      query = query.in('source', options.source);
    } else {
      query = query.eq('source', options.source);
    }
  }
  if (options.assignedToId) {
    query = query.eq('assigned_to_id', options.assignedToId);
  }
  if (options.minValue !== undefined) {
    query = query.gte('estimated_value', options.minValue);
  }
  if (options.maxValue !== undefined) {
    query = query.lte('estimated_value', options.maxValue);
  }
  if (options.needsFollowUp) {
    query = query.lte('next_follow_up_date', new Date().toISOString());
  }
  if (options.search) {
    query = query.or(
      `property_name.ilike.%${options.search}%,property_address.ilike.%${options.search}%`
    );
  }

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function getLead(id: string): Promise<DataResult<Lead>> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createLead(data: CreateLeadData): Promise<DataResult<Lead>> {
  const { data: result, error } = await supabase
    .from('leads')
    .insert({
      ...data,
      status: 'NEW' as LeadStatus,
      score: 'WARM' as LeadScore,
      probability: 25,
      tags: data.tags || [],
      contacts: data.contacts || [],
      days_in_stage: 0,
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateLead(
  id: string,
  data: UpdateLeadData
): Promise<DataResult<Lead>> {
  const updateData: Record<string, unknown> = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  // Update stage entered timestamp if pipeline stage changed
  if (data.pipeline_stage !== undefined) {
    updateData.stage_entered_at = new Date().toISOString();
    updateData.days_in_stage = 0;
  }

  const { data: result, error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function deleteLead(id: string): Promise<DataResult<null>> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  return handleSupabaseResult(null, error);
}

export async function convertLeadToDeal(
  leadId: string,
  dealData: Omit<CreateDealData, 'lead_id'>
): Promise<DataResult<Deal>> {
  // Get the lead first
  const { data: lead, error: leadError } = await getLead(leadId);
  if (leadError || !lead) {
    return { data: null, error: leadError || { message: 'Lead not found' } };
  }

  // Create the deal linked to the lead
  const { data: deal, error: dealError } = await createDeal({
    ...dealData,
    lead_id: leadId,
    name: dealData.name || lead.property_name,
    value: dealData.value || lead.estimated_value,
  });

  if (dealError) {
    return { data: null, error: dealError };
  }

  // Update the lead status to indicate conversion
  await updateLead(leadId, {
    status: 'QUALIFIED',
    pipeline_stage: 'CONVERTED',
  });

  return { data: deal, error: null };
}

// =============================================================================
// DEALS (Pipeline)
// =============================================================================

export interface GetDealsOptions {
  limit?: number;
  offset?: number;
  stage?: DealStage | DealStage[];
  assignedToId?: string;
  minValue?: number;
  maxValue?: number;
  search?: string;
  sortBy?: 'created_at' | 'updated_at' | 'value' | 'expected_close_date';
  sortOrder?: 'asc' | 'desc';
}

export async function getDeals(
  orgId: string,
  options: GetDealsOptions = {}
): Promise<DataListResult<Deal>> {
  let query = supabase
    .from('deals')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId);

  if (options.stage) {
    if (Array.isArray(options.stage)) {
      query = query.in('stage', options.stage);
    } else {
      query = query.eq('stage', options.stage);
    }
  }
  if (options.assignedToId) {
    query = query.eq('assigned_to_id', options.assignedToId);
  }
  if (options.minValue !== undefined) {
    query = query.gte('value', options.minValue);
  }
  if (options.maxValue !== undefined) {
    query = query.lte('value', options.maxValue);
  }
  if (options.search) {
    query = query.ilike('name', `%${options.search}%`);
  }

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function getDeal(id: string): Promise<DataResult<Deal>> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createDeal(data: CreateDealData): Promise<DataResult<Deal>> {
  const { data: result, error } = await supabase
    .from('deals')
    .insert({
      ...data,
      stage: data.stage || 'SOURCING',
      probability: data.probability || 25,
      tags: data.tags || [],
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateDeal(
  id: string,
  data: UpdateDealData
): Promise<DataResult<Deal>> {
  const { data: result, error } = await supabase
    .from('deals')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateDealStage(
  id: string,
  stage: DealStage
): Promise<DataResult<Deal>> {
  // Update probability based on stage
  const stageProbabilities: Record<DealStage, number> = {
    SOURCING: 10,
    INITIAL_REVIEW: 20,
    UNDERWRITING: 35,
    DUE_DILIGENCE: 50,
    NEGOTIATION: 65,
    UNDER_CONTRACT: 80,
    CLOSING: 90,
    CLOSED: 100,
    PASSED: 0,
  };

  const { data: result, error } = await supabase
    .from('deals')
    .update({
      stage,
      probability: stageProbabilities[stage],
      updated_at: new Date().toISOString(),
      ...(stage === 'CLOSED' ? { actual_close_date: new Date().toISOString() } : {}),
    })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function deleteDeal(id: string): Promise<DataResult<null>> {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  return handleSupabaseResult(null, error);
}

// =============================================================================
// OFFERINGS
// =============================================================================

export interface GetOfferingsOptions {
  limit?: number;
  offset?: number;
  status?: OfferingStatus | OfferingStatus[];
  regulationMode?: RegulationMode;
  search?: string;
  sortBy?: 'created_at' | 'name' | 'target_raise' | 'current_raised';
  sortOrder?: 'asc' | 'desc';
}

export async function getOfferings(
  orgId: string,
  options: GetOfferingsOptions = {}
): Promise<DataListResult<Offering>> {
  let query = supabase
    .from('offerings')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId);

  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status);
    } else {
      query = query.eq('status', options.status);
    }
  }
  if (options.regulationMode) {
    query = query.eq('regulation_mode', options.regulationMode);
  }
  if (options.search) {
    query = query.ilike('name', `%${options.search}%`);
  }

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function getOffering(id: string): Promise<DataResult<Offering>> {
  const { data, error } = await supabase
    .from('offerings')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createOffering(
  data: CreateOfferingData
): Promise<DataResult<Offering>> {
  const { data: result, error } = await supabase
    .from('offerings')
    .insert({
      ...data,
      status: data.status || 'draft',
      current_raised: 0,
      investor_count: 0,
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateOffering(
  id: string,
  data: UpdateOfferingData
): Promise<DataResult<Offering>> {
  const { data: result, error } = await supabase
    .from('offerings')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

// =============================================================================
// PROJECTS (Construction)
// =============================================================================

export interface GetProjectsOptions {
  limit?: number;
  offset?: number;
  phase?: ProjectPhase | ProjectPhase[];
  includeCompleted?: boolean;
  search?: string;
  sortBy?: 'created_at' | 'percent_complete' | 'planned_end_date';
  sortOrder?: 'asc' | 'desc';
}

export async function getProjects(
  orgId: string,
  options: GetProjectsOptions = {}
): Promise<DataListResult<Project>> {
  let query = supabase
    .from('projects')
    .select(`
      *,
      development_project:development_projects!inner(
        id,
        org_id,
        offering_id,
        name,
        address,
        project_type
      )
    `, { count: 'exact' })
    .eq('development_project.org_id', orgId)
    .is('deleted_at', null);

  if (options.phase) {
    if (Array.isArray(options.phase)) {
      query = query.in('phase', options.phase);
    } else {
      query = query.eq('phase', options.phase);
    }
  }
  if (!options.includeCompleted) {
    query = query.neq('phase', 'COMPLETED');
  }
  if (options.search) {
    query = query.ilike('development_project.name', `%${options.search}%`);
  }

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function getProject(id: string): Promise<DataResult<Project>> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      development_project:development_projects(
        id,
        org_id,
        offering_id,
        name,
        address,
        project_type
      )
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createProject(
  data: CreateProjectData
): Promise<DataResult<Project>> {
  const { data: result, error } = await supabase
    .from('projects')
    .insert({
      ...data,
      phase: data.phase || 'PRE_CONSTRUCTION',
      percent_complete: 0,
      spent_to_date: 0,
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateProject(
  id: string,
  data: UpdateProjectData
): Promise<DataResult<Project>> {
  const { data: result, error } = await supabase
    .from('projects')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateProjectProgress(
  id: string,
  percentComplete: number
): Promise<DataResult<Project>> {
  // Determine phase based on progress
  let phase: ProjectPhase = 'PRE_CONSTRUCTION';
  if (percentComplete >= 100) {
    phase = 'COMPLETED';
  } else if (percentComplete >= 85) {
    phase = 'CLOSEOUT';
  } else if (percentComplete >= 70) {
    phase = 'INTERIOR_FINISH';
  } else if (percentComplete >= 55) {
    phase = 'ENCLOSURE';
  } else if (percentComplete >= 40) {
    phase = 'MEP_ROUGH_IN';
  } else if (percentComplete >= 25) {
    phase = 'FRAMING';
  } else if (percentComplete >= 10) {
    phase = 'FOUNDATION';
  }

  const { data: result, error } = await supabase
    .from('projects')
    .update({
      percent_complete: percentComplete,
      phase,
      updated_at: new Date().toISOString(),
      ...(percentComplete >= 100 ? { actual_end_date: new Date().toISOString() } : {}),
    })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

// =============================================================================
// TASKS
// =============================================================================

export interface GetTasksOptions {
  limit?: number;
  offset?: number;
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  assignedToId?: string;
  parentId?: string | null;
  criticalPathOnly?: boolean;
  search?: string;
  sortBy?: 'created_at' | 'planned_end_date' | 'priority' | 'percent_complete';
  sortOrder?: 'asc' | 'desc';
}

export async function getTasks(
  projectId: string,
  options: GetTasksOptions = {}
): Promise<DataListResult<Task>> {
  let query = supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId)
    .is('deleted_at', null);

  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status);
    } else {
      query = query.eq('status', options.status);
    }
  }
  if (options.priority) {
    if (Array.isArray(options.priority)) {
      query = query.in('priority', options.priority);
    } else {
      query = query.eq('priority', options.priority);
    }
  }
  if (options.assignedToId) {
    query = query.eq('assigned_to_id', options.assignedToId);
  }
  if (options.parentId !== undefined) {
    if (options.parentId === null) {
      query = query.is('parent_id', null);
    } else {
      query = query.eq('parent_id', options.parentId);
    }
  }
  if (options.criticalPathOnly) {
    query = query.eq('is_critical_path', true);
  }
  if (options.search) {
    query = query.ilike('title', `%${options.search}%`);
  }

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'asc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function getTask(id: string): Promise<DataResult<Task>> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createTask(data: CreateTaskData): Promise<DataResult<Task>> {
  const { data: result, error } = await supabase
    .from('tasks')
    .insert({
      ...data,
      status: data.status || 'NOT_STARTED',
      priority: data.priority || 'MEDIUM',
      percent_complete: 0,
      predecessor_task_ids: data.predecessor_task_ids || [],
      lag_days: data.lag_days || 0,
      is_critical_path: data.is_critical_path || false,
      attachment_urls: data.attachment_urls || [],
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateTask(
  id: string,
  data: UpdateTaskData
): Promise<DataResult<Task>> {
  const { data: result, error } = await supabase
    .from('tasks')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<DataResult<Task>> {
  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  // Set actual dates based on status
  if (status === 'IN_PROGRESS') {
    updateData.actual_start_date = new Date().toISOString();
  } else if (status === 'COMPLETED') {
    updateData.actual_end_date = new Date().toISOString();
    updateData.percent_complete = 100;
  }

  const { data: result, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function deleteTask(id: string): Promise<DataResult<null>> {
  // Soft delete
  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  return handleSupabaseResult(null, error);
}

// =============================================================================
// DAILY LOGS
// =============================================================================

export interface GetDailyLogsOptions {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  weather?: WeatherCondition;
  sortOrder?: 'asc' | 'desc';
}

export async function getDailyLogs(
  projectId: string,
  options: GetDailyLogsOptions = {}
): Promise<DataListResult<DailyLog>> {
  let query = supabase
    .from('daily_logs')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId);

  if (options.startDate) {
    query = query.gte('log_date', options.startDate);
  }
  if (options.endDate) {
    query = query.lte('log_date', options.endDate);
  }
  if (options.weather) {
    query = query.eq('weather', options.weather);
  }

  const sortOrder = options.sortOrder || 'desc';
  query = query.order('log_date', { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function getDailyLog(id: string): Promise<DataResult<DailyLog>> {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createDailyLog(
  data: CreateDailyLogData
): Promise<DataResult<DailyLog>> {
  const { data: result, error } = await supabase
    .from('daily_logs')
    .insert({
      ...data,
      equipment_used: data.equipment_used || [],
      photo_urls: data.photo_urls || [],
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

export async function updateDailyLog(
  id: string,
  data: UpdateDailyLogData
): Promise<DataResult<DailyLog>> {
  const { data: result, error } = await supabase
    .from('daily_logs')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

// =============================================================================
// TRANSACTIONS
// =============================================================================

export interface GetTransactionsOptions {
  limit?: number;
  offset?: number;
  type?: TransactionType | TransactionType[];
  status?: TransactionStatus | TransactionStatus[];
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'initiated_at' | 'amount' | 'completed_at';
  sortOrder?: 'asc' | 'desc';
}

export async function getTransactions(
  orgId: string,
  options: GetTransactionsOptions = {}
): Promise<DataListResult<Transaction>> {
  // Transactions are linked through offerings
  let query = supabase
    .from('transactions')
    .select(`
      *,
      offering:offerings!inner(org_id)
    `, { count: 'exact' })
    .eq('offering.org_id', orgId);

  if (options.type) {
    if (Array.isArray(options.type)) {
      query = query.in('transaction_type', options.type);
    } else {
      query = query.eq('transaction_type', options.type);
    }
  }
  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status);
    } else {
      query = query.eq('status', options.status);
    }
  }
  if (options.startDate) {
    query = query.gte('initiated_at', options.startDate);
  }
  if (options.endDate) {
    query = query.lte('initiated_at', options.endDate);
  }
  if (options.minAmount !== undefined) {
    query = query.gte('amount', options.minAmount);
  }
  if (options.maxAmount !== undefined) {
    query = query.lte('amount', options.maxAmount);
  }

  const sortBy = options.sortBy || 'initiated_at';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;

  // Remove the nested offering from the result
  const cleanedData = data?.map(({ offering, ...rest }) => rest as Transaction) || [];
  return handleSupabaseListResult(cleanedData, count, error);
}

export async function getTransaction(id: string): Promise<DataResult<Transaction>> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single();

  return handleSupabaseResult(data, error);
}

export async function createTransaction(
  data: CreateTransactionData
): Promise<DataResult<Transaction>> {
  const netAmount = data.amount - (data.fee_amount || 0);

  const { data: result, error } = await supabase
    .from('transactions')
    .insert({
      ...data,
      currency: data.currency || 'USD',
      status: 'PENDING' as TransactionStatus,
      net_amount: netAmount,
      initiated_at: new Date().toISOString(),
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

// =============================================================================
// DISTRIBUTIONS
// =============================================================================

export interface GetDistributionsOptions {
  limit?: number;
  offset?: number;
  status?: DistributionStatus | DistributionStatus[];
  type?: DistributionType | DistributionType[];
  startDate?: string;
  endDate?: string;
  sortBy?: 'distribution_date' | 'total_amount' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export async function getDistributions(
  offeringId: string,
  options: GetDistributionsOptions = {}
): Promise<DataListResult<Distribution>> {
  let query = supabase
    .from('distributions')
    .select('*', { count: 'exact' })
    .eq('offering_id', offeringId);

  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status);
    } else {
      query = query.eq('status', options.status);
    }
  }
  if (options.type) {
    if (Array.isArray(options.type)) {
      query = query.in('distribution_type', options.type);
    } else {
      query = query.eq('distribution_type', options.type);
    }
  }
  if (options.startDate) {
    query = query.gte('distribution_date', options.startDate);
  }
  if (options.endDate) {
    query = query.lte('distribution_date', options.endDate);
  }

  const sortBy = options.sortBy || 'distribution_date';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function createDistribution(
  data: CreateDistributionData
): Promise<DataResult<Distribution>> {
  const { data: result, error } = await supabase
    .from('distributions')
    .insert({
      ...data,
      status: 'DRAFT' as DistributionStatus,
      notification_sent: false,
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

// =============================================================================
// INVESTORS (Investments)
// =============================================================================

export interface GetInvestorsOptions {
  limit?: number;
  offset?: number;
  status?: InvestmentStatus | InvestmentStatus[];
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'investment_amount' | 'created_at' | 'funded_at';
  sortOrder?: 'asc' | 'desc';
}

export async function getInvestors(
  offeringId: string,
  options: GetInvestorsOptions = {}
): Promise<DataListResult<Investment>> {
  let query = supabase
    .from('investments')
    .select('*', { count: 'exact' })
    .eq('offering_id', offeringId);

  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status);
    } else {
      query = query.eq('status', options.status);
    }
  }
  if (options.minAmount !== undefined) {
    query = query.gte('investment_amount', options.minAmount);
  }
  if (options.maxAmount !== undefined) {
    query = query.lte('investment_amount', options.maxAmount);
  }

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function getInvestorsByUser(
  userId: string,
  options: Omit<GetInvestorsOptions, 'sortBy'> & {
    sortBy?: 'investment_amount' | 'created_at' | 'funded_at';
  } = {}
): Promise<DataListResult<Investment>> {
  let query = supabase
    .from('investments')
    .select('*', { count: 'exact' })
    .eq('investor_id', userId);

  if (options.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status);
    } else {
      query = query.eq('status', options.status);
    }
  }
  if (options.minAmount !== undefined) {
    query = query.gte('investment_amount', options.minAmount);
  }
  if (options.maxAmount !== undefined) {
    query = query.lte('investment_amount', options.maxAmount);
  }

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, count, error } = await query;
  return handleSupabaseListResult(data, count, error);
}

export async function createInvestor(
  data: CreateInvestmentData
): Promise<DataResult<Investment>> {
  const { data: result, error } = await supabase
    .from('investments')
    .insert({
      ...data,
      current_balance: data.investment_amount,
      returned_capital: 0,
      preferred_return_rate: data.preferred_return_rate || 0.08,
      preferred_return_owed: 0,
      preferred_return_paid: 0,
      profits_paid: 0,
      status: 'PENDING' as InvestmentStatus,
    })
    .select()
    .single();

  return handleSupabaseResult(result, error);
}

// =============================================================================
// ANALYTICS / DASHBOARD
// =============================================================================

export async function getDashboardMetrics(
  orgId: string
): Promise<DataResult<DashboardMetrics>> {
  try {
    // Fetch all metrics in parallel for performance
    const [
      propertiesResult,
      dealsResult,
      leadsResult,
      projectsResult,
      tasksResult,
      transactionsResult,
    ] = await Promise.all([
      // Properties count
      supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', orgId),

      // Active deals with pipeline value
      supabase
        .from('deals')
        .select('id, stage, value')
        .eq('org_id', orgId)
        .not('stage', 'in', '(CLOSED,PASSED)'),

      // Leads by status
      supabase
        .from('leads')
        .select('status')
        .eq('org_id', orgId),

      // Active projects
      supabase
        .from('projects')
        .select(`
          id,
          phase,
          schedule_variance_days,
          development_project:development_projects!inner(org_id)
        `)
        .eq('development_project.org_id', orgId)
        .is('deleted_at', null)
        .neq('phase', 'COMPLETED'),

      // Open tasks
      supabase
        .from('tasks')
        .select('id, project_id')
        .in('status', ['NOT_STARTED', 'IN_PROGRESS'])
        .is('deleted_at', null),

      // Monthly transaction summary (last 12 months)
      supabase
        .from('transactions')
        .select(`
          id,
          transaction_type,
          amount,
          initiated_at,
          offering:offerings!inner(org_id)
        `)
        .eq('offering.org_id', orgId)
        .eq('status', 'COMPLETED')
        .gte('initiated_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    // Calculate leads by status
    const leadsByStatus: Record<LeadStatus, number> = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFYING: 0,
      QUALIFIED: 0,
      NEGOTIATING: 0,
      UNDER_CONTRACT: 0,
      CLOSED: 0,
      LOST: 0,
      COLD: 0,
    };
    leadsResult.data?.forEach((lead) => {
      if (lead.status in leadsByStatus) {
        leadsByStatus[lead.status as LeadStatus]++;
      }
    });

    // Calculate deals by stage
    const dealsByStage: Record<DealStage, number> = {
      SOURCING: 0,
      INITIAL_REVIEW: 0,
      UNDERWRITING: 0,
      DUE_DILIGENCE: 0,
      NEGOTIATION: 0,
      UNDER_CONTRACT: 0,
      CLOSING: 0,
      CLOSED: 0,
      PASSED: 0,
    };
    let totalPipelineValue = 0;
    dealsResult.data?.forEach((deal) => {
      if (deal.stage in dealsByStage) {
        dealsByStage[deal.stage as DealStage]++;
      }
      totalPipelineValue += deal.value || 0;
    });

    // Calculate projects on schedule
    const activeProjects = projectsResult.data || [];
    const projectsOnSchedule = activeProjects.filter(
      (p) => (p.schedule_variance_days || 0) <= 0
    ).length;

    // Calculate monthly transactions
    const monthlyData: Record<string, { investments: number; distributions: number; count: number }> = {};
    transactionsResult.data?.forEach((tx) => {
      const month = new Date(tx.initiated_at).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { investments: 0, distributions: 0, count: 0 };
      }
      monthlyData[month].count++;
      if (tx.transaction_type === 'INVESTMENT') {
        monthlyData[month].investments += Number(tx.amount) || 0;
      } else if (tx.transaction_type === 'DISTRIBUTION') {
        monthlyData[month].distributions += Number(tx.amount) || 0;
      }
    });

    const monthlyTransactions: MonthlyTransactionSummary[] = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate totals from transactions
    let totalInvested = 0;
    let totalDistributions = 0;
    transactionsResult.data?.forEach((tx) => {
      if (tx.transaction_type === 'INVESTMENT') {
        totalInvested += Number(tx.amount) || 0;
      } else if (tx.transaction_type === 'DISTRIBUTION') {
        totalDistributions += Number(tx.amount) || 0;
      }
    });

    const metrics: DashboardMetrics = {
      total_properties: propertiesResult.count || 0,
      active_deals: dealsResult.data?.length || 0,
      total_pipeline_value: totalPipelineValue,
      total_invested: totalInvested,
      total_distributions: totalDistributions,
      active_projects: activeProjects.length,
      projects_on_schedule: projectsOnSchedule,
      open_tasks: tasksResult.data?.length || 0,
      leads_by_status: leadsByStatus,
      deals_by_stage: dealsByStage,
      monthly_transactions: monthlyTransactions,
    };

    return { data: metrics, error: null };
  } catch (error) {
    return { data: null, error: formatError(error) };
  }
}

export async function getPortfolioSummary(
  orgId: string
): Promise<DataResult<PortfolioSummary>> {
  try {
    // Get all investments for the organization's offerings
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select(`
        id,
        investment_amount,
        current_balance,
        returned_capital,
        profits_paid,
        status,
        offering:offerings!inner(
          id,
          name,
          org_id
        )
      `)
      .eq('offering.org_id', orgId)
      .eq('status', 'ACTIVE');

    if (investmentsError) {
      return { data: null, error: formatError(investmentsError) };
    }

    // Calculate portfolio metrics
    let totalInvested = 0;
    let currentValue = 0;
    const investmentSummaries: InvestmentSummary[] = [];

    investments?.forEach((inv) => {
      totalInvested += inv.investment_amount || 0;
      currentValue += inv.current_balance || 0;

      const offering = inv.offering as unknown as { name: string } | null;
      investmentSummaries.push({
        id: inv.id,
        offering_name: offering?.name || 'Unknown',
        invested_amount: inv.investment_amount,
        current_value: inv.current_balance,
        return_to_date: inv.profits_paid + inv.returned_capital,
        status: inv.status as InvestmentStatus,
      });
    });

    const totalGain = currentValue - totalInvested;
    const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

    // Get unique offerings and development projects counts
    const { count: offeringsCount } = await supabase
      .from('offerings')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .in('status', ['active', 'funded']);

    const { count: projectsCount } = await supabase
      .from('development_projects')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId);

    const summary: PortfolioSummary = {
      total_invested: totalInvested,
      current_value: currentValue,
      total_gain: totalGain,
      total_gain_percent: totalGainPercent,
      weighted_avg_irr: 0, // Would need more complex calculation
      portfolio_tvpi: totalInvested > 0 ? currentValue / totalInvested : 0,
      active_investments: investments?.length || 0,
      properties: projectsCount || 0,
      funds: offeringsCount || 0,
      investments: investmentSummaries,
    };

    return { data: summary, error: null };
  } catch (error) {
    return { data: null, error: formatError(error) };
  }
}

// =============================================================================
// REAL-TIME SUBSCRIPTIONS
// =============================================================================

export type SubscriptionEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface SubscriptionPayload<T> {
  commit_timestamp: string;
  eventType: SubscriptionEvent;
  new: T | null;
  old: T | null;
  schema: string;
  table: string;
  errors: string[] | null;
}

export type SubscriptionCallback<T> = (payload: SubscriptionPayload<T>) => void;

interface SubscriptionConfig {
  table: string;
  event?: SubscriptionEvent;
  filter?: string;
  callback: (payload: SubscriptionPayload<Record<string, unknown>>) => void;
}

/**
 * Creates a real-time subscription for database changes
 */
export function createSubscription(config: SubscriptionConfig): RealtimeChannel {
  const { table, event = '*', filter, callback } = config;

  const channel = supabase.channel(`${table}_changes_${Date.now()}`);

  // Build the subscription configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscribeConfig: any = {
    event,
    schema: 'public',
    table,
  };

  if (filter) {
    subscribeConfig.filter = filter;
  }

  channel
    .on('postgres_changes', subscribeConfig, (payload: unknown) => {
      callback(payload as SubscriptionPayload<Record<string, unknown>>);
    })
    .subscribe();

  return channel;
}

/**
 * Unsubscribes from a channel
 */
export async function unsubscribe(channel: RealtimeChannel): Promise<void> {
  await supabase.removeChannel(channel);
}

// Convenience subscription helpers

export function subscribeToProperties(
  orgId: string,
  callback: SubscriptionCallback<Property>
): RealtimeChannel {
  return createSubscription({
    table: 'properties',
    filter: `org_id=eq.${orgId}`,
    callback: callback as unknown as SubscriptionCallback<Record<string, unknown>>,
  });
}

export function subscribeToLeads(
  orgId: string,
  callback: SubscriptionCallback<Lead>
): RealtimeChannel {
  return createSubscription({
    table: 'leads',
    filter: `org_id=eq.${orgId}`,
    callback: callback as unknown as SubscriptionCallback<Record<string, unknown>>,
  });
}

export function subscribeToDeals(
  orgId: string,
  callback: SubscriptionCallback<Deal>
): RealtimeChannel {
  return createSubscription({
    table: 'deals',
    filter: `org_id=eq.${orgId}`,
    callback: callback as unknown as SubscriptionCallback<Record<string, unknown>>,
  });
}

export function subscribeToTasks(
  projectId: string,
  callback: SubscriptionCallback<Task>
): RealtimeChannel {
  return createSubscription({
    table: 'tasks',
    filter: `project_id=eq.${projectId}`,
    callback: callback as unknown as SubscriptionCallback<Record<string, unknown>>,
  });
}

export function subscribeToProjectProgress(
  projectId: string,
  callback: SubscriptionCallback<Project>
): RealtimeChannel {
  return createSubscription({
    table: 'projects',
    event: 'UPDATE',
    filter: `id=eq.${projectId}`,
    callback: callback as unknown as SubscriptionCallback<Record<string, unknown>>,
  });
}

export function subscribeToTransactions(
  offeringId: string,
  callback: SubscriptionCallback<Transaction>
): RealtimeChannel {
  return createSubscription({
    table: 'transactions',
    filter: `offering_id=eq.${offeringId}`,
    callback: callback as unknown as SubscriptionCallback<Record<string, unknown>>,
  });
}

// =============================================================================
// HELPER FUNCTIONS FOR COMMON QUERIES
// =============================================================================

/**
 * Get properties in a specific pipeline stage
 */
export async function getPropertiesByStage(
  orgId: string,
  stage: DealStage
): Promise<DataListResult<Property>> {
  return getProperties(orgId, { dealStage: stage });
}

/**
 * Get hot leads that need follow-up
 */
export async function getHotLeadsNeedingFollowUp(
  orgId: string
): Promise<DataListResult<Lead>> {
  return getLeads(orgId, {
    score: 'HOT',
    needsFollowUp: true,
    sortBy: 'next_follow_up_date',
    sortOrder: 'asc',
  });
}

/**
 * Get deals closing this month
 */
export async function getDealsClosingThisMonth(
  orgId: string
): Promise<DataListResult<Deal>> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const { data, count, error } = await supabase
    .from('deals')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .gte('expected_close_date', startOfMonth)
    .lte('expected_close_date', endOfMonth)
    .not('stage', 'in', '(CLOSED,PASSED)');

  return handleSupabaseListResult(data, count, error);
}

/**
 * Get overdue tasks
 */
export async function getOverdueTasks(
  projectId: string
): Promise<DataListResult<Task>> {
  const { data, count, error } = await supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .lt('planned_end_date', new Date().toISOString())
    .in('status', ['NOT_STARTED', 'IN_PROGRESS']);

  return handleSupabaseListResult(data, count, error);
}

/**
 * Get critical path tasks
 */
export async function getCriticalPathTasks(
  projectId: string
): Promise<DataListResult<Task>> {
  return getTasks(projectId, {
    criticalPathOnly: true,
    sortBy: 'planned_end_date',
    sortOrder: 'asc',
  });
}

/**
 * Get recent daily logs
 */
export async function getRecentDailyLogs(
  projectId: string,
  days: number = 7
): Promise<DataListResult<DailyLog>> {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  return getDailyLogs(projectId, { startDate, limit: days });
}

/**
 * Get pending transactions
 */
export async function getPendingTransactions(
  orgId: string
): Promise<DataListResult<Transaction>> {
  return getTransactions(orgId, {
    status: ['PENDING', 'PROCESSING', 'REQUIRES_APPROVAL'],
    sortBy: 'initiated_at',
    sortOrder: 'desc',
  });
}

/**
 * Get active investments for a user
 */
export async function getActiveInvestments(
  userId: string
): Promise<DataListResult<Investment>> {
  return getInvestorsByUser(userId, { status: 'ACTIVE' });
}

/**
 * Search across multiple entity types
 */
export async function globalSearch(
  orgId: string,
  query: string,
  options: { limit?: number } = {}
): Promise<{
  properties: Property[];
  leads: Lead[];
  deals: Deal[];
  offerings: Offering[];
}> {
  const limit = options.limit || 5;

  const [properties, leads, deals, offerings] = await Promise.all([
    getProperties(orgId, { search: query, limit }),
    getLeads(orgId, { search: query, limit }),
    getDeals(orgId, { search: query, limit }),
    getOfferings(orgId, { search: query, limit }),
  ]);

  return {
    properties: properties.data,
    leads: leads.data,
    deals: deals.data,
    offerings: offerings.data,
  };
}

// =============================================================================
// BATCH OPERATIONS
// =============================================================================

/**
 * Bulk update task statuses
 */
export async function bulkUpdateTaskStatus(
  taskIds: string[],
  status: TaskStatus
): Promise<DataResult<number>> {
  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'IN_PROGRESS') {
    updateData.actual_start_date = new Date().toISOString();
  } else if (status === 'COMPLETED') {
    updateData.actual_end_date = new Date().toISOString();
    updateData.percent_complete = 100;
  }

  const { error, count } = await supabase
    .from('tasks')
    .update(updateData)
    .in('id', taskIds);

  if (error) {
    return { data: null, error: formatError(error) };
  }

  return { data: count || 0, error: null };
}

/**
 * Bulk add tags to leads
 */
export async function bulkAddLeadTags(
  leadIds: string[],
  tags: string[]
): Promise<DataResult<number>> {
  // This requires fetching and updating each lead to merge tags
  // In a real implementation, you might use a stored procedure
  let successCount = 0;

  for (const leadId of leadIds) {
    const { data: lead } = await getLead(leadId);
    if (lead) {
      const combinedTags = [...lead.tags, ...tags];
      const newTags = Array.from(new Set(combinedTags));
      const { error } = await updateLead(leadId, { tags: newTags });
      if (!error) successCount++;
    }
  }

  return { data: successCount, error: null };
}

/**
 * Bulk assign leads to user
 */
export async function bulkAssignLeads(
  leadIds: string[],
  assignedToId: string
): Promise<DataResult<number>> {
  const { error, count } = await supabase
    .from('leads')
    .update({
      assigned_to_id: assignedToId,
      updated_at: new Date().toISOString(),
    })
    .in('id', leadIds);

  if (error) {
    return { data: null, error: formatError(error) };
  }

  return { data: count || 0, error: null };
}

// =============================================================================
// EXPORT DEFAULT OBJECT FOR CONVENIENCE
// =============================================================================

export const supabaseData = {
  // Organizations
  getOrganization,
  createOrganization,
  updateOrganization,

  // Properties
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByStage,

  // Leads
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  convertLeadToDeal,
  getHotLeadsNeedingFollowUp,

  // Deals
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
  getDealsClosingThisMonth,

  // Offerings
  getOfferings,
  getOffering,
  createOffering,
  updateOffering,

  // Projects
  getProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectProgress,

  // Tasks
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getOverdueTasks,
  getCriticalPathTasks,

  // Daily Logs
  getDailyLogs,
  getDailyLog,
  createDailyLog,
  updateDailyLog,
  getRecentDailyLogs,

  // Transactions
  getTransactions,
  getTransaction,
  createTransaction,
  getPendingTransactions,

  // Distributions
  getDistributions,
  createDistribution,

  // Investors
  getInvestors,
  getInvestorsByUser,
  createInvestor,
  getActiveInvestments,

  // Analytics
  getDashboardMetrics,
  getPortfolioSummary,
  globalSearch,

  // Subscriptions
  createSubscription,
  unsubscribe,
  subscribeToProperties,
  subscribeToLeads,
  subscribeToDeals,
  subscribeToTasks,
  subscribeToProjectProgress,
  subscribeToTransactions,

  // Batch Operations
  bulkUpdateTaskStatus,
  bulkAddLeadTags,
  bulkAssignLeads,
};

export default supabaseData;
